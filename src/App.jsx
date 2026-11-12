import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Check, Thermometer,
  Maximize2, Minimize2, X, ChevronRight, Star, BookOpen, Trash2
} from 'lucide-react';
import {
  PURE_WATER_STATE, TEA_CATEGORIES, SPECIFIC_TEA_LIQUORS, INITIAL_TEAS, VOLUME_PRESETS,
  BREW_METHODS, computeMethodSpecs, interpolateLiquor, formatTime
} from './data.js';
import {
  load, save, unlockAudio, playChime, vibrate, askNotificationPermission,
  notify, holdScreenAwake, releaseScreen
} from './lib.js';

const KEYS = { prefs: 'infuzor_prefs_v2', custom: 'infuzor_custom_teas_v1', favs: 'infuzor_favs_v1', history: 'infuzor_history_v1' };

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="max-w-md w-full max-h-[85vh] overflow-y-auto rounded-[24px] bg-[#1C1C1E] border border-white/[0.12] p-6 text-[#F5F5F7]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <button onClick={onClose} aria-label="Închide" className="p-1.5 rounded-full bg-white/[0.08] text-[#86868B] hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Card = ({ children }) => <div className="p-6 rounded-[24px] bg-[#121214] border border-white/[0.08]">{children}</div>;
const Label = ({ children }) => <div className="text-xs font-medium tracking-wider text-[#86868B] mb-3">{children}</div>;

export default function App() {
  const [initial] = useState(() => load(KEYS.prefs, {}));
  const [customTeas, setCustomTeas] = useState(() => load(KEYS.custom, []));
  const [favs, setFavs] = useState(() => load(KEYS.favs, []));
  const [history, setHistory] = useState(() => load(KEYS.history, []));

  const allTeas = useMemo(() => [...INITIAL_TEAS, ...customTeas], [customTeas]);

  const [selectedCategory, setSelectedCategory] = useState(initial.category || 'oolong');
  const [selectedTeaId, setSelectedTeaId] = useState(initial.teaId || 'tieguanyin');
  const [brewMethod, setBrewMethod] = useState(initial.method || 'western');
  const [volumeMl, setVolumeMl] = useState(initial.volume || 250);
  const [soundEnabled, setSoundEnabled] = useState(initial.sound !== false);
  const [steepIndex, setSteepIndex] = useState(0);
  const [checkedSteps, setCheckedSteps] = useState({});

  const [duration, setDuration] = useState(150);
  const [timeLeft, setTimeLeft] = useState(150);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullScreenBrew, setIsFullScreenBrew] = useState(false);
  const [lastEntryId, setLastEntryId] = useState(null);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showTempGuideModal, setShowTempGuideModal] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [newTeaForm, setNewTeaForm] = useState({ name: '', category: 'oolong', temp: 90, gramsPer100ml: 1.2, steep1: 120 });

  const endAtRef = useRef(null);

  const activeTea = useMemo(() => allTeas.find((t) => t.id === selectedTeaId) || allTeas[0], [allTeas, selectedTeaId]);
  const theme = TEA_CATEGORIES[activeTea.category] || TEA_CATEGORIES.oolong;
  const specs = useMemo(() => computeMethodSpecs(activeTea, brewMethod), [activeTea, brewMethod]);
  const steepCount = Math.min(10, Math.max(3, specs.steeps.length + 1));

  // Context curent pentru callback-ul de finalizare (evită valori vechi).
  const ctxRef = useRef({});
  ctxRef.current = { activeTea, brewMethod, steepIndex, soundEnabled, duration };

  // Persistență preferințe
  useEffect(() => {
    save(KEYS.prefs, { category: selectedCategory, teaId: selectedTeaId, method: brewMethod, volume: volumeMl, sound: soundEnabled });
  }, [selectedCategory, selectedTeaId, brewMethod, volumeMl, soundEnabled]);

  // Setează timerul la schimbarea ceaiului / metodei / infuziei
  useEffect(() => {
    const s = specs.steeps;
    const secs = s[steepIndex] !== undefined ? s[steepIndex] : s[s.length - 1] + (steepIndex - s.length + 1) * 20;
    setIsRunning(false);
    setIsCompleted(false);
    setDuration(secs);
    setTimeLeft(secs);
  }, [specs, steepIndex]);

  const finish = () => {
    const c = ctxRef.current;
    setTimeLeft(0);
    setIsRunning(false);
    setIsCompleted(true);
    if (c.soundEnabled) playChime();
    vibrate();
    if (document.hidden) notify('Ceaiul e gata', `${c.activeTea.name} — infuzia ${c.steepIndex + 1}`);
    const entry = { id: Date.now(), teaId: c.activeTea.id, name: c.activeTea.name, method: c.brewMethod, steep: c.steepIndex + 1, ts: Date.now(), rating: 0 };
    setLastEntryId(entry.id);
    setHistory((h) => {
      const next = [entry, ...h].slice(0, 200);
      save(KEYS.history, next);
      return next;
    });
  };

  // Cronometru bazat pe timestamp: rămâne corect și dacă iOS încetinește JS-ul în fundal
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const rem = Math.ceil((endAtRef.current - Date.now()) / 1000);
      if (rem <= 0) finish();
      else setTimeLeft(rem);
    };
    const id = setInterval(tick, 250);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [isRunning]);

  // Ecranul rămâne aprins cât timp rulează cronometrul
  useEffect(() => {
    if (!isRunning) { releaseScreen(); return; }
    holdScreenAwake();
    const onVis = () => { if (!document.hidden) holdScreenAwake(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [isRunning]);

  const progress = duration > 0 ? Math.min(1, Math.max(0, (duration - timeLeft) / duration)) : 0;

  const target = SPECIFIC_TEA_LIQUORS[activeTea.id] || { ...theme.liquorEnd, label: 'Infuzie naturală' };
  const liquor = useMemo(() => interpolateLiquor(PURE_WATER_STATE, target, progress), [target, progress]);

  const exactGrams = ((specs.gramsPer100ml * volumeMl) / 100).toFixed(1);
  const teaspoons = Math.max(0.5, (specs.gramsPer100ml * volumeMl) / 100 / 2.2).toFixed(1);

  const phaseText = isCompleted
    ? 'Infuzare completă. Decantează lichidul acum.'
    : !isRunning && progress === 0
    ? 'Toarnă apa la temperatura indicată și pornește cronometrul.'
    : progress < 0.35 ? 'Hidratarea frunzelor și eliberarea uleiurilor aromatice.'
    : progress < 0.78 ? 'Extracția corpului, a L-teaninei și a polifenolilor.'
    : 'Finalizarea infuziei — pregătește decantarea.';

  const toggleStartPause = () => {
    unlockAudio();
    askNotificationPermission();
    if (isCompleted) {
      setIsCompleted(false);
      setTimeLeft(duration);
      endAtRef.current = Date.now() + duration * 1000;
      setIsRunning(true);
      return;
    }
    if (!isRunning) {
      endAtRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => { setIsRunning(false); setIsCompleted(false); setTimeLeft(duration); };

  const adjustTime = (delta) => {
    setIsCompleted(false);
    setDuration((d) => Math.max(15, d + delta));
    setTimeLeft((t) => Math.max(5, t + delta));
    if (isRunning) endAtRef.current += delta * 1000;
  };

  const handleMethodChange = (m) => {
    setBrewMethod(m);
    setSteepIndex(0);
    setVolumeMl(BREW_METHODS[m].defaultVol);
  };

  const selectTea = (id) => { setSelectedTeaId(id); setSteepIndex(0); };

  const toggleFav = (id) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    save(KEYS.favs, next);
    if (selectedCategory === 'fav' && next.length === 0) setSelectedCategory(activeTea.category);
  };

  const rate = (value) => {
    setHistory((h) => {
      const next = h.map((e) => (e.id === lastEntryId ? { ...e, rating: value } : e));
      save(KEYS.history, next);
      return next;
    });
  };
  const lastRating = history.find((e) => e.id === lastEntryId)?.rating || 0;

  const clearHistory = () => { setHistory([]); save(KEYS.history, []); };

  const deleteCustomTea = (id) => {
    const next = customTeas.filter((t) => t.id !== id);
    setCustomTeas(next);
    save(KEYS.custom, next);
    if (selectedTeaId === id) selectTea(INITIAL_TEAS.find((t) => t.category === selectedCategory)?.id || 'tieguanyin');
  };

  const handleSaveCustomTea = (e) => {
    e.preventDefault();
    if (!newTeaForm.name.trim()) return;
    const base = Number(newTeaForm.steep1) || 120;
    const temp = Number(newTeaForm.temp);
    const gr = Number(newTeaForm.gramsPer100ml);
    const created = {
      id: 'custom_' + Date.now(), name: newTeaForm.name.trim(), origin: 'Personalizat', category: newTeaForm.category,
      caffeine: '—', bestTime: 'Oricând', flavorProfile: ['Rețetă proprie'],
      waterTempGuide: `${temp}°C — Temperatură setată manual.`,
      warning: 'Scoate frunzele la timp pentru a evita supra-extracția.',
      western: { temp, gramsPer100ml: gr, steeps: [base, base + 30, base + 60] },
      gongfu: {
        temp, gramsPer100ml: +(gr * 2.8).toFixed(1),
        steeps: [Math.max(15, Math.round(base / 4)), Math.max(20, Math.round(base / 3)), Math.max(30, Math.round(base / 2))]
      },
      steps: ['Preîncălzește vasul.', `Adaugă frunzele și apa la ${temp}°C.`, 'Decantează la finalul timpului.']
    };
    const next = [...customTeas, created];
    setCustomTeas(next);
    save(KEYS.custom, next);
    setSelectedCategory(created.category);
    selectTea(created.id);
    setShowCustomModal(false);
    setNewTeaForm({ name: '', category: 'oolong', temp: 90, gramsPer100ml: 1.2, steep1: 120 });
  };

  const categories = [
    ...(favs.length ? [{ id: 'fav', name: 'Favorite' }] : []),
    ...Object.values(TEA_CATEGORIES)
  ];
  const categoryTeas = allTeas.filter((t) => (selectedCategory === 'fav' ? favs.includes(t.id) : t.category === selectedCategory));

  const fmtDate = (ts) => new Date(ts).toLocaleString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-[#2C2C2E] border border-white/[0.08] text-white outline-none';

  return (
    <div
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif' }}
      className="min-h-screen bg-black text-[#F5F5F7] antialiased selection:bg-white/20 pb-20"
    >
      <style>{`
        @keyframes liquidWave { 0% { transform: translateX(0); } 50% { transform: translateX(-25%); } 100% { transform: translateX(-50%); } }
        .apple-wave { animation: liquidWave 10s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="sticky top-0 z-30 bg-black/75 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full transition-colors duration-500" style={{ backgroundColor: theme.accent }} />
            <span className="text-[15px] font-semibold tracking-tight text-white">Infuzor</span>
            <span className="text-xs text-[#86868B] hidden sm:inline">• Parametri & Cronometru Ceai</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { onClick: () => setShowTempGuideModal(true), icon: Thermometer, text: 'Temperaturi', label: 'Ghid temperaturi' },
              { onClick: () => setShowJournal(true), icon: BookOpen, text: 'Jurnal', label: 'Jurnal' },
              { onClick: () => setShowCustomModal(true), icon: Plus, text: 'Adaugă', label: 'Adaugă ceai' }
            ].map(({ onClick, icon: Icon, text, label }) => (
              <button key={text} onClick={onClick} aria-label={label}
                className="px-3 py-1.5 rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition">
                <Icon className="w-3.5 h-3.5 text-[#86868B]" />
                <span className="hidden sm:inline">{text}</span>
              </button>
            ))}
            <button onClick={() => setSoundEnabled(!soundEnabled)} aria-label="Sunet"
              className="p-2 rounded-full bg-[#1C1C1E] hover:bg-[#2C2C2E] border border-white/[0.08] transition">
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#86868B]" />}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-6">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const first = allTeas.find((t) => (cat.id === 'fav' ? favs.includes(t.id) : t.category === cat.id));
                if (first) selectTea(first.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id ? 'bg-white text-black font-semibold' : 'bg-[#121214] text-[#86868B] hover:text-white border border-white/[0.06]'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
          {categoryTeas.map((tea) => {
            const active = tea.id === activeTea.id;
            const isFav = favs.includes(tea.id);
            return (
              <div key={tea.id} role="button" tabIndex={0} onClick={() => selectTea(tea.id)}
                onKeyDown={(e) => e.key === 'Enter' && selectTea(tea.id)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  active ? 'bg-[#1C1C1E] border-white/25' : 'bg-[#0C0C0E] border-white/[0.06] hover:bg-[#141416]'
                }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">{tea.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-[#86868B]">{(tea[brewMethod] || tea.western).temp}°C</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleFav(tea.id); }} aria-label="Favorit">
                      <Star className={`w-4 h-4 ${isFav ? 'fill-[#E09F3E] text-[#E09F3E]' : 'text-[#86868B]'}`} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#86868B]">{tea.origin}</span>
                  {tea.id.startsWith('custom_') && (
                    <button onClick={(e) => { e.stopPropagation(); deleteCustomTea(tea.id); }} aria-label="Șterge ceaiul">
                      <Trash2 className="w-3.5 h-3.5 text-[#86868B] hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-5 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className={`${isFullScreenBrew ? 'fixed inset-0 z-50 rounded-none' : 'lg:col-span-7 rounded-[28px] min-h-[560px] border border-white/[0.08]'} bg-[#0A0A0C] relative overflow-hidden flex flex-col justify-between transition-all duration-500`}
        >
          <div className="absolute inset-x-0 bottom-0 pointer-events-none transition-all duration-700 ease-out"
            style={{ height: `${Math.max(8, progress * 94)}%`, background: `linear-gradient(180deg, ${liquor.topRgba} 0%, ${liquor.bottomRgba} 100%)` }}>
            <div className="w-full h-full transition-opacity duration-700"
              style={{
                opacity: Math.min(0.85, progress * 1.15),
                background: `radial-gradient(circle at 50% 100%, rgba(${target.r}, ${target.g}, ${target.b}, ${0.35 * progress}) 0%, transparent 75%)`
              }} />
            <div className="absolute -top-7 left-0 w-[200%] h-8 overflow-hidden">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full apple-wave"
                style={{ fill: liquor.topRgba, transition: 'fill 0.7s ease-out' }}>
                <path d="M0,60 C200,105 400,15 600,60 C800,105 1000,15 1200,60 L1200,120 L0,120 Z" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 p-6 flex items-start justify-between">
            <div>
              <div className="text-xs font-medium tracking-widest text-[#86868B]">
                {BREW_METHODS[brewMethod].label} · {brewMethod === 'grandpa' ? `Reumplerea ${steepIndex + 1}` : `Infuzia ${steepIndex + 1}`}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white mt-1">{activeTea.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full border border-white/25" style={{ backgroundColor: liquor.bottomRgba }} />
                <span className="text-[11px] text-[#A1A1A6]">
                  {progress < 0.05 ? 'Apă pură incoloră' : progress < 0.45 ? 'Extracție incipientă' : target.label}
                </span>
              </div>
              <button onClick={() => setIsFullScreenBrew(!isFullScreenBrew)} aria-label="Ecran complet"
                className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] backdrop-blur-md transition">
                {isFullScreenBrew ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="relative z-10 my-auto px-6 py-4 flex flex-col items-center text-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
                <circle cx="120" cy="120" r="108" fill="none"
                  stroke={progress < 0.03 ? 'rgba(255,255,255,0.35)' : liquor.solidRgb} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 108} strokeDashoffset={2 * Math.PI * 108 * (1 - progress)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-medium tracking-widest text-[#86868B]">
                  {isCompleted ? 'Complet' : isRunning ? 'În curs' : 'Durată'}
                </span>
                <div className="text-6xl font-light tracking-tight tabular-nums text-white my-1" aria-live="off">{formatTime(timeLeft)}</div>
                <div className="text-xs text-[#A1A1A6] font-mono">{specs.temp}°C · {exactGrams}g</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button onClick={() => adjustTime(-15)} className="px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/[0.1] text-xs font-medium backdrop-blur-md transition">−15s</button>
              <span className="px-3.5 py-1.5 rounded-full bg-black/50 border border-white/[0.08] text-xs font-mono text-[#A1A1A6] backdrop-blur-md">{Math.round(progress * 100)}%</span>
              <button onClick={() => adjustTime(15)} className="px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/[0.1] text-xs font-medium backdrop-blur-md transition">+15s</button>
            </div>

            <p className="mt-4 max-w-sm text-xs text-[#A1A1A6] leading-relaxed">{phaseText}</p>

            {isCompleted && (
              <div className="mt-3 flex items-center gap-1" aria-label="Notează ceaiul">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => rate(n)} aria-label={`${n} stele`}>
                    <Star className={`w-6 h-6 ${n <= lastRating ? 'fill-[#E09F3E] text-[#E09F3E]' : 'text-[#86868B]'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 p-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-full border border-white/[0.06] max-w-full overflow-x-auto no-scrollbar">
              {Array.from({ length: steepCount }, (_, idx) => (
                <button key={idx} onClick={() => setSteepIndex(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${steepIndex === idx ? 'bg-white text-black font-semibold' : 'text-[#86868B] hover:text-white'}`}>
                  {brewMethod === 'grandpa' ? `Pahar ${idx + 1}` : `Infuzia ${idx + 1}`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button onClick={resetTimer} aria-label="Resetează" className="p-3.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] transition">
                <RotateCcw className="w-4 h-4" />
              </button>
              {isCompleted && steepIndex < steepCount - 1 && (
                <button onClick={() => setSteepIndex((p) => Math.min(steepCount - 1, p + 1))}
                  className="px-4 py-3 rounded-full bg-white/[0.1] hover:bg-white/[0.16] border border-white/[0.12] text-xs font-medium flex items-center gap-1 transition">
                  <span>Infuzia {steepIndex + 2}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={toggleStartPause}
                className="px-7 py-3 rounded-full bg-white text-black hover:bg-[#E5E5EA] font-semibold text-sm flex items-center gap-2 transition active:scale-95">
                {isRunning ? (<><Pause className="w-4 h-4 fill-current" /><span>Pauză</span></>) : (<><Play className="w-4 h-4 fill-current" /><span>{isCompleted ? 'Reia' : 'Start'}</span></>)}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium tracking-wider text-[#86868B]">Metode infuzie</span>
              <span className="text-[11px] text-[#86868B]">{BREW_METHODS[brewMethod].shortSub}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#1C1C1E] border border-white/[0.06] mb-3">
              {Object.values(BREW_METHODS).map((m) => {
                const on = brewMethod === m.id;
                return (
                  <button key={m.id} onClick={() => handleMethodChange(m.id)}
                    className={`px-3 py-2.5 rounded-xl text-left transition ${on ? 'bg-white text-black shadow-sm' : 'text-[#86868B] hover:text-white hover:bg-white/[0.04]'}`}>
                    <div className={`text-xs ${on ? 'font-semibold' : 'font-medium'}`}>{m.label}</div>
                    <div className={`text-[10px] mt-0.5 ${on ? 'text-black/65' : 'text-[#86868B]/80'}`}>{m.shortSub}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#A1A1A6] leading-relaxed mb-5 px-0.5">{BREW_METHODS[brewMethod].description}</p>

            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#86868B]">{brewMethod === 'coldbrew' ? 'Volum total (apă + gheață)' : 'Volum apă'}</span>
                <span className="font-mono text-white">{volumeMl} ml</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {VOLUME_PRESETS.map((v) => (
                  <button key={v} onClick={() => setVolumeMl(v)}
                    className={`py-2 rounded-xl text-xs font-mono transition border ${volumeMl === v ? 'bg-white text-black font-semibold border-white' : 'bg-[#1C1C1E] text-[#86868B] border-white/[0.05] hover:text-white'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/[0.05]">
                <div className="text-[11px] text-[#86868B]">Frunze</div>
                <div className="text-xl font-semibold font-mono mt-1">{exactGrams}g</div>
                <div className="text-[11px] text-[#86868B] mt-0.5">≈ {teaspoons} lingurițe</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/[0.05]">
                <div className="text-[11px] text-[#86868B]">Temperatură</div>
                <div className="text-xl font-semibold font-mono mt-1">{specs.temp}°C</div>
                <div className="text-[11px] text-[#86868B] mt-0.5">
                  {brewMethod === 'coldbrew' ? '50% apă + 50% gheață' : specs.temp <= 75 ? 'Răcită 4–5m' : specs.temp <= 85 ? 'Răcită 2–3m' : 'Aproape clocot'}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/[0.05]">
                <div className="text-[11px] text-[#86868B]">Timp</div>
                <div className="text-xl font-semibold font-mono mt-1">{formatTime(duration)}</div>
                <div className="text-[11px] text-[#86868B] mt-0.5">{brewMethod === 'grandpa' ? `Pahar ${steepIndex + 1}` : `Infuzia ${steepIndex + 1}`}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-[#A1A1A6] leading-relaxed">
              <span className="text-white font-medium">Ghid metodă: </span>{specs.methodNote}
            </div>
          </Card>

          <Card>
            <Label>Instrucțiuni · {BREW_METHODS[brewMethod].label}</Label>
            <div className="space-y-2">
              {(specs.customSteps || activeTea.steps).map((text, idx) => {
                const key = `${activeTea.id}_${brewMethod}_${idx}`;
                const done = !!checkedSteps[key];
                return (
                  <button key={key} onClick={() => setCheckedSteps((p) => ({ ...p, [key]: !p[key] }))}
                    className={`w-full p-3.5 rounded-2xl text-left text-xs flex items-start gap-3 transition border ${done ? 'bg-[#1C1C1E]/50 border-white/[0.04] text-[#86868B]' : 'bg-[#1C1C1E] border-white/[0.06] text-[#F5F5F7]'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${done ? 'bg-white border-white text-black' : 'border-white/30 text-[#86868B]'}`}>
                      {done ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className={done ? 'line-through' : 'leading-relaxed'}>{text}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-[#A1A1A6] leading-relaxed">
              <span className="text-white font-medium">Notă extracție: </span>{activeTea.warning}
            </div>
          </Card>

          <Card>
            <Label>Profil & cofeină</Label>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeTea.flavorProfile.map((n) => (
                <span key={n} className="px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/[0.06] text-xs">{n}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#1C1C1E] border border-white/[0.05]">
                <span className="text-[#86868B] block">Cofeină estimată / ceașcă</span>
                <span className="text-white font-medium mt-0.5 block">{activeTea.caffeine}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1C1C1E] border border-white/[0.05]">
                <span className="text-[#86868B] block">Recomandat</span>
                <span className="text-white font-medium mt-0.5 block">{activeTea.bestTime}</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium tracking-wider text-[#86868B]">Top 3 branduri · {theme.name}</span>
              <span className="text-[11px] text-[#86868B]">Referințe</span>
            </div>
            <div className="space-y-2">
              {theme.topBrands.map((b) => (
                <div key={b.name} className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/[0.05] flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">{b.name}</div>
                    <p className="text-[11px] text-[#A1A1A6] mt-1 leading-relaxed">{b.spec}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#86868B] bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">{b.origin}</span>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-[11px] text-[#86868B] leading-relaxed px-2">
            Valorile de cofeină sunt orientative și variază după frunze și timp. Informațiile nu înlocuiesc sfatul medicului.
            Pentru alertă la final ține aplicația deschisă; ecranul rămâne aprins cât rulează cronometrul.
          </p>
        </div>
      </main>

      {showTempGuideModal && (
        <Modal title="Temperaturi fără termometru" onClose={() => setShowTempGuideModal(false)}>
          <div className="space-y-2.5 text-xs">
            {[
              ['60°C – 70°C · Gyokuro & Sencha', 'Bule minuscule pe fundul ibricului, abur abia vizibil. După fierbere, așteaptă 6–8 minute.'],
              ['75°C – 80°C · Yerba Mate, Ceai Verde & Alb', 'Bule de mărimea unui bob de mazăre. După fierbere, lasă ibricul descoperit 3–4 minute.'],
              ['90°C · Oolong & Darjeeling', 'Bule mari care urcă rapid. După fierbere, așteaptă 1–1,5 minute.'],
              ['98°C – 100°C · Negru, Pu-erh & Infuzii', 'Clocot activ. Se toarnă imediat după oprirea fierbătorului.']
            ].map(([t, d]) => (
              <div key={t} className="p-3.5 rounded-2xl bg-[#2C2C2E]/60 border border-white/[0.06]">
                <div className="font-semibold text-white">{t}</div>
                <p className="mt-1 text-[#A1A1A6]">{d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowTempGuideModal(false)} className="w-full mt-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs">Închide</button>
        </Modal>
      )}

      {showJournal && (
        <Modal title="Jurnal de ceai" onClose={() => setShowJournal(false)}>
          {history.length === 0 ? (
            <p className="text-xs text-[#A1A1A6]">Încă nimic aici. Fiecare infuzie terminată apare automat, iar la final o poți nota cu stele.</p>
          ) : (
            <>
              <div className="space-y-2 text-xs">
                {history.slice(0, 50).map((e) => (
                  <div key={e.id} className="p-3 rounded-2xl bg-[#2C2C2E]/60 border border-white/[0.06] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{e.name}</div>
                      <div className="text-[#86868B] mt-0.5">{BREW_METHODS[e.method]?.label} · infuzia {e.steep} · {fmtDate(e.ts)}</div>
                    </div>
                    <div className="flex shrink-0">
                      {e.rating > 0 && Array.from({ length: e.rating }, (_, i) => <Star key={i} className="w-3 h-3 fill-[#E09F3E] text-[#E09F3E]" />)}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={clearHistory} className="w-full mt-5 py-2.5 rounded-full bg-[#2C2C2E] text-white font-medium text-xs">Șterge jurnalul</button>
            </>
          )}
        </Modal>
      )}

      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomTea} className="max-w-md w-full rounded-[24px] bg-[#1C1C1E] border border-white/[0.12] p-6 text-[#F5F5F7]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Ceai nou</h3>
              <button type="button" onClick={() => setShowCustomModal(false)} aria-label="Închide" className="p-1.5 rounded-full bg-white/[0.08] text-[#86868B] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#86868B] mb-1">Nume</label>
                <input type="text" required placeholder="ex: Genmaicha" value={newTeaForm.name}
                  onChange={(e) => setNewTeaForm({ ...newTeaForm, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[#86868B] mb-1">Categorie</label>
                <select value={newTeaForm.category} onChange={(e) => setNewTeaForm({ ...newTeaForm, category: e.target.value })} className={inputCls}>
                  {Object.values(TEA_CATEGORIES).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  ['Temp (°C)', 'temp', { min: 50, max: 100 }],
                  ['g / 100ml', 'gramsPer100ml', { step: 0.1, min: 0.5, max: 8 }],
                  ['Timp (sec)', 'steep1', { min: 10, max: 600 }]
                ].map(([label, field, extra]) => (
                  <div key={field}>
                    <label className="block text-[#86868B] mb-1">{label}</label>
                    <input type="number" {...extra} value={newTeaForm[field]}
                      onChange={(e) => setNewTeaForm({ ...newTeaForm, [field]: e.target.value })} className={`${inputCls} font-mono`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setShowCustomModal(false)} className="flex-1 py-2.5 rounded-full bg-[#2C2C2E] text-white font-medium text-xs">Anulează</button>
              <button type="submit" className="flex-1 py-2.5 rounded-full bg-white text-black font-semibold text-xs">Salvează</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
