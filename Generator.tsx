import { useState, useRef, useEffect } from 'react';
import {
  Wand2, Play, Download, Share2, RefreshCw, ChevronRight, Sparkles, Zap, Clock,
  Video, LayoutGrid, Film, Megaphone, GraduationCap, Globe, Type, Palette,
  Image, Music, Layers, SlidersHorizontal, MonitorPlay, Heart, Star, BarChart3
} from 'lucide-react';

type Props = { onNavigate: (page: string) => void };

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';
type Style = { id: string; name: string; desc: string; img: string; color: string };
type GenerateStep = 'idle' | 'generating' | 'done';
type AITab = 'generate' | 'templates' | 'enhance';

const STYLES: Style[] = [
  { id: 'cinematic', name: 'Cinematic', desc: 'Film-like quality with dramatic lighting', img: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=200', color: '#ff9500' },
  { id: 'animated', name: 'Animated', desc: 'Colorful animated style', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=200', color: '#00ff9d' },
  { id: 'realistic', name: 'Realistic', desc: 'Photorealistic scenes', img: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=200', color: '#00d4ff' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean and elegant look', img: 'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?w=200', color: '#8888ff' },
  { id: 'neon', name: 'Neon / Cyberpunk', desc: 'Vibrant futuristic aesthetic', img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=200', color: '#ff4444' },
  { id: 'retro', name: 'Retro / Vintage', desc: 'Classic film grain and colors', img: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?w=200', color: '#ff6b35' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Soft painted artistic style', img: 'https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?w=200', color: '#00d4ff' },
  { id: '3d', name: '3D Render', desc: 'Photorealistic 3D graphics', img: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=200', color: '#00ff9d' },
];

const AI_TEMPLATE_PRESETS = [
  { id: 'social-reel', name: 'Social Media Reel', desc: 'Trending 15s clip with music', icon: <Heart size={18} />, color: '#ff4444', prompt: 'A trendy social media reel with dynamic transitions and upbeat energy' },
  { id: 'product-demo', name: 'Product Demo', desc: 'Professional product showcase', icon: <Megaphone size={18} />, color: '#00ff9d', prompt: 'A sleek product demonstration video with clean white background and smooth rotations' },
  { id: 'explainer', name: 'Explainer Video', desc: 'Animated concept explainer', icon: <GraduationCap size={18} />, color: '#00d4ff', prompt: 'An animated explainer video with clear visuals and step-by-step flow' },
  { id: 'cinematic-trailer', name: 'Cinematic Trailer', desc: 'Epic movie-style trailer', icon: <Film size={18} />, color: '#ff9500', prompt: 'An epic cinematic trailer with dramatic music, sweeping camera movements, and intense visuals' },
  { id: 'travel-vlog', name: 'Travel Vlog', desc: 'Beautiful travel montage', icon: <Globe size={18} />, color: '#00ff9d', prompt: 'A beautiful travel vlog montage with scenic drone shots and warm color grading' },
  { id: 'tutorial', name: 'How-To Tutorial', desc: 'Step-by-step guide', icon: <GraduationCap size={18} />, color: '#00d4ff', prompt: 'A clear step-by-step tutorial video with screen recordings and annotations' },
  { id: 'music-visual', name: 'Music Visualizer', desc: 'Audio-reactive visuals', icon: <Music size={18} />, color: '#ff4444', prompt: 'A mesmerizing music visualizer with audio-reactive particles and waveforms' },
  { id: 'brand-story', name: 'Brand Story', desc: 'Company narrative video', icon: <BarChart3 size={18} />, color: '#ff6b35', prompt: 'A compelling brand story video with professional narration and corporate visuals' },
];

const ENHANCE_FEATURES = [
  { id: 'upscale', name: '4K Upscale', desc: 'Enhance resolution to 4K quality', icon: <MonitorPlay size={18} />, color: '#00d4ff' },
  { id: 'subtitles', name: 'Auto-Subtitles', desc: 'Generate captions from speech', icon: <Type size={18} />, color: '#00ff9d' },
  { id: 'color', name: 'Color Grade', desc: 'Professional color correction', icon: <Palette size={18} />, color: '#ff9500' },
  { id: 'denoise', name: 'Audio Denoise', desc: 'Remove background noise', icon: <Music size={18} />, color: '#ff4444' },
  { id: 'stabilize', name: 'Stabilize', desc: 'Smooth out shaky footage', icon: <SlidersHorizontal size={18} />, color: '#00d4ff' },
  { id: 'broll', name: 'B-Roll Match', desc: 'AI picks matching stock footage', icon: <Image size={18} />, color: '#00ff9d' },
];

const EXAMPLE_PROMPTS = [
  'A golden retriever running through a sunlit meadow with flowers',
  'Futuristic city skyline at night with neon reflections on rain',
  'Product showcase rotating slowly on a clean white background',
  'Ocean waves crashing at sunset, drone aerial shot',
  'Corporate team meeting in a modern glass office building',
  'Abstract geometric shapes morphing with smooth transitions',
  'Time-lapse of a flower blooming in a garden',
  'Aerial view of a mountain range at golden hour',
];

const DURATIONS = ['5s', '10s', '15s', '30s', '60s'];

const RESULT_IMAGES = [
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=600',
  'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?w=600',
  'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?w=600',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?w=600',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=600',
];

function GenerateProgress({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);
  const steps = [
    'Analyzing prompt...',
    'Generating scenes...',
    'Rendering frames...',
    'Adding effects...',
    'Finalizing video...',
  ];

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 4;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(onDone, 400); }
      const newStep = Math.min(Math.floor(p / 20), 4);
      setStep(newStep);
      setPct(Math.round(p));
    }, 180);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{ textAlign: 'center', padding: '50px 30px' }}>
      <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 28px' }}>
        <div className="animate-spin-slow" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: 'var(--cyan)', borderRightColor: 'var(--green)' }} />
        <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wand2 size={24} style={{ color: 'var(--cyan)' }} className="animate-pulse-glow" />
        </div>
        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', fontSize: 12, fontWeight: 800, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>{pct}%</div>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Generating Your Video</div>
      <div style={{ color: 'var(--cyan)', fontSize: 13, marginBottom: 24, minHeight: 18 }}>{steps[step]}</div>

      <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', maxWidth: 360, margin: '0 auto 20px' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--cyan), var(--green))', borderRadius: 3, width: `${pct}%`, transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600,
            background: i < step ? 'rgba(0,255,157,0.1)' : i === step ? 'rgba(0,212,255,0.1)' : 'var(--bg-card)',
            border: `1px solid ${i < step ? 'rgba(0,255,157,0.3)' : i === step ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
            color: i < step ? 'var(--green)' : i === step ? 'var(--cyan)' : 'var(--text-muted)',
            transition: 'all 0.3s',
          }}>
            {i < step ? '✓ ' : ''}{s}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Generator({ onNavigate }: Props) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cinematic');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('16:9');
  const [selectedDuration, setSelectedDuration] = useState('15s');
  const [step, setStep] = useState<GenerateStep>('idle');
  const [resultImg, setResultImg] = useState('');
  const [history, setHistory] = useState<Array<{ prompt: string; img: string; style: string }>>([]);
  const [aiTab, setAiTab] = useState<AITab>('generate');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setStep('generating');
  };

  const handleDone = () => {
    const img = RESULT_IMAGES[Math.floor(Math.random() * RESULT_IMAGES.length)];
    setResultImg(img);
    setHistory(h => [{ prompt, img, style: selectedStyle }, ...h].slice(0, 6));
    setStep('done');
  };

  const reset = () => {
    setStep('idle');
    setResultImg('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const usePreset = (preset: typeof AI_TEMPLATE_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setAiTab('generate');
    setStep('idle');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const ratioStyle = (r: AspectRatio) => {
    if (r === '16:9') return { width: 160, height: 90 };
    if (r === '9:16') return { width: 50, height: 90 };
    if (r === '1:1') return { width: 90, height: 90 };
    return { width: 72, height: 90 };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="tag tag-cyan" style={{ marginBottom: 12 }}>
            <Sparkles size={11} style={{ marginRight: 4 }} />
            AI Video Generator · Free
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            AI Video Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 15 }}>
            Generate, enhance, and transform videos with AI — all free, no limits.
          </p>
        </div>
        <button onClick={() => onNavigate('editor')} className="btn-secondary" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Video size={15} /> Open Editor
        </button>
      </div>

      {/* AI Tab switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', borderRadius: 10, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
        {([
          { id: 'generate' as AITab, label: 'Generate', icon: <Wand2 size={14} /> },
          { id: 'templates' as AITab, label: 'AI Templates', icon: <Sparkles size={14} /> },
          { id: 'enhance' as AITab, label: 'Enhance', icon: <Zap size={14} /> },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setAiTab(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
              background: aiTab === tab.id ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: aiTab === tab.id ? 'var(--cyan)' : 'var(--text-secondary)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {aiTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div>
            {step === 'idle' && (
              <div className="animate-fade-in">
                {/* Prompt */}
                <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Describe Your Video
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="E.g. A golden retriever running through a sunlit meadow with flowers blowing in the breeze..."
                    rows={4}
                    style={{
                      width: '100%', padding: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                      borderRadius: 10, color: 'var(--text-primary)', fontSize: 15, resize: 'none', outline: 'none',
                      lineHeight: 1.6, boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Try an example:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {EXAMPLE_PROMPTS.map(ex => (
                        <button
                          key={ex}
                          onClick={() => setPrompt(ex)}
                          style={{
                            background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 100,
                            padding: '4px 12px', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--cyan)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
                        >
                          {ex.length > 35 ? ex.slice(0, 35) + '...' : ex}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Style */}
                <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Video Style
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                    {STYLES.map(style => (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        style={{
                          borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                          border: `2px solid ${selectedStyle === style.id ? style.color : 'var(--border)'}`,
                          boxShadow: selectedStyle === style.id ? `0 4px 20px ${style.color}30` : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <img src={style.img} alt={style.name} style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }} />
                        <div style={{ padding: '6px 8px', background: 'var(--bg-card)' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: selectedStyle === style.id ? style.color : 'var(--text-primary)', marginBottom: 1 }}>{style.name}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.4 }}>{style.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Aspect Ratio</label>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                        {(['16:9', '9:16', '1:1', '4:5'] as AspectRatio[]).map(ratio => (
                          <div
                            key={ratio}
                            onClick={() => setSelectedRatio(ratio)}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                          >
                            <div style={{
                              ...ratioStyle(ratio),
                              border: `2px solid ${selectedRatio === ratio ? 'var(--cyan)' : 'var(--border)'}`,
                              borderRadius: 5, background: selectedRatio === ratio ? 'rgba(0,212,255,0.08)' : 'var(--bg-card)',
                              transition: 'all 0.2s',
                            }} />
                            <span style={{ fontSize: 10, color: selectedRatio === ratio ? 'var(--cyan)' : 'var(--text-muted)', fontWeight: 600 }}>{ratio}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Duration
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {DURATIONS.map(d => (
                          <button
                            key={d}
                            onClick={() => setSelectedDuration(d)}
                            style={{
                              padding: '6px 14px', borderRadius: 8, border: `1px solid ${selectedDuration === d ? 'var(--cyan)' : 'var(--border)'}`,
                              background: selectedDuration === d ? 'rgba(0,212,255,0.1)' : 'transparent',
                              color: selectedDuration === d ? 'var(--cyan)' : 'var(--text-secondary)',
                              cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                            }}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={generate}
                  disabled={!prompt.trim()}
                  style={{
                    width: '100%', padding: '16px', borderRadius: 12, fontSize: 17,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    opacity: prompt.trim() ? 1 : 0.5,
                  }}
                >
                  <Wand2 size={20} />
                  Generate Video — Free & Instant
                  <ChevronRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: 10, color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Zap size={12} style={{ color: 'var(--orange)' }} />
                  No waiting, no queue — instant generation for everyone
                </div>
              </div>
            )}

            {step === 'generating' && (
              <div className="card animate-fade-in" style={{ padding: 0 }}>
                <GenerateProgress onDone={handleDone} />
              </div>
            )}

            {step === 'done' && (
              <div className="animate-slide-up">
                <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ position: 'relative' }}>
                    <img src={resultImg} alt="Generated video preview" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div className="tag tag-green" style={{ marginBottom: 6 }}>Generated</div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{STYLES.find(s => s.id === selectedStyle)?.name} · {selectedDuration} · {selectedRatio}</div>
                      </div>
                      <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Play size={18} style={{ color: '#07070f', marginLeft: 2 }} />
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: 18, display: 'flex', gap: 10 }}>
                    <button className="btn-primary" onClick={() => onNavigate('editor')} style={{ flex: 1, padding: '10px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Video size={15} /> Edit in Editor
                    </button>
                    <button className="btn-secondary" style={{ flex: 1, padding: '10px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Download size={15} /> Download HD
                    </button>
                    <button className="btn-secondary" style={{ padding: '10px 14px', borderRadius: 9, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={reset} className="btn-secondary" style={{ flex: 1, padding: '11px', borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <RefreshCw size={15} /> Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Tips */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} style={{ color: 'var(--cyan)' }} />
                Prompt Tips
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { tip: 'Be specific about colors, lighting, and mood', good: 'golden sunset light' },
                  { tip: 'Mention camera movement or angle', good: 'slow drone fly-over' },
                  { tip: 'Include the setting clearly', good: 'modern glass office' },
                  { tip: 'Specify the subject\'s action', good: 'running through meadow' },
                ].map(item => (
                  <div key={item.tip} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>-</span> {item.tip}
                    <span style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', borderRadius: 4, padding: '1px 6px', fontSize: 11, color: 'var(--green)', marginLeft: 4 }}>
                      e.g. "{item.good}"
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Free features */}
            <div style={{ padding: 20, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,255,157,0.05))', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} style={{ color: 'var(--orange)' }} />
                100% Free Includes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Unlimited generations', 'HD quality output', 'No watermarks', 'Instant results', 'Commercial use allowed', '8 unique styles'].map(feature => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,255,157,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'var(--green)', fontSize: 9 }}>✓</span>
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent generations */}
            {history.length > 0 && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LayoutGrid size={14} style={{ color: 'var(--text-secondary)' }} />
                  Recent Generations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }} onClick={() => { setPrompt(h.prompt); setResultImg(h.img); setStep('done'); }}>
                      <img src={h.img} alt="" style={{ width: 48, height: 34, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{h.prompt}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.style}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Templates Tab */}
      {aiTab === 'templates' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>AI Video Templates</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>Pre-built AI prompts for common video types — click to generate instantly</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {AI_TEMPLATE_PRESETS.map(preset => (
              <div
                key={preset.id}
                onClick={() => usePreset(preset)}
                className="card"
                style={{ cursor: 'pointer', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: preset.color, opacity: 0.06 }} />
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${preset.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: preset.color }}>
                  {preset.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{preset.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{preset.desc}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontStyle: 'italic' }}>
                  "{preset.prompt.slice(0, 80)}..."
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: preset.color, fontSize: 13, fontWeight: 600, marginTop: 'auto' }}>
                  <Wand2 size={13} /> Use this template
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhance Tab */}
      {aiTab === 'enhance' && (
        <div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>AI Video Enhancement</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>Power up your existing videos with AI-powered tools — all free</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {ENHANCE_FEATURES.map(feat => (
              <div
                key={feat.id}
                className="card"
                style={{ cursor: 'pointer', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: feat.color, opacity: 0.06 }} />
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${feat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feat.color }}>
                  {feat.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{feat.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: feat.color, fontSize: 13, fontWeight: 600, marginTop: 'auto' }}>
                  <Zap size={13} /> Enhance now — Free
                </div>
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div style={{
            marginTop: 32, padding: '48px 24px', border: '2px dashed var(--border)', borderRadius: 16,
            textAlign: 'center', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--cyan)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,212,255,0.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(0,212,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Video size={24} style={{ color: 'var(--cyan)' }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Drop your video here to enhance</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>Or click to browse — supports MP4, MOV, AVI, WebM</div>
            <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: 10, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
              <Video size={15} /> Upload Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
