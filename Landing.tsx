import { Play, Zap, Star, Users, Video, Layers, Music, Type, Wand2, Share2, Download, ChevronRight, Check, Globe, Clock, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = { onNavigate: (page: string) => void };

const TEMPLATES = [
  { id: '1', name: 'Social Reel', category: 'Social', color: '#00d4ff', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=400&h=225&fit=crop', duration: '30s' },
  { id: '2', name: 'Product Promo', category: 'Marketing', color: '#00ff9d', img: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=400&h=225&fit=crop', duration: '60s' },
  { id: '3', name: 'Wedding Film', category: 'Events', color: '#ff9500', img: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=400&h=225&fit=crop', duration: '3min' },
  { id: '4', name: 'YouTube Intro', category: 'Content', color: '#ff4444', img: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=400&h=225&fit=crop', duration: '15s' },
  { id: '5', name: 'Real Estate', category: 'Business', color: '#00d4ff', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=400&h=225&fit=crop', duration: '90s' },
  { id: '6', name: 'Food Story', category: 'Social', color: '#ff6b35', img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=400&h=225&fit=crop', duration: '45s' },
  { id: '7', name: 'Travel Vlog', category: 'Content', color: '#00ff9d', img: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=400&h=225&fit=crop', duration: '2min' },
  { id: '8', name: 'Fashion Ad', category: 'Marketing', color: '#ff4444', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=225&fit=crop', duration: '30s' },
];

const FEATURES = [
  { icon: <Wand2 size={24} />, title: 'AI Video Generator', desc: 'Generate stunning videos from text prompts instantly — no waiting, completely free.' },
  { icon: <Layers size={24} />, title: '200+ Templates', desc: 'Professional templates for every occasion — social, business, events, and more.' },
  { icon: <Music size={24} />, title: 'Royalty-Free Music', desc: 'Thousands of music tracks and sound effects — use them freely in any video.' },
  { icon: <Type size={24} />, title: 'Animated Text', desc: 'Beautiful text animations, captions, and typography to make your content pop.' },
  { icon: <Video size={24} />, title: 'Multi-Track Timeline', desc: 'Professional timeline editor with video, audio, and text tracks.' },
  { icon: <Share2 size={24} />, title: 'Instant Publishing', desc: 'Publish and share your videos with a single click. No export limits.' },
  { icon: <Download size={24} />, title: 'Free Downloads', desc: 'Download your videos in HD quality — no watermarks, no subscriptions.' },
  { icon: <Globe size={24} />, title: 'Cloud Storage', desc: 'All your projects saved in the cloud — access from any device.' },
];

const STATS = [
  { value: '5M+', label: 'Videos Created' },
  { value: '200+', label: 'Templates' },
  { value: '100%', label: 'Free' },
  { value: '0s', label: 'Wait Time' },
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }> = [];
    const colors = ['#00d4ff', '#00ff9d', '#ff6b35'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

function CountUp({ target }: { target: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return <span ref={ref} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>{target}</span>;
}

export default function Landing({ onNavigate }: Props) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <ParticleField />

        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,157,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
          <div className="tag tag-cyan animate-slide-up" style={{ marginBottom: 24 }}>
            <Sparkles size={12} style={{ marginRight: 4 }} />
            100% Free — No Credit Card
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.03em' }} className="animate-slide-up">
            Create Stunning Videos<br />
            <span className="gradient-text">In Minutes, For Free</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }} className="animate-slide-up">
            Professional video editor with 200+ templates, AI generation, animated effects, royalty-free music — all completely free. No watermarks. No waiting.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }} className="animate-slide-up">
            <button className="btn-primary" onClick={() => onNavigate('auth')} style={{ padding: '14px 36px', borderRadius: 12, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              Start Creating Free <ChevronRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('editor')} style={{ padding: '14px 36px', borderRadius: 12, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={18} /> Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 48, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No watermarks', 'No credit card', 'Unlimited exports', 'Cloud storage'].map(badge => (
              <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
                <Check size={14} style={{ color: 'var(--green)' }} />
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Floating video preview cards */}
        <div style={{ position: 'absolute', right: '3%', top: '15%', opacity: 0.7 }} className="animate-float">
          <div className="glass" style={{ borderRadius: 16, overflow: 'hidden', width: 160, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=320" alt="" style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 600 }}>SOCIAL REEL</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>30s · HD</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: '3%', bottom: '25%', opacity: 0.6 }} className="animate-float-delay">
          <div className="glass" style={{ borderRadius: 16, overflow: 'hidden', width: 140, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <img src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=280" alt="" style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>AI GENERATED</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Instant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.03em' }} className="gradient-text">
                <CountUp target={s.value} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="tag tag-green" style={{ marginBottom: 16 }}>Templates</div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              200+ Professional Templates
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
              Start with a template and customize every detail — or build from scratch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                onMouseEnter={() => setHoveredTemplate(tpl.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => onNavigate('editor')}
                style={{
                  borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                  border: `1px solid ${hoveredTemplate === tpl.id ? tpl.color + '60' : 'var(--border)'}`,
                  background: 'var(--bg-card)',
                  transform: hoveredTemplate === tpl.id ? 'translateY(-6px)' : 'translateY(0)',
                  boxShadow: hoveredTemplate === tpl.id ? `0 20px 50px ${tpl.color}20` : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img src={tpl.img} alt={tpl.name} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hoveredTemplate === tpl.id ? 'scale(1.05)' : 'scale(1)' }} />
                  {hoveredTemplate === tpl.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={20} style={{ color: '#07070f', marginLeft: 3 }} />
                      </div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="tag" style={{ background: tpl.color + '20', color: tpl.color, border: `1px solid ${tpl.color}40`, fontSize: 10 }}>{tpl.category}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{tpl.duration}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{tpl.name}</span>
                  <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>Free</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button className="btn-secondary" onClick={() => onNavigate('auth')} style={{ padding: '12px 32px', borderRadius: 10, fontSize: 15 }}>
              View All 200+ Templates
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="tag tag-orange" style={{ marginBottom: 16 }}>Features</div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Everything You Need to Create
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ padding: '60px 40px', borderRadius: 24, background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,255,157,0.05) 100%)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Start Creating Today —<br /><span className="gradient-text">It's 100% Free</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, marginBottom: 36 }}>
              Join 2 million creators making professional videos without spending a cent.
            </p>
            <button className="btn-primary" onClick={() => onNavigate('auth')} style={{ padding: '16px 48px', borderRadius: 12, fontSize: 17, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} /> Get Started Free
            </button>
            <div style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Users size={13} />
              2,000,000+ creators already on board
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--cyan), var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={14} style={{ color: '#07070f' }} />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>ClipForge</span>
        </div>
        <p style={{ margin: 0 }}>Free video editing for everyone. No limitations.</p>
      </footer>
    </div>
  );
}
