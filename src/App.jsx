import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  LayoutDashboard,
  Pill,
  GitMerge,
  ShieldAlert,
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { dailySchedule, medicineInfo, behaviorRules } from './data/content';
import Tag from './components/Tag';

const PATHOLOGY_LOOP = [
  { id: 1, title: '过敏性鼻炎', desc: '鼻塞 / 通气不畅', color: 'text-violet-400', border: 'border-violet-500', glow: 'bg-violet-500/10' },
  { id: 2, title: '口呼吸模式', desc: '张口代偿呼吸', color: 'text-blue-400', border: 'border-blue-500', glow: 'bg-blue-500/10' },
  { id: 3, title: '吞气症', desc: '大量空气入胃', color: 'text-cyan-400', border: 'border-cyan-500', glow: 'bg-cyan-500/10' },
  { id: 4, title: '胃内压升高', desc: '胃胀气 / 压力大', color: 'text-emerald-400', border: 'border-emerald-500', glow: 'bg-emerald-500/10' },
  { id: 5, title: '胃食管反流', desc: '酸雾冲破贲门', color: 'text-yellow-400', border: 'border-yellow-500', glow: 'bg-yellow-500/10' },
  { id: 6, title: '咽喉刺激', desc: '灼烧粘膜', color: 'text-orange-400', border: 'border-orange-500', glow: 'bg-orange-500/10' },
  { id: 7, title: '鼻炎加重', desc: '恶性循环', color: 'text-red-400', border: 'border-red-500', glow: 'bg-red-500/10' },
];

const paletteMap = {
  amber: {
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-500/10',
    accent: 'text-amber-200',
  },
  orange: {
    border: 'border-orange-500/50',
    glow: 'shadow-orange-500/20',
    badgeBg: 'bg-orange-500/10',
    accent: 'text-orange-200',
  },
  indigo: {
    border: 'border-indigo-500/50',
    glow: 'shadow-indigo-500/20',
    badgeBg: 'bg-indigo-500/10',
    accent: 'text-indigo-200',
  },
  purple: {
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/20',
    badgeBg: 'bg-purple-500/10',
    accent: 'text-purple-200',
  },
  default: {
    border: 'border-cyan-500/50',
    glow: 'shadow-cyan-500/20',
    badgeBg: 'bg-cyan-500/10',
    accent: 'text-cyan-200',
  },
};

const STORAGE_KEY = 'healthMateTasks_v2';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');

    :root {
      --bg-dark: #0B0F19;
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-bg: rgba(18, 24, 39, 0.7);
    }

    body {
      background-color: var(--bg-dark);
      color: #e2e8f0;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }

    .noise-bg {
      position: fixed;
      inset: 0;
      background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0B0F19 80%);
      z-index: -2;
    }
    .noise-overlay {
      position: fixed;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      z-index: -1;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.5; box-shadow: 0 0 5px currentColor; } 50% { opacity: 1; box-shadow: 0 0 20px currentColor; } }
    @keyframes dash { to { stroke-dashoffset: 0; } }
    @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes glitch-load { 0% { opacity: 0; transform: translateX(-20px) skewX(-10deg); } 60% { opacity: 1; transform: translateX(5px) skewX(5deg); } 100% { opacity: 1; transform: translateX(0) skewX(0); } }

    .animate-glitch { animation: glitch-load 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
    .glass-card { background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .circle-flow { stroke-dasharray: 10 20; animation: dash 15s linear infinite reverse; }
  `}</style>
);

const ParticleCanvas = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return undefined;
    }
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const colors = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'];

    class Particle {
      constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.vx = (Math.random() - 0.5) * 25;
        this.vy = (Math.random() - 0.5) * 25;
        this.size = Math.random() * 4 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 100;
        this.decay = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.vy += 0.5;
        this.life -= this.decay;
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.life / 100);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    for (let i = 0; i < 80; i += 1) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i -= 1;
        }
      }
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group
      ${active
        ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
    `}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className={`text-sm font-medium ${active ? 'text-cyan-300' : ''}`}>{label}</span>
    {active && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />}
  </button>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6 relative pl-4 border-l-2 border-cyan-500">
    <h2 className="text-2xl font-bold text-white tracking-wider uppercase flex items-center gap-2">
      {title}
      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
    </h2>
    <p className="text-slate-400 text-sm mt-1 font-mono">{subtitle}</p>
    <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
  </div>
);

