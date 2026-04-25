import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Look up the most recent unused code for this email
    const lookupRes = await fetch(
      `${supabaseUrl}/rest/v1/otp_codes?email=eq.${encodeURIComponent(email)}&used=eq.false&order=created_at.desc&limit=1`,
      {
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    const codes = await lookupRes.json();

    if (!codes || codes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid code found. Please request a new one." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otpRecord = codes[0];

    // Check if code matches
    if (otpRecord.code !== code) {
      return new Response(
        JSON.stringify({ error: "Invalid code. Please try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "Code expired. Please request a new one." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark code as used
    await fetch(`${supabaseUrl}/rest/v1/otp_codes?id=eq.${otpRecord.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ used: true }),
    });

    // Check if user already exists
    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );

    const usersData = await usersRes.json();
    const existingUser = usersData.users && usersData.users.length > 0
      ? usersData.users[0]
      : null;

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user with email_confirmed=true so no confirmation email is sent
      const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          email,
          email_confirm: true,
        }),
      });

      const createData = await createRes.json();

      if (!createData.id) {
        return new Response(
          JSON.stringify({ error: "Failed to create account. Please try again." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = createData.id;
    }

    // Generate a session for the user using the admin generate_link API
    // Use "signup" type which returns tokens without sending an email
    const linkRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({
        type: "signup",
        email,
      }),
    });

    const linkData = await linkRes.json();

    let accessToken = "";
    let refreshToken = "";

    if (linkData.action_link) {
      const url = new URL(linkData.action_link);
      accessToken = url.searchParams.get("access_token") || "";
      refreshToken = url.searchParams.get("refresh_token") || "";
    }

    // If generate_link didn't return tokens, try magiclink type
    if (!accessToken) {
      const magicRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          type: "magiclink",
          email,
        }),
      });

      const magicData = await magicRes.json();

      if (magicData.action_link) {
        const url = new URL(magicData.action_link);
        accessToken = url.searchParams.get("access_token") || "";
        refreshToken = url.searchParams.get("refresh_token") || "";
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: existingUser ? "Signed in successfully" : "Account created successfully",
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Verify OTP error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
