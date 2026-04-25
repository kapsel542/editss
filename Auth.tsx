import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Mail, ArrowRight, RefreshCw, CheckCircle, Video, Sparkles, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = { onNavigate: (page: string) => void };

type Step = 'email' | 'otp' | 'success';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function AnimatedLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
      <div
        className="animate-pulse-glow"
        style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--cyan), var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Video size={20} style={{ color: '#07070f' }} />
      </div>
      <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>ClipForge</span>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'var(--cyan)' : i % 3 === 1 ? 'var(--green)' : 'var(--orange)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.4 + 0.1,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Auth({ onNavigate }: Props) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [devCode, setDevCode] = useState('');
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setInterval(() => {
        setResendTimer(t => {
          if (t <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resendTimer]);

  const sendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      // Store the dev code for display (in production, this would be sent via email)
      if (data.code) {
        setDevCode(data.code);
      }

      setStep('otp');
      setResendTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      setTimeout(() => verifyOtp(newOtp.join('')), 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (code?: string) => {
    const token = code || otp.join('');
    if (token.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, code: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      // If we got tokens back, set the session
      if (data.access_token && data.refresh_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        if (sessionError) throw sessionError;
      }

      setStep('success');
      setTimeout(() => onNavigate('dashboard'), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.code) {
        setDevCode(data.code);
      }

      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-primary)' }}>
      {/* Left — decorative */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(0,255,157,0.03) 100%)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, overflow: 'hidden' }}>
        <FloatingParticles />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }} className="gradient-text">Clip</div>
          <div style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--text-primary)' }}>Forge</div>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, var(--cyan), var(--green))', borderRadius: 2, margin: '20px auto' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
            The world's most powerful free video editor. No limits. No watermarks. No cost.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48, textAlign: 'left' }}>
            {[
              { icon: <Zap size={16} />, text: 'Instant AI video generation' },
              { icon: <Shield size={16} />, text: 'Secure cloud storage included' },
              { icon: <Sparkles size={16} />, text: '200+ animated templates' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 10 }}>
                <div style={{ color: 'var(--cyan)' }}>{item.icon}</div>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating visual elements */}
        <div className="animate-float" style={{ position: 'absolute', top: 60, right: 40, width: 100, height: 100, borderRadius: 20, overflow: 'hidden', opacity: 0.6 }}>
          <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=200" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="animate-float-delay" style={{ position: 'absolute', bottom: 100, left: 40, width: 80, height: 80, borderRadius: 16, overflow: 'hidden', opacity: 0.5 }}>
          <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=160" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <AnimatedLogo />

          {/* Step: Email */}
          {step === 'email' && (
            <div className="animate-slide-up">
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Welcome back</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 40px', fontSize: 15 }}>Enter your email to get a verification code</p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    placeholder="you@example.com"
                    style={{
                      width: '100%', padding: '14px 14px 14px 42px', borderRadius: 10, fontSize: 15,
                      background: 'var(--bg-card)', border: `1px solid ${error ? '#ff4444' : 'var(--border)'}`,
                      color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                    onBlur={e => (e.target.style.borderColor = error ? '#ff4444' : 'var(--border)')}
                  />
                </div>
                {error && <div style={{ color: '#ff4444', fontSize: 13, marginTop: 6 }}>{error}</div>}
              </div>

              <button
                className="btn-primary"
                onClick={sendOtp}
                disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading ? <><span className="dot-loading"><span /><span /><span /></span></> : <><Mail size={16} /> Send Verification Code <ArrowRight size={16} /></>}
              </button>

              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
                New to ClipForge? A free account will be created automatically.
              </p>
            </div>
          )}

          {/* Step: OTP */}
          {step === 'otp' && (
            <div className="animate-slide-up">
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Mail size={24} style={{ color: 'var(--cyan)' }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Enter your code</h1>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 8px', fontSize: 15 }}>
                We sent a 6-digit code to
              </p>
              <p style={{ color: 'var(--cyan)', margin: '0 0 36px', fontSize: 15, fontWeight: 600 }}>{email}</p>

              {/* Dev code display — shows the code for easy copy-paste */}
              {devCode && (
                <div style={{
                  background: 'rgba(0,255,157,0.06)',
                  border: '1px solid rgba(0,255,157,0.2)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Your verification code
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '0.15em', color: 'var(--green)', fontFamily: 'monospace' }}>
                    {devCode}
                  </div>
                </div>
              )}

              {/* OTP inputs */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className={`otp-input${digit ? ' filled' : ''}`}
                  />
                ))}
              </div>

              {error && (
                <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 8, padding: '10px 14px', color: '#ff4444', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => verifyOtp()}
                disabled={loading || otp.join('').length !== 6}
                style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: otp.join('').length !== 6 ? 0.5 : 1 }}
              >
                {loading ? <span className="dot-loading"><span /><span /><span /></span> : 'Verify Code'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <button
                  onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']); setError(''); setDevCode(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, padding: 0 }}
                >
                  ← Change email
                </button>
                <button
                  onClick={resend}
                  disabled={resendTimer > 0 || loading}
                  style={{ background: 'none', border: 'none', color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--cyan)', cursor: resendTimer > 0 ? 'default' : 'pointer', fontSize: 13, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <RefreshCw size={12} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="animate-slide-up" style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,255,157,0.1)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }} className="animate-pulse-glow">
                <CheckCircle size={36} style={{ color: 'var(--green)' }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>You're in!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Welcome to ClipForge. Redirecting to your dashboard...</p>
              <div style={{ marginTop: 24, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--green))', animation: 'progress-fill 2s linear forwards', width: '0%' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress-fill { from { width: 0% } to { width: 100% } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="borderRight: 1px solid"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
