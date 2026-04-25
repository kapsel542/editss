import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Scissors, Type, Music, Image, Layers, Download, Share2, Plus, ZoomIn, ZoomOut, Undo, Redo, Wand2, AlignLeft, ChevronDown, Move, Trash2, X, Film, Sparkles, SlidersHorizontal, MonitorPlay, Crop, RotateCcw, Copy, Grid3x3, Lock, Unlock, Eye, EyeOff, ChevronRight, Settings, Palette, Mic, VolumeX, Files as Subtitles, Zap } from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

type SidebarTab = 'templates' | 'media' | 'text' | 'effects' | 'music' | 'transitions' | 'elements' | 'ai';
type TrackType = 'video' | 'audio' | 'text';

interface TimelineClip {
  id: string;
  trackType: TrackType;
  label: string;
  color: string;
  start: number;
  width: number;
}

const TEMPLATES = [
  { id: '1', name: 'Social Reel', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=200', color: '#00d4ff', category: 'Social' },
  { id: '2', name: 'Product Promo', img: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=200', color: '#00ff9d', category: 'Marketing' },
  { id: '3', name: 'YouTube Intro', img: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=200', color: '#ff4444', category: 'Content' },
  { id: '4', name: 'Wedding Film', img: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=200', color: '#ff9500', category: 'Events' },
  { id: '5', name: 'Real Estate', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=200', color: '#00d4ff', category: 'Business' },
  { id: '6', name: 'Food Story', img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200', color: '#ff6b35', category: 'Creative' },
  { id: '7', name: 'Travel Vlog', img: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=200', color: '#00ff9d', category: 'Content' },
  { id: '8', name: 'Fashion Ad', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=200', color: '#ff4444', category: 'Marketing' },
  { id: '9', name: 'Fitness Reel', img: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?w=200', color: '#00d4ff', category: 'Social' },
  { id: '10', name: 'Tech Launch', img: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?w=200', color: '#8888ff', category: 'Business' },
  { id: '11', name: 'Podcast Clip', img: 'https://images.pexels.com/photos/4048782/pexels-photo-4048782.jpeg?w=200', color: '#ff9500', category: 'Content' },
  { id: '12', name: 'Birthday Reel', img: 'https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?w=200', color: '#ff4444', category: 'Events' },
  { id: '13', name: 'Tutorial', img: 'https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?w=200', color: '#00d4ff', category: 'Education' },
  { id: '14', name: 'Music Video', img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=200', color: '#ff6b35', category: 'Creative' },
  { id: '15', name: 'Corporate', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=200', color: '#00ff9d', category: 'Business' },
  { id: '16', name: 'Sale Promo', img: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=200', color: '#ff4444', category: 'Marketing' },
];

const TEXT_STYLES = [
  { name: 'Bold Title', preview: 'Aa', size: 48, weight: 900 },
  { name: 'Subtitle', preview: 'Aa', size: 28, weight: 600 },
  { name: 'Caption', preview: 'Aa', size: 18, weight: 500 },
  { name: 'Lower Third', preview: 'Aa', size: 22, weight: 700 },
  { name: 'Credits', preview: 'Aa', size: 14, weight: 400 },
  { name: 'Kinetic', preview: 'Aa', size: 36, weight: 800 },
  { name: 'Neon Glow', preview: 'Aa', size: 32, weight: 700 },
  { name: 'Typewriter', preview: 'Aa', size: 24, weight: 500 },
  { name: 'Handwritten', preview: 'Aa', size: 26, weight: 400 },
  { name: 'Retro', preview: 'Aa', size: 30, weight: 900 },
  { name: 'Gradient', preview: 'Aa', size: 40, weight: 800 },
  { name: 'Outline', preview: 'Aa', size: 34, weight: 700 },
];

const EFFECTS = [
  { name: 'Fade In', type: 'transition' },
  { name: 'Fade Out', type: 'transition' },
  { name: 'Zoom In', type: 'motion' },
  { name: 'Zoom Out', type: 'motion' },
  { name: 'Blur', type: 'filter' },
  { name: 'Glitch', type: 'filter' },
  { name: 'Film Grain', type: 'filter' },
  { name: 'Cinematic Bars', type: 'overlay' },
  { name: 'Color Grade', type: 'filter' },
  { name: 'Vignette', type: 'overlay' },
  { name: 'Slow Motion', type: 'speed' },
  { name: 'Fast Forward', type: 'speed' },
  { name: 'Reverse', type: 'speed' },
  { name: 'Mirror', type: 'transform' },
  { name: 'Rotate', type: 'transform' },
  { name: 'Shake', type: 'motion' },
  { name: 'Chromatic', type: 'filter' },
  { name: 'Light Leak', type: 'overlay' },
  { name: 'Bokeh', type: 'overlay' },
  { name: 'Parallax', type: 'motion' },
];

const TRANSITIONS = [
  { name: 'Cross Dissolve', icon: '⇢' },
  { name: 'Dip to Black', icon: '■' },
  { name: 'Dip to White', icon: '□' },
  { name: 'Slide Left', icon: '←' },
  { name: 'Slide Right', icon: '→' },
  { name: 'Slide Up', icon: '↑' },
  { name: 'Wipe', icon: '◧' },
  { name: 'Zoom', icon: '⊕' },
  { name: 'Spin', icon: '↻' },
  { name: 'Glitch', icon: '⚡' },
  { name: 'Morph', icon: '◈' },
  { name: 'Iris', icon: '◉' },
];

const ELEMENTS = [
  { name: 'Progress Bar', category: 'UI' },
  { name: 'Call to Action', category: 'UI' },
  { name: 'Subscribe Button', category: 'UI' },
  { name: 'Social Icons', category: 'UI' },
  { name: 'Arrow', category: 'Shape' },
  { name: 'Circle', category: 'Shape' },
  { name: 'Rectangle', category: 'Shape' },
  { name: 'Star', category: 'Shape' },
  { name: 'Emoji Pack', category: 'Fun' },
  { name: 'Confetti', category: 'Fun' },
  { name: 'Fire Particles', category: 'Fun' },
  { name: 'Snow', category: 'Fun' },
];

const MUSIC_TRACKS = [
  { name: 'Upbeat Summer', genre: 'Pop', duration: '2:34', bpm: 128 },
  { name: 'Epic Cinematic', genre: 'Orchestral', duration: '3:12', bpm: 80 },
  { name: 'Lo-fi Chill', genre: 'Hip-hop', duration: '1:58', bpm: 85 },
  { name: 'Corporate Drive', genre: 'Electronic', duration: '2:18', bpm: 120 },
  { name: 'Romantic Piano', genre: 'Classical', duration: '3:45', bpm: 72 },
  { name: 'Deep Bass House', genre: 'Electronic', duration: '2:52', bpm: 130 },
  { name: 'Acoustic Morning', genre: 'Folk', duration: '2:20', bpm: 95 },
  { name: 'Dark Trap', genre: 'Hip-hop', duration: '2:10', bpm: 140 },
  { name: 'Jazz Lounge', genre: 'Jazz', duration: '3:30', bpm: 100 },
  { name: 'Rock Energy', genre: 'Rock', duration: '2:45', bpm: 135 },
];

const AI_FEATURES = [
  { name: 'Auto-Subtitles', desc: 'Generate captions from speech', icon: <Subtitles size={16} /> },
  { name: 'Smart Cut', desc: 'Remove silences automatically', icon: <Scissors size={16} /> },
  { name: 'Color Grade', desc: 'AI-powered color correction', icon: <Palette size={16} /> },
  { name: 'Audio Enhance', desc: 'Clean up background noise', icon: <Mic size={16} /> },
  { name: 'Scene Detect', desc: 'Auto-split scenes', icon: <Film size={16} /> },
  { name: 'B-Roll Suggest', desc: 'AI picks matching stock footage', icon: <Image size={16} /> },
];

const INITIAL_CLIPS: TimelineClip[] = [
  { id: '1', trackType: 'video', label: 'Clip 1', color: '#00d4ff', start: 0, width: 200 },
  { id: '2', trackType: 'video', label: 'Clip 2', color: '#00a8cc', start: 210, width: 150 },
  { id: '3', trackType: 'audio', label: 'Music Track', color: '#00ff9d', start: 0, width: 360 },
  { id: '4', trackType: 'text', label: 'Title Text', color: '#ff9500', start: 20, width: 100 },
];

export default function Editor({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('templates');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [clips, setClips] = useState<TimelineClip[]>(INITIAL_CLIPS);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [publishTitle, setPublishTitle] = useState('My Amazing Video');
  const [published, setPublished] = useState(false);
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [clipLocked, setClipLocked] = useState(false);
  const [clipVisible, setClipVisible] = useState(true);
  const [templateFilter, setTemplateFilter] = useState('All');
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalDuration = 30;

  const togglePlay = () => {
    if (isPlaying) {
      if (playRef.current) clearInterval(playRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= totalDuration) {
            if (playRef.current) clearInterval(playRef.current);
            setIsPlaying(false);
            return 0;
          }
          return t + 0.1;
        });
      }, 100);
    }
  };

  const deleteClip = (id: string) => {
    setClips(c => c.filter(x => x.id !== id));
    setSelectedClip(null);
  };

  const duplicateClip = (id: string) => {
    const clip = clips.find(c => c.id === id);
    if (!clip) return;
    const newClip: TimelineClip = { ...clip, id: Date.now().toString(), start: clip.start + clip.width + 10, label: clip.label + ' copy' };
    setClips(c => [...c, newClip]);
  };

  const addClip = (type: TrackType) => {
    const newClip: TimelineClip = {
      id: Date.now().toString(),
      trackType: type,
      label: type === 'text' ? 'New Text' : type === 'audio' ? 'New Audio' : 'New Clip',
      color: type === 'video' ? '#00d4ff' : type === 'audio' ? '#00ff9d' : '#ff9500',
      start: 100,
      width: 120,
    };
    setClips(c => [...c, newClip]);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const SIDEBAR_TABS: Array<{ id: SidebarTab; icon: React.ReactNode; label: string }> = [
    { id: 'templates', icon: <Layers size={16} />, label: 'Templates' },
    { id: 'media', icon: <Image size={16} />, label: 'Media' },
    { id: 'text', icon: <Type size={16} />, label: 'Text' },
    { id: 'effects', icon: <Sparkles size={16} />, label: 'Effects' },
    { id: 'transitions', icon: <ChevronRight size={16} />, label: 'Transitions' },
    { id: 'elements', icon: <Grid3x3 size={16} />, label: 'Elements' },
    { id: 'music', icon: <Music size={16} />, label: 'Music' },
    { id: 'ai', icon: <Wand2 size={16} />, label: 'AI' },
  ];

  const templateCategories = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const filteredTemplates = templateFilter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === templateFilter);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 52, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '4px 8px', borderRadius: 6 }}>
          &larr; Dashboard
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <input
            defaultValue="Untitled Project"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, textAlign: 'center', outline: 'none', width: 200 }}
            onFocus={e => (e.target.style.borderBottom = '1px solid var(--cyan)')}
            onBlur={e => (e.target.style.borderBottom = 'none')}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}><Undo size={16} /></button>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}><Redo size={16} /></button>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <button className="btn-secondary" style={{ padding: '6px 14px', borderRadius: 7, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Download size={13} /> Export
          </button>
          <button className="btn-primary" onClick={() => setShowPublish(true)} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Share2 size={13} /> Publish
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: 6, gap: 2, borderBottom: '1px solid var(--border)' }}>
            {SIDEBAR_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 2px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 600,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.2s',
                  background: activeTab === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--cyan)' : 'var(--text-muted)',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sidebar content */}
          <div className="scrollable" style={{ flex: 1, padding: 10, overflowY: 'auto' }}>
            {activeTab === 'templates' && (
              <div>
                {/* Category filter */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                  {templateCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTemplateFilter(cat)}
                      style={{
                        padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600,
                        background: templateFilter === cat ? 'rgba(0,212,255,0.1)' : 'transparent',
                        color: templateFilter === cat ? 'var(--cyan)' : 'var(--text-muted)',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {filteredTemplates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      style={{
                        borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                        border: `2px solid ${selectedTemplate === tpl.id ? tpl.color : 'transparent'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      <img src={tpl.img} alt={tpl.name} style={{ width: '100%', height: 48, objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '3px 5px', background: 'var(--bg-card)', fontSize: 9, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tpl.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div>
                <button className="btn-secondary" style={{ width: '100%', padding: '8px', borderRadius: 6, fontSize: 12, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Plus size={14} /> Upload Media
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=200',
                    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=200',
                    'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=200',
                    'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=200',
                    'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=200',
                    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200',
                    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=200',
                    'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=200',
                  ].map((img, i) => (
                    <div key={i} style={{ borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: 48, objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 10, textAlign: 'center', marginTop: 10 }}>+ 10,000 free stock videos</div>
              </div>
            )}

            {activeTab === 'text' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {TEXT_STYLES.map(style => (
                  <button
                    key={style.name}
                    onClick={() => addClip('text')}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '8px 10px', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)',
                      fontSize: 12, fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ width: 32, height: 24, background: 'var(--bg-secondary)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: style.size * 0.3, fontWeight: style.weight, color: 'var(--cyan)', flexShrink: 0 }}>
                      {style.preview}
                    </div>
                    {style.name}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'effects' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {EFFECTS.map(effect => (
                  <button
                    key={effect.name}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '8px 5px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 10,
                      fontWeight: 600, transition: 'all 0.2s', textAlign: 'center',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                  >
                    {effect.name}
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{effect.type}</div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'transitions' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {TRANSITIONS.map(tr => (
                  <button
                    key={tr.name}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '8px 4px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 9,
                      fontWeight: 600, transition: 'all 0.2s', textAlign: 'center',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{tr.icon}</div>
                    {tr.name}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'elements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ELEMENTS.map(el => (
                  <button
                    key={el.name}
                    onClick={() => addClip('video')}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '8px 10px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 12,
                      fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    {el.name}
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', padding: '2px 6px', background: 'var(--bg-secondary)', borderRadius: 3 }}>{el.category}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'music' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button className="btn-secondary" style={{ width: '100%', padding: '8px', borderRadius: 6, fontSize: 12, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Plus size={14} /> Upload Audio
                </button>
                {MUSIC_TRACKS.map(track => (
                  <div
                    key={track.name}
                    style={{
                      background: playingMusic === track.name ? 'rgba(0,212,255,0.08)' : 'var(--bg-card)',
                      border: `1px solid ${playingMusic === track.name ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                      borderRadius: 6, padding: '8px 10px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onClick={() => { setPlayingMusic(playingMusic === track.name ? null : track.name); addClip('audio'); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: playingMusic === track.name ? 'var(--cyan)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.name}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{track.genre} &middot; {track.duration} &middot; {track.bpm} BPM</div>
                      </div>
                      {playingMusic === track.name ? (
                        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 16 }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                          ))}
                        </div>
                      ) : (
                        <Play size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ color: 'var(--text-muted)', fontSize: 10, textAlign: 'center', marginTop: 6 }}>+ 10,000 royalty-free tracks</div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ padding: '6px 8px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Wand2 size={10} /> AI-Powered Tools
                  </div>
                </div>
                {AI_FEATURES.map(feat => (
                  <button
                    key={feat.name}
                    style={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '10px 10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ color: 'var(--cyan)' }}>{feat.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{feat.name}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 24 }}>{feat.desc}</div>
                  </button>
                ))}
                <div style={{ padding: '8px', background: 'rgba(0,255,157,0.05)', border: '1px solid rgba(0,255,157,0.15)', borderRadius: 6, marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={10} /> All AI features are free
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center — preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 14, background: 'var(--bg-primary)' }}>
          {/* Aspect ratio selector */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['16:9', '9:16', '1:1', '4:5'].map(ratio => (
              <button
                key={ratio}
                style={{
                  background: ratio === '16:9' ? 'rgba(0,212,255,0.1)' : 'transparent',
                  border: `1px solid ${ratio === '16:9' ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                  color: ratio === '16:9' ? 'var(--cyan)' : 'var(--text-muted)',
                  padding: '3px 8px', borderRadius: 5, fontSize: 10, cursor: 'pointer', fontWeight: 600,
                }}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Video canvas */}
          <div style={{
            width: 520, height: 292, background: 'var(--bg-secondary)', borderRadius: 10,
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {selectedTemplate ? (
              <img
                src={TEMPLATES.find(t => t.id === selectedTemplate)?.img?.replace('w=200', 'w=600')}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                  <Image size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Drop media here or pick a template</div>
              </div>
            )}

            {selectedTemplate && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div
                  onClick={togglePlay}
                  style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {isPlaying ? <Pause size={20} style={{ color: '#07070f' }} /> : <Play size={20} style={{ color: '#07070f', marginLeft: 3 }} />}
                </div>
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: 3, fontSize: 11, fontFamily: 'monospace', color: 'white' }}>
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </div>
          </div>

          {/* Playback controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setCurrentTime(0)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><SkipBack size={18} /></button>
            <button onClick={togglePlay} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: isPlaying ? 'var(--cyan)' : 'rgba(0,212,255,0.15)',
              border: `2px solid ${isPlaying ? 'var(--cyan)' : 'rgba(0,212,255,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isPlaying ? '#07070f' : 'var(--cyan)',
              transition: 'all 0.2s',
            }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
            </button>
            <button onClick={() => setCurrentTime(totalDuration)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><SkipForward size={18} /></button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
              <Volume2 size={13} style={{ color: 'var(--text-muted)' }} />
              <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)}
                style={{ width: 70, accentColor: 'var(--cyan)' }} />
            </div>

            <div style={{ display: 'flex', gap: 3, marginLeft: 6 }}>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center' }}>
                <ZoomOut size={12} />
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: 11, padding: '3px 6px', minWidth: 36, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', cursor: 'pointer', padding: '3px 6px', display: 'flex', alignItems: 'center' }}>
                <ZoomIn size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel — properties */}
        <div style={{ width: 200, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', padding: 14, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Properties</div>

          {selectedClip ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Clip actions */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                <button onClick={() => setClipLocked(!clipLocked)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: clipLocked ? 'var(--cyan)' : 'var(--text-muted)', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
                  {clipLocked ? <Lock size={11} /> : <Unlock size={11} />}
                </button>
                <button onClick={() => setClipVisible(!clipVisible)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: clipVisible ? 'var(--text-muted)' : '#ff4444', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
                  {clipVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button onClick={() => duplicateClip(selectedClip)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
                  <Copy size={11} />
                </button>
                <button onClick={() => deleteClip(selectedClip)} style={{ background: 'none', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 5, color: '#ff4444', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={11} />
                </button>
              </div>

              {[
                { label: 'Position X', val: '0' },
                { label: 'Position Y', val: '0' },
                { label: 'Scale', val: '100%' },
                { label: 'Opacity', val: '100%' },
                { label: 'Rotation', val: '0deg' },
                { label: 'Speed', val: '1x' },
              ].map(prop => (
                <div key={prop.label}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{prop.label}</div>
                  <input
                    defaultValue={prop.val}
                    style={{ width: '100%', padding: '5px 7px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-primary)', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 11, lineHeight: 1.6 }}>
              Select a clip in the timeline to edit its properties
            </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button onClick={() => addClip('video')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', padding: '5px 8px', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={10} /> Add Video Clip
              </button>
              <button onClick={() => addClip('text')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', padding: '5px 8px', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={10} /> Add Text
              </button>
              <button onClick={() => addClip('audio')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', padding: '5px 8px', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={10} /> Add Music
              </button>
              <button onClick={() => onNavigate('generator')} style={{ background: 'none', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 5, color: 'var(--cyan)', padding: '5px 8px', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Wand2 size={10} /> AI Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ height: 180, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <Scissors size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>Timeline</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {['Video', 'Audio', 'Text'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--text-muted)' }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--green)' : 'var(--orange)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', height: 16, marginLeft: 70 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: 2, color: 'var(--text-muted)', fontSize: 8 }}>
                {i}s
              </div>
            ))}
          </div>
          <div style={{
            position: 'absolute', top: 0, bottom: -100,
            left: `${(currentTime / totalDuration) * 100}%`,
            width: 2, background: 'var(--cyan)', zIndex: 10, transition: 'left 0.1s',
            boxShadow: '0 0 6px var(--cyan)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)', marginLeft: -3, marginTop: -1 }} />
          </div>
        </div>

        <div className="scrollable" style={{ flex: 1, overflowY: 'auto' }}>
          {(['video', 'audio', 'text'] as TrackType[]).map(trackType => (
            <div key={trackType} style={{ display: 'flex', alignItems: 'center', height: 32, marginBottom: 4 }}>
              <div style={{ width: 66, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
                {trackType}
              </div>
              <div style={{ flex: 1, height: 30, background: 'var(--bg-primary)', borderRadius: 5, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                {clips.filter(c => c.trackType === trackType).map(clip => (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClip(selectedClip === clip.id ? null : clip.id)}
                    style={{
                      position: 'absolute',
                      left: clip.start * zoom,
                      width: clip.width * zoom,
                      top: 2,
                      height: 26,
                      background: clip.color + '25',
                      border: `2px solid ${selectedClip === clip.id ? 'white' : clip.color}`,
                      borderRadius: 5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 6px',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Move size={9} style={{ color: clip.color, marginRight: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 9, fontWeight: 600, color: clip.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clip.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish modal */}
      {showPublish && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-bright" style={{ borderRadius: 20, padding: 36, maxWidth: 460, width: '90%' }}>
            {!published ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Publish Video</h2>
                  <button onClick={() => setShowPublish(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase' }}>Video Title</label>
                  <input
                    value={publishTitle}
                    onChange={e => setPublishTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase' }}>Description</label>
                  <textarea
                    placeholder="Describe your video..."
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {['Public', 'Unlisted'].map(opt => (
                    <button key={opt} style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${opt === 'Public' ? 'var(--cyan)' : 'var(--border)'}`, background: opt === 'Public' ? 'rgba(0,212,255,0.1)' : 'transparent', color: opt === 'Public' ? 'var(--cyan)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}>
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-primary"
                  onClick={() => setPublished(true)}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Share2 size={16} /> Publish Now — Free
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,255,157,0.1)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Share2 size={26} style={{ color: 'var(--green)' }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Published!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>{publishTitle} is now live</p>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ flex: 1, color: 'var(--cyan)', fontSize: 11, fontFamily: 'monospace' }}>https://clipforge.io/v/abc123</span>
                  <button className="btn-secondary" style={{ padding: '3px 8px', borderRadius: 5, fontSize: 10 }}>Copy</button>
                </div>
                <button className="btn-secondary" onClick={() => { setShowPublish(false); setPublished(false); }} style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