const TaskCard = ({ task, isCompleted, onToggle, delay, placeholder }) => {
  const clickable = !!onToggle && !placeholder;

  return (
    <div
      className={`glass-card rounded-lg p-4 flex items-center justify-between gap-4 transition-all duration-500 animate-glitch
        ${isCompleted && !placeholder ? 'border-emerald-500/30 bg-emerald-900/10' : ''}
        ${clickable ? 'hover:bg-white/10 cursor-pointer' : 'opacity-70'}`}
      style={{ animationDelay: `${delay * 0.08}s` }}
      onClick={clickable ? () => onToggle(task.id) : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter') onToggle(task.id);
            }
          : undefined
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : -1}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Tag type={task.tag} />
          {task.important && <AlertTriangle className="w-3 h-3 text-rose-400" />}
          {placeholder && <span className="text-[10px] text-slate-500 font-mono">占位</span>}
        </div>
        <h3
          className={`font-bold ${
            isCompleted && !placeholder ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-100'
          }`}
        >
          {task.title}
        </h3>
        {task.desc && <p className="text-sm text-slate-400 mt-1 leading-relaxed">{task.desc}</p>}
      </div>

      <button
        type="button"
        disabled={!clickable}
        onClick={clickable ? () => onToggle(task.id) : undefined}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-200
          ${clickable ? 'active:scale-[0.85]' : 'opacity-60'}
          ${
            isCompleted && !placeholder
              ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-transparent border-slate-600 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
          }`}
      >
        {isCompleted && !placeholder ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : (
          <Circle className="w-6 h-6 text-slate-500" />
        )}
      </button>
    </div>
  );
};

const DashboardView = ({ schedule, completedTasks, toggleTask, progress, onReset }) => {
  const sectionTotals = useMemo(
    () =>
      schedule.reduce(
        (acc, section) => ({
          ...acc,
          [section.period]: {
            done: section.tasks.filter((task) => !task.placeholder && completedTasks[task.id]).length,
            total: section.tasks.filter((task) => !task.placeholder).length,
          },
        }),
        {},
      ),
    [completedTasks, schedule],
  );

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 animate-glitch flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldAlert className="w-6 h-6" />
            <span className="font-bold tracking-wide">SYSTEM STATUS</span>
          </div>
          <p className="text-slate-400 text-sm mt-1 font-mono">Protocol active // progress synced</p>
        </div>
        <div className="flex items-center gap-6 flex-1">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>PROGRESS</span>
              <span>{progress}%</span>
            </div>
            <div className="relative h-3 rounded-full bg-slate-900/70 border border-white/5 overflow-hidden mt-1">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-lg border border-slate-600 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-white transition-colors"
          >
            RESET DAY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-flow-row-dense">
        {schedule.map((section, idx) => {
          const colorKey = section.color.split('-')[1];
          const palette = paletteMap[colorKey] || paletteMap.default;
          const done = sectionTotals[section.period]?.done || 0;
          const total = sectionTotals[section.period]?.total || section.tasks.length;

          return (
            <div key={section.period} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />

              <div className={`relative glass-card rounded-2xl p-5 border-t-2 ${palette.border} ${palette.glow} transition-transform duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 text-slate-200`}>{section.icon && <section.icon size={20} />}</div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-white">{section.label}</h3>
                      <p className={`text-[11px] font-mono ${palette.accent}`}>{done}/{total} done</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">BLOCK {idx + 1}</span>
                </div>

                <div className="space-y-3">
                  {section.tasks.map((task, tIdx) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCompleted={!!completedTasks[task.id]}
                      onToggle={task.placeholder ? undefined : toggleTask}
                      delay={idx * 3 + tIdx}
                      placeholder={task.placeholder}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TreatmentView = ({ meds, behaviors }) => (
  <div className="space-y-8 animate-glitch pb-24 md:pb-0">
    <div className="glass-card rounded-2xl p-6 border border-pink-500/20">
      <SectionHeader title="药理干预方案" subtitle="PHARMACOLOGICAL INTERVENTION" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {meds.flatMap((cat) => cat.items).map((med) => (
          <div key={med.name} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-pink-500/40 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-pink-300">{med.name}</h3>
              <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-slate-400 group-hover:text-pink-200 transition-colors">{med.effect || med.role || 'DOSE'}</span>
            </div>
            <div className="text-sm text-slate-300 mb-2 font-mono flex items-center gap-2">
              <Clock className="w-3 h-3" /> {med.use || med.usage}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{med.note}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-card rounded-2xl p-6 border border-cyan-500/20">
      <SectionHeader title="行为矫正协议" subtitle="BEHAVIORAL CORRECTION PROTOCOL" />
      <div className="space-y-3 mt-4">
        {behaviors.map((item, idx) => (
          <div key={item.title} className="flex items-center gap-4 bg-gradient-to-r from-cyan-950/20 to-transparent p-3 rounded-lg border-l-4 border-cyan-600">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center shrink-0">
              <span className="font-mono text-cyan-400 font-bold">{idx + 1}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-200">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PathologyView = () => {
  const radius = 260;
  const center = 350;

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 animate-glitch">
      <div className="glass-card rounded-2xl p-6 border border-violet-500/20 relative min-h-[800px] flex flex-col items-center overflow-hidden">
        <div className="w-full relative z-10">
          <SectionHeader title="共病病理闭环" subtitle="PATHOLOGICAL FEEDBACK LOOP" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="hidden lg:block relative w-[700px] h-[700px] mt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-cyan-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-[pulse-glow_3s_infinite]">
            <div className="absolute inset-0 rounded-full border border-cyan-400 border-dashed animate-[rotate-slow_10s_linear_infinite]" />
            <div className="text-center z-10">
              <RefreshCw className="w-10 h-10 text-cyan-400 mx-auto mb-1 animate-spin duration-[10000ms]" />
              <div className="text-[10px] font-mono text-cyan-300 tracking-widest">CYCLE</div>
              <div className="text-[8px] font-mono text-cyan-500">ACTIVE</div>
            </div>
          </div>

          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="rgba(255,255,255,0.3)" />
              </marker>
            </defs>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
            <circle cx={center} cy={center} r={radius} fill="none" stroke="url(#circleGradient)" strokeWidth="2" className="circle-flow" />
          </svg>

          {PATHOLOGY_LOOP.map((step, idx) => {
            const totalSteps = PATHOLOGY_LOOP.length;
            const angleDeg = (360 / totalSteps) * idx - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = center + radius * Math.cos(angleRad);
            const y = center + radius * Math.sin(angleRad);

            return (
              <div key={step.id} className="absolute w-48 -ml-24 -mt-10" style={{ left: x, top: y }}>
                <div className={`glass-card p-3 rounded-xl border relative group transition-all duration-300 hover:scale-110 hover:z-20 ${step.border}`}>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${step.glow} blur-xl`} />
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-1 text-[10px] font-mono opacity-50">STEP 0{step.id}</div>
                    <h4 className={`font-bold text-sm ${step.color} mb-1`}>{step.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight">{step.desc}</p>
                    {step.id === 5 && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-2 animate-bounce" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden relative w-full mt-4 flex justify-center pl-8">
          <div className="absolute left-0 top-4 bottom-4 w-6 border-l-2 border-t-2 border-b-2 border-red-500/30 rounded-l-3xl z-0" />
          <div className="absolute left-0 top-4 bottom-4 w-6 border-l-2 border-t-2 border-b-2 border-red-500 rounded-l-3xl z-0 animate-[pulse_2s_infinite] opacity-50" />
          <div
            className="absolute left-[-2px] bottom-4 w-2 h-2 bg-red-500 rounded-full animate-[float_3s_linear_infinite_reverse]"
            style={{ offsetPath: 'path("M 0 600 L 0 0")', offsetDistance: '0%' }}
          />

          <div className="flex flex-col gap-4 w-full max-w-sm z-10">
            <div className="absolute -left-1 top-0 bg-red-900/50 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/30 font-mono transform -rotate-90 origin-bottom-left translate-y-12">
              REFLUX FEEDBACK LOOP
            </div>

            {PATHOLOGY_LOOP.map((step, idx) => (
              <div key={step.id} className="relative group">
                <div className={`glass-card p-4 rounded-xl border-l-4 transition-all hover:bg-white/5 relative bg-[#0B0F19] ${step.border}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className={`font-bold ${step.color}`}>{step.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                    </div>
                    <span className="text-2xl font-mono opacity-20 font-bold">0{step.id}</span>
                  </div>
                  {idx < PATHOLOGY_LOOP.length - 1 && (
                    <div className="absolute -bottom-5 left-8 text-slate-600">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {(idx === PATHOLOGY_LOOP.length - 1 || idx === 0) && <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-red-500/50" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [completedTasks, setCompletedTasks] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const tasksById = useMemo(
    () =>
      dailySchedule.flatMap((section) => section.tasks).reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {}),
    [],
  );

  const paddedSchedule = useMemo(
    () =>
      dailySchedule.map((section) =>
        section.period === 'noon'
          ? {
              ...section,
              tasks: [
                ...section.tasks,
                {
                  id: 'n_pad1',
                  title: '占位：午后短暂步行',
                  desc: '3-5分钟轻量活动，促进循环，避免嗜睡。',
                  tag: '行为',
                  placeholder: true,
                },
                {
                  id: 'n_pad2',
                  title: '占位：温水补给',
                  desc: '200-300ml 温水，避开咖啡/浓茶/碳酸饮料。',
                  tag: '行为',
                  placeholder: true,
                },
              ],
            }
          : section,
      ),
    [],
  );

  const totalCoreTasks = useMemo(
    () => dailySchedule.reduce((acc, section) => acc + section.tasks.filter((t) => t.tag !== '按需').length, 0),
    [],
  );

  const doneCoreCount = useMemo(
    () =>
      Object.entries(completedTasks).filter(([id, done]) => done && tasksById[id] && tasksById[id].tag !== '按需').length,
    [completedTasks, tasksById],
  );

  const progress = totalCoreTasks === 0 ? 0 : Math.round((doneCoreCount / totalCoreTasks) * 100);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (error) {
        // ignore broken storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => {
      const isNowCompleted = !prev[taskId];
      if (isNowCompleted) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
      return { ...prev, [taskId]: isNowCompleted };
    });
  };

  const resetTasks = () => {
    setCompletedTasks({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen relative text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-100">
      <GlobalStyles />
      <div className="noise-bg" />
      <div className="noise-overlay" />
      <ParticleCanvas active={showConfetti} />

      <header className="fixed top-0 left-0 w-full h-16 glass-card z-40 px-6 flex items-center justify-between md:justify-around border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldAlert className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white uppercase font-mono">
              Cyber<span className="text-cyan-400">Health</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest">SYSTEM ONLINE v2.0.77</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 bg-black/20 p-1 rounded-2xl border border-white/5">
          <NavButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={LayoutDashboard} label="日程监控" />
          <NavButton active={activeTab === 'treatment'} onClick={() => setActiveTab('treatment')} icon={Pill} label="治疗方案" />
          <NavButton active={activeTab === 'pathology'} onClick={() => setActiveTab('pathology')} icon={GitMerge} label="病理闭环" />
        </nav>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500 font-mono">DAILY SYNC</div>
            <div className="text-cyan-400 font-bold font-mono">{progress}% COMPLETED</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-mono">LOCAL TIME</div>
            <div className="text-white font-bold font-mono">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-16 px-4 max-w-7xl mx-auto">
        <div className="glass-card border border-amber-500/30 text-amber-200 rounded-xl p-3 text-sm font-mono flex items-center gap-3 shadow-[0_10px_40px_rgba(245,158,11,0.15)]">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>学习演示用途，不是专业医疗或用药建议；请遵循医生/药师指导。</span>
        </div>
      </div>

      <main className="pt-6 px-4 max-w-7xl mx-auto min-h-screen">
        {activeTab === 'schedule' && (
          <DashboardView
            schedule={paddedSchedule}
            completedTasks={completedTasks}
            toggleTask={toggleTask}
            progress={progress}
            onReset={resetTasks}
          />
        )}
        {activeTab === 'treatment' && <TreatmentView meds={medicineInfo} behaviors={behaviorRules} />}
        {activeTab === 'pathology' && <PathologyView />}
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-50">
        <div className="glass-card rounded-2xl p-2 flex justify-between items-center shadow-2xl shadow-black/50 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              activeTab === 'schedule' ? 'text-cyan-400 bg-white/5' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">日程</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('treatment')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              activeTab === 'treatment' ? 'text-pink-400 bg-white/5' : 'text-slate-500'
            }`}
          >
            <Pill className="w-6 h-6" />
            <span className="text-[10px] font-medium">方案</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pathology')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
              activeTab === 'pathology' ? 'text-violet-400 bg-white/5' : 'text-slate-500'
            }`}
          >
            <GitMerge className="w-6 h-6" />
            <span className="text-[10px] font-medium">闭环</span>
          </button>
        </div>
      </div>
    </div>
  );
}
