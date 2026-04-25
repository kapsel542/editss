import { useState, useEffect } from 'react';
import { Video, LayoutDashboard, Wand2, Menu, X, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Navbar({ currentPage, onNavigate }: Props) {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate('landing');
    setUserMenuOpen(false);
  };

  const navLinks = user
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
        { id: 'editor', label: 'Editor', icon: <Video size={15} /> },
        { id: 'generator', label: 'AI Generator', icon: <Wand2 size={15} /> },
      ]
    : [
        { id: 'landing', label: 'Home', icon: null },
      ];

  if (currentPage === 'editor') return null;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60,
      background: scrolled || currentPage !== 'landing' ? 'rgba(7,7,15,0.95)' : 'transparent',
      backdropFilter: scrolled || currentPage !== 'landing' ? 'blur(20px)' : 'none',
      borderBottom: scrolled || currentPage !== 'landing' ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24,
    }}>
      {/* Logo */}
      <button
        onClick={() => onNavigate('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--cyan), var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Video size={15} style={{ color: '#07070f' }} />
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>ClipForge</span>
      </button>

      {/* Desktop nav */}
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              background: currentPage === link.id ? 'rgba(0,212,255,0.08)' : 'none',
              border: `1px solid ${currentPage === link.id ? 'rgba(0,212,255,0.2)' : 'transparent'}`,
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              color: currentPage === link.id ? 'var(--cyan)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (currentPage !== link.id) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; } }}
            onMouseLeave={e => { if (currentPage !== link.id) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; } }}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 10, padding: '6px 12px',
                cursor: 'pointer', color: 'var(--text-primary)', fontSize: 13, transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cyan)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={12} style={{ color: '#07070f' }} />
              </div>
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email?.split('@')[0]}</span>
            </button>

            {userMenuOpen && (
              <div className="glass-bright" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, borderRadius: 10, padding: 8, minWidth: 180, zIndex: 200 }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Signed in as</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{user.email}</div>
                </div>
                {[
                  { label: 'Dashboard', icon: <LayoutDashboard size={13} />, page: 'dashboard' },
                  { label: 'Editor', icon: <Video size={13} />, page: 'editor' },
                  { label: 'AI Generator', icon: <Wand2 size={13} />, page: 'generator' },
                ].map(item => (
                  <button key={item.page} onClick={() => { onNavigate(item.page); setUserMenuOpen(false); }} style={{ width: '100%', background: 'none', border: 'none', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13, borderRadius: 6, textAlign: 'left', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}>
                    {item.icon} {item.label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                  <button onClick={signOut} style={{ width: '100%', background: 'none', border: 'none', padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: '#ff4444', fontSize: 13, borderRadius: 6, textAlign: 'left', transition: 'all 0.15s' }}>
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-secondary" onClick={() => onNavigate('auth')} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13 }}>Log in</button>
            <button className="btn-primary" onClick={() => onNavigate('auth')} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13 }}>Sign Up Free</button>
          </>
        )}

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}
