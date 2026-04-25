import { useState, useEffect } from 'react';
import {
  Plus, Video, Clock, Eye, Share2, Trash2, Wand2, Star, TrendingUp, HardDrive,
  ChevronRight, Play, Sparkles, Zap, Film, Image, Music, Type, Layers, Scissors,
  MonitorPlay, Clapperboard, Megaphone, GraduationCap, Heart, Gamepad2,
  Newspaper, Palette, Globe, Search, SlidersHorizontal, ArrowUpRight,
  Clock3, BarChart3, Users, Crown, CheckCircle2, LayoutGrid, List
} from 'lucide-react';
import { supabase, type Project, type PublishedVideo } from '../lib/supabase';

type Props = { onNavigate: (page: string, data?: unknown) => void };
type ViewMode = 'grid' | 'list';
type TemplateCategory = 'all' | 'social' | 'marketing' | 'content' | 'events' | 'business' | 'education' | 'creative';

interface Template {
  id: string;
  name: string;
  img: string;
  color: string;
  category: TemplateCategory;
  categoryLabel: string;
  aspectRatio: string;
  duration: string;
  isAI?: boolean;
  isBlank?: boolean;
}

const TEMPLATES: Template[] = [
  // Social
  { id: 'social-reel', name: 'Social Reel', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=300', color: '#00d4ff', category: 'social', categoryLabel: 'Social', aspectRatio: '9:16', duration: '30s' },
  { id: 'tiktok-dance', name: 'TikTok Dance', img: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?w=300', color: '#ff4444', category: 'social', categoryLabel: 'Social', aspectRatio: '9:16', duration: '15s' },
  { id: 'instagram-story', name: 'Instagram Story', img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300', color: '#ff6b35', category: 'social', categoryLabel: 'Social', aspectRatio: '9:16', duration: '10s' },
  { id: 'snap-highlight', name: 'Snapchat Highlight', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=300', color: '#00ff9d', category: 'social', categoryLabel: 'Social', aspectRatio: '9:16', duration: '20s' },
  // Marketing
  { id: 'product-ad', name: 'Product Ad', img: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=300', color: '#00ff9d', category: 'marketing', categoryLabel: 'Marketing', aspectRatio: '16:9', duration: '30s' },
  { id: 'brand-intro', name: 'Brand Intro', img: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?w=300', color: '#00d4ff', category: 'marketing', categoryLabel: 'Marketing', aspectRatio: '16:9', duration: '10s' },
  { id: 'sale-promo', name: 'Flash Sale Promo', img: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=300', color: '#ff4444', category: 'marketing', categoryLabel: 'Marketing', aspectRatio: '1:1', duration: '15s' },
  { id: 'testimonials', name: 'Customer Testimonial', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=300', color: '#ff9500', category: 'marketing', categoryLabel: 'Marketing', aspectRatio: '16:9', duration: '60s' },
  // Content
  { id: 'youtube-intro', name: 'YouTube Intro', img: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=300', color: '#ff4444', category: 'content', categoryLabel: 'Content', aspectRatio: '16:9', duration: '10s' },
  { id: 'youtube-outro', name: 'YouTube Outro', img: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=300', color: '#ff6b35', category: 'content', categoryLabel: 'Content', aspectRatio: '16:9', duration: '10s' },
  { id: 'podcast-clip', name: 'Podcast Clip', img: 'https://images.pexels.com/photos/4048782/pexels-photo-4048782.jpeg?w=300', color: '#00d4ff', category: 'content', categoryLabel: 'Content', aspectRatio: '16:9', duration: '60s' },
  { id: 'stream-overlay', name: 'Stream Overlay', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=300', color: '#00ff9d', category: 'content', categoryLabel: 'Content', aspectRatio: '16:9', duration: 'Loop' },
  // Events
  { id: 'wedding-film', name: 'Wedding Film', img: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=300', color: '#ff9500', category: 'events', categoryLabel: 'Events', aspectRatio: '16:9', duration: '3min' },
  { id: 'birthday-reel', name: 'Birthday Reel', img: 'https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?w=300', color: '#ff4444', category: 'events', categoryLabel: 'Events', aspectRatio: '9:16', duration: '30s' },
  { id: 'event-recap', name: 'Event Recap', img: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?w=300', color: '#00d4ff', category: 'events', categoryLabel: 'Events', aspectRatio: '16:9', duration: '2min' },
  // Business
  { id: 'real-estate', name: 'Real Estate Tour', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=300', color: '#00d4ff', category: 'business', categoryLabel: 'Business', aspectRatio: '16:9', duration: '2min' },
  { id: 'corporate-pres', name: 'Corporate Presentation', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=300', color: '#00ff9d', category: 'business', categoryLabel: 'Business', aspectRatio: '16:9', duration: '5min' },
  { id: 'app-demo', name: 'App Demo', img: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?w=300', color: '#ff6b35', category: 'business', categoryLabel: 'Business', aspectRatio: '9:16', duration: '30s' },
  // Education
  { id: 'tutorial', name: 'Tutorial Video', img: 'https://images.pexels.com/photos/4048782/pexels-photo-4048782.jpeg?w=300', color: '#00d4ff', category: 'education', categoryLabel: 'Education', aspectRatio: '16:9', duration: '5min' },
  { id: 'online-course', name: 'Online Course Intro', img: 'https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?w=300', color: '#ff9500', category: 'education', categoryLabel: 'Education', aspectRatio: '16:9', duration: '30s' },
  // Creative
  { id: 'music-video', name: 'Music Video', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=300', color: '#ff4444', category: 'creative', categoryLabel: 'Creative', aspectRatio: '16:9', duration: '3min' },
  { id: 'short-film', name: 'Short Film', img: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=300', color: '#ff6b35', category: 'creative', categoryLabel: 'Creative', aspectRatio: '21:9', duration: '5min' },
  { id: 'photo-slideshow', name: 'Photo Slideshow', img: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=300', color: '#00ff9d', category: 'creative', categoryLabel: 'Creative', aspectRatio: '16:9', duration: '2min' },
];

const AI_TEMPLATES = [
  { id: 'ai-cinematic', name: 'AI Cinematic Scene', desc: 'Generate a cinematic video from a text prompt', icon: <Film size={20} />, color: '#ff9500' },
  { id: 'ai-product', name: 'AI Product Showcase', desc: 'Auto-generate product demo videos', icon: <Megaphone size={20} />, color: '#00ff9d' },
  { id: 'ai-explainer', name: 'AI Explainer Video', desc: 'Turn scripts into animated explainers', icon: <GraduationCap size={20} />, color: '#00d4ff' },
  { id: 'ai-social', name: 'AI Social Content', desc: 'Batch-generate social media clips', icon: <Globe size={20} />, color: '#ff4444' },
  { id: 'ai-subtitles', name: 'AI Auto-Subtitles', desc: 'Generate captions and subtitles automatically', icon: <Type size={20} />, color: '#ff6b35' },
  { id: 'ai-color', name: 'AI Color Grade', desc: 'Auto color-correct and grade your footage', icon: <Palette size={20} />, color: '#00ff9d' },
];

const BLANK_PROJECTS = [
  { id: 'blank-169', name: 'Blank 16:9', desc: 'Landscape canvas', icon: <MonitorPlay size={20} />, color: '#00d4ff', aspectRatio: '16:9' },
  { id: 'blank-916', name: 'Blank 9:16', desc: 'Portrait / mobile', icon: <MonitorPlay size={20} />, color: '#ff4444', aspectRatio: '9:16' },
  { id: 'blank-11', name: 'Blank 1:1', desc: 'Square format', icon: <MonitorPlay size={20} />, color: '#00ff9d', aspectRatio: '1:1' },
  { id: 'blank-45', name: 'Blank 4:5', desc: 'Instagram post', icon: <MonitorPlay size={20} />, color: '#ff9500', aspectRatio: '4:5' },
];

const FEATURES = [
  { icon: <Scissors size={16} />, title: 'Precision Editing', desc: 'Frame-accurate cuts and trims' },
  { icon: <Type size={16} />, title: 'Text & Titles', desc: '200+ animated text styles' },
  { icon: <Music size={16} />, title: 'Music Library', desc: '10,000+ royalty-free tracks' },
  { icon: <Sparkles size={16} />, title: 'AI Generation', desc: 'Text-to-video, instant results' },
  { icon: <Layers size={16} />, title: 'Multi-Track', desc: 'Unlimited video & audio tracks' },
  { icon: <Image size={16} />, title: 'Stock Library', desc: '1M+ free photos & videos' },
  { icon: <SlidersHorizontal size={16} />, title: 'Color Grading', desc: 'Professional LUTs & controls' },
  { icon: <Zap size={16} />, title: 'Instant Export', desc: '4K export, no watermarks' },
];

const CATEGORIES: Array<{ id: TemplateCategory; label: string; icon: React.ReactNode }> = [
  { id: 'all', label: 'All', icon: <LayoutGrid size={14} /> },
  { id: 'social', label: 'Social', icon: <Heart size={14} /> },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone size={14} /> },
  { id: 'content', label: 'Content', icon: <Clapperboard size={14} /> },
  { id: 'events', label: 'Events', icon: <Star size={14} /> },
  { id: 'business', label: 'Business', icon: <BarChart3 size={14} /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
  { id: 'creative', label: 'Creative', icon: <Palette size={14} /> },
];

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: accent || 'var(--cyan)', opacity: 0.06 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent || 'var(--cyan)'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent || 'var(--cyan)' }}>
          {icon}
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ onNavigate }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [published, setPublished] = useState<PublishedVideo[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [category, setCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeSection, setActiveSection] = useState<'templates' | 'projects' | 'all'>('templates');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        const [{ data: projs }, { data: pubs }] = await Promise.all([
          supabase.from('projects').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(12),
          supabase.from('published_videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6),
        ]);
        setProjects(projs || []);
        setPublished(pubs || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const createProject = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('projects').insert({ user_id: user.id, title: 'Untitled Project' }).select().maybeSingle();
    if (data) onNavigate('editor', data);
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(p => p.filter(x => x.id !== id));
    setDeleteId(null);
  };

  const totalViews = published.reduce((a, v) => a + (v.views || 0), 0);

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = category === 'all' || t.category === category;
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero header */}
      <div style={{
        padding: '40px 24px 32px',
        background: 'linear-gradient(180deg, rgba(0,212,255,0.04) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Welcome back, {userEmail ? userEmail.split('@')[0] : 'creator'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 15 }}>Create, edit, and publish your videos — everything is free</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => onNavigate('generator')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wand2 size={15} /> AI Generator
              </button>
              <button className="btn-primary" onClick={createProject} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={15} /> New Project
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginTop: 28 }}>
            <StatCard icon={<Video size={18} />} label="Projects" value={String(projects.length)} sub="All time" accent="var(--cyan)" />
            <StatCard icon={<Share2 size={18} />} label="Published" value={String(published.length)} sub="Videos live" accent="var(--green)" />
            <StatCard icon={<Eye size={18} />} label="Views" value={totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : String(totalViews)} sub="Across all videos" accent="#ff9500" />
            <StatCard icon={<HardDrive size={18} />} label="Storage" value="5 GB" sub="Free plan" accent="#ff6b35" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-card)', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
          {([
            { id: 'templates' as const, label: 'Templates & Projects', icon: <Layers size={14} /> },
            { id: 'all' as const, label: 'All Features', icon: <Sparkles size={14} /> },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                background: activeSection === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: activeSection === tab.id ? 'var(--cyan)' : 'var(--text-secondary)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeSection === 'templates' && (
          <>
            {/* AI Templates */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wand2 size={14} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>AI-Powered Templates</h2>
                  <span className="tag tag-cyan" style={{ fontSize: 10 }}>Free</span>
                </div>
                <button onClick={() => onNavigate('generator')} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Open AI Generator <ChevronRight size={14} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {AI_TEMPLATES.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => onNavigate('generator')}
                    className="card"
                    style={{ cursor: 'pointer', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: tpl.color, opacity: 0.05 }} />
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tpl.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tpl.color }}>
                      {tpl.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{tpl.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tpl.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: tpl.color, fontSize: 12, fontWeight: 600, marginTop: 'auto' }}>
                      <Sparkles size={12} /> Try it free
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blank Projects */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,255,157,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={14} style={{ color: 'var(--green)' }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Start from Scratch</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                {BLANK_PROJECTS.map(proj => (
                  <div
                    key={proj.id}
                    onClick={createProject}
                    className="card"
                    style={{ cursor: 'pointer', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: `${proj.color}10`, border: `1px dashed ${proj.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: proj.color }}>
                      {proj.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{proj.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{proj.desc}</div>
                    </div>
                    <div style={{ padding: '3px 10px', borderRadius: 6, background: `${proj.color}10`, border: `1px solid ${proj.color}30`, color: proj.color, fontSize: 11, fontWeight: 700 }}>
                      {proj.aspectRatio}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template Library */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={14} style={{ color: 'var(--orange)' }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Template Library</h2>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{TEMPLATES.length} templates</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* Search */}
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search templates..."
                      style={{
                        padding: '7px 12px 7px 32px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', fontSize: 13, outline: 'none', width: 180, transition: 'border-color 0.2s',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                  {/* View toggle */}
                  <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <button onClick={() => setViewMode('grid')} style={{ padding: '5px 8px', background: viewMode === 'grid' ? 'rgba(0,212,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'grid' ? 'var(--cyan)' : 'var(--text-muted)', cursor: 'pointer' }}>
                      <LayoutGrid size={14} />
                    </button>
                    <button onClick={() => setViewMode('list')} style={{ padding: '5px 8px', background: viewMode === 'list' ? 'rgba(0,212,255,0.1)' : 'transparent', border: 'none', color: viewMode === 'list' ? 'var(--cyan)' : 'var(--text-muted)', cursor: 'pointer' }}>
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '6px 14px', borderRadius: 100, border: `1px solid ${category === cat.id ? 'var(--cyan)' : 'var(--border)'}`,
                      background: category === cat.id ? 'rgba(0,212,255,0.08)' : 'transparent',
                      color: category === cat.id ? 'var(--cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>

              {/* Template grid */}
              {viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {filteredTemplates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => onNavigate('editor')}
                      className="card"
                      style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img src={tpl.img} alt={tpl.name} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <div style={{ position: 'absolute', top: 8, left: 8 }}>
                          <span className="tag tag-cyan" style={{ fontSize: 9, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>{tpl.categoryLabel}</span>
                        </div>
                        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                          <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600 }}>{tpl.aspectRatio}</span>
                          <span style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600 }}>{tpl.duration}</span>
                        </div>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                          onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(0,0,0,0.5)'); const btn = e.currentTarget.querySelector('button'); if (btn) btn.style.opacity = '1'; }}
                          onMouseLeave={e => { (e.currentTarget.style.background = 'rgba(0,0,0,0)'); const btn = e.currentTarget.querySelector('button'); if (btn) btn.style.opacity = '0'; }}
                        >
                          <button style={{ opacity: 0, transition: 'opacity 0.3s', width: 40, height: 40, borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Play size={16} style={{ color: '#07070f', marginLeft: 2 }} />
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{tpl.name}</div>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>Free</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredTemplates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => onNavigate('editor')}
                      className="card"
                      style={{ cursor: 'pointer', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <img src={tpl.img} alt={tpl.name} style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{tpl.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tpl.categoryLabel}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--bg-secondary)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tpl.aspectRatio}</span>
                        <span style={{ padding: '3px 8px', borderRadius: 4, background: 'var(--bg-secondary)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tpl.duration}</span>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>Free</span>
                        <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredTemplates.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)', fontSize: 14 }}>
                  No templates found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock3 size={14} style={{ color: 'var(--cyan)' }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Recent Projects</h2>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
                </div>
                {projects.length > 0 && (
                  <button onClick={createProject} className="btn-secondary" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Plus size={12} /> New
                  </button>
                )}
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="card animate-shimmer" style={{ height: 180 }} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed var(--border)' }}>
                  <Video size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No projects yet</div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>Pick a template above or start from scratch</div>
                  <button className="btn-primary" onClick={createProject} style={{ padding: '10px 24px', borderRadius: 10, fontSize: 14 }}>
                    Create First Project
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {projects.map(proj => (
                    <div key={proj.id} className="card" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
                      <div style={{ height: 130, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--border) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => onNavigate('editor', proj)}>
                        {proj.thumbnail_url ? (
                          <img src={proj.thumbnail_url} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Video size={32} style={{ color: 'var(--border-bright)' }} />
                        )}
                        <div style={{ position: 'absolute', top: 8, right: 8 }}>
                          <span className={`tag ${proj.status === 'published' ? 'tag-green' : 'tag-cyan'}`} style={{ fontSize: 10 }}>
                            {proj.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{proj.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={10} /> {new Date(proj.updated_at).toLocaleDateString()}
                          </span>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => onNavigate('editor', proj)} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: 4 }}>
                              <TrendingUp size={13} />
                            </button>
                            <button onClick={() => setDeleteId(proj.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Published Videos */}
            {published.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={14} style={{ color: 'var(--orange)' }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Published Videos</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {published.map(vid => (
                    <div key={vid.id} className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 64, height: 48, borderRadius: 8, background: 'var(--bg-secondary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Video size={20} style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{vid.title}</div>
                        <div style={{ display: 'flex', gap: 10, color: 'var(--text-muted)', fontSize: 12 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={10} /> {vid.views}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star size={10} /> {vid.likes}</span>
                        </div>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer' }}>
                        <Share2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === 'all' && (
          <>
            {/* Features Grid */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} style={{ color: 'var(--cyan)' }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Everything Included — Free</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {FEATURES.map(feat => (
                  <div key={feat.title} className="card" style={{ padding: 18, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,212,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)', flexShrink: 0 }}>
                      {feat.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{feat.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,255,157,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={14} style={{ color: 'var(--green)' }} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Quick Actions</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { label: 'New Video Project', icon: <Video size={16} />, action: createProject, primary: true },
                  { label: 'AI Video Generator', icon: <Wand2 size={16} />, action: () => onNavigate('generator'), primary: false },
                  { label: 'Open Editor', icon: <Film size={16} />, action: () => onNavigate('editor'), primary: false },
                  { label: 'Browse Templates', icon: <Layers size={16} />, action: () => setActiveSection('templates'), primary: false },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={item.primary ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '14px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free plan callout */}
            <div style={{
              padding: 32, borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(0,255,157,0.04) 100%)',
              border: '1px solid rgba(0,212,255,0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Crown size={18} style={{ color: 'var(--orange)' }} />
                  <span style={{ fontSize: 18, fontWeight: 800 }}>You're on the Free plan</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
                  5 GB storage, unlimited projects, no watermarks, 4K export, AI generation — all free forever.
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Unlimited projects', 'No watermarks', '4K export', 'AI generation', '5 GB storage'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setDeleteId(null)}>
          <div className="glass-bright" style={{ borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Delete project?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '0 0 24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 14 }}>Cancel</button>
              <button onClick={() => deleteProject(deleteId)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#ff4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
