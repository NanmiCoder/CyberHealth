import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, 
  Wind, 
  CloudRain, 
  Zap, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Pill, 
  LayoutDashboard, 
  GitMerge, 
  ShieldAlert,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * 1. 数据配置 (DATA CONFIGURATION)
 * ------------------------------------------------------------------
 */

const SCHEDULE_DATA = [
  {
    id: 'morning',
    period: '早安晨醒 (Morning)',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    color: 'border-amber-500/50 shadow-amber-500/20',
    tasks: [
      { id: 'm1', time: '07:00', title: '空腹服药', detail: '艾司奥美拉唑 (Nexium) 20mg', type: 'med' },
      { id: 'm2', time: '07:15', title: '温水唤醒', detail: '饮用 300ml 温水，温润食道', type: 'action' },
      { id: 'm3', time: '07:30', title: '早餐', detail: '低脂、非流质固体食物（全麦面包/燕麦）', type: 'action' },
    ]
  },
  {
    id: 'noon',
    period: '午间赋能 (Noon)',
    icon: <Activity className="w-5 h-5 text-cyan-400" />,
    color: 'border-cyan-500/50 shadow-cyan-500/20',
    tasks: [
      { id: 'n1', time: '12:00', title: '餐前服药', detail: '莫沙必利 (Mosapride) 5mg', type: 'med' },
      { id: 'n2', time: '12:30', title: '午餐', detail: '七分饱，避免高糖高油，细嚼慢咽', type: 'action' },
      { id: 'n3', time: '13:00', title: '直立消食', detail: '站立或散步 20 分钟，严禁午睡平躺', type: 'action' },
    ]
  },
  {
    id: 'evening',
    period: '晚间养护 (Evening)',
    icon: <Wind className="w-5 h-5 text-emerald-400" />,
    color: 'border-emerald-500/50 shadow-emerald-500/20',
    tasks: [
      { id: 'e1', time: '18:00', title: '晚餐截止', detail: '睡前 3-4 小时禁食', type: 'action' },
      { id: 'e2', time: '19:00', title: '腹式呼吸', detail: '训练贲门括约肌张力 (15分钟)', type: 'action' },
      { id: 'e3', time: '21:00', title: '洗鼻护理', detail: '生理盐水冲洗鼻腔，清理分泌物', type: 'action' },
    ]
  },
  {
    id: 'sleep',
    period: '休眠协议 (Sleep)',
    icon: <CloudRain className="w-5 h-5 text-violet-400" />,
    color: 'border-violet-500/50 shadow-violet-500/20',
    tasks: [
      { id: 's1', time: '22:30', title: '物理抗反流', detail: '床头抬高 15-20cm (利用重力)', type: 'action' },
      { id: 's2', time: '23:00', title: '左侧卧位', detail: '减少胃酸反流至食管的可能性', type: 'action' },
    ]
  }
];

const TREATMENT_PLAN = {
  meds: [
    { name: '艾司奥美拉唑', role: 'PPI 抑酸剂', usage: '早饭前 30 分钟', note: '强效抑制胃酸分泌，减少对咽喉刺激' },
    { name: '莫沙必利', role: '促动力药', usage: '三餐前 15 分钟', note: '促进胃排空，减少食物滞留产生的气体' },
    { name: '糠酸莫米松', role: '鼻喷激素', usage: '晨起/睡前', note: '控制鼻炎炎症，减轻鼻后滴漏' },
  ],
  rules: [
    { rule: '严禁口呼吸', reason: '口呼吸导致吞咽大量空气，增加胃内压' },
    { rule: '少食多餐', reason: '避免胃部过度充盈，降低反流风险' },
    { rule: '忌口清单', reason: '咖啡、浓茶、巧克力、薄荷、碳酸饮料、辛辣' },
  ]
};

const PATHOLOGY_LOOP = [
  { id: 1, title: '过敏性鼻炎', desc: '鼻塞 / 通气不畅', type: 'origin', color: 'text-violet-400', border: 'border-violet-500' },
  { id: 2, title: '口呼吸模式', desc: '张口代偿呼吸', type: 'cause', color: 'text-blue-400', border: 'border-blue-500' },
  { id: 3, title: '吞气症', desc: '大量空气入胃', type: 'cause', color: 'text-cyan-400', border: 'border-cyan-500' },
  { id: 4, title: '胃内压升高', desc: '胃胀气 / 压力大', type: 'cause', color: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 5, title: '胃食管反流', desc: '酸雾冲破贲门', type: 'reflux', color: 'text-yellow-400', border: 'border-yellow-500' },
  { id: 6, title: '咽喉刺激', desc: '灼烧粘膜', type: 'damage', color: 'text-orange-400', border: 'border-orange-500' },
  { id: 7, title: '鼻炎加重', desc: '恶性循环', type: 'damage', color: 'text-red-400', border: 'border-red-500' },
];

/**
 * ------------------------------------------------------------------
 * 2. 动画与样式 (STYLES & ANIMATION)
 * ------------------------------------------------------------------
 */
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

    /* 噪点纹理背景 */
    .noise-bg {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0B0F19 80%);
      z-index: -2;
    }
    .noise-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      z-index: -1;
      pointer-events: none;
    }

    /* 滚动条美化 */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    /* 动画定义 */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 5px currentColor; }
      50% { opacity: 1; box-shadow: 0 0 20px currentColor; }
    }

    @keyframes dash {
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes rotate-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes glitch-load {
      0% { opacity: 0; transform: translateX(-20px) skewX(-10deg); }
      60% { opacity: 1; transform: translateX(5px) skewX(5deg); }
      100% { opacity: 1; transform: translateX(0) skewX(0); }
    }

    .animate-glitch {
      animation: glitch-load 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }

    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* 环形流动效果 */
    .circle-flow {
      stroke-dasharray: 10 20;
      animation: dash 15s linear infinite reverse;
    }
  `}</style>
);

/**
 * ------------------------------------------------------------------
 * 3. 粒子系统 (PARTICLE SYSTEM)
 * ------------------------------------------------------------------
 */
const ParticleCanvas = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
        this.vx = (Math.random() - 0.5) * 25; // Explosive speed
        this.vy = (Math.random() - 0.5) * 25;
        this.size = Math.random() * 4 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 100;
        this.decay = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92; // Friction
        this.vy *= 0.92;
        this.vy += 0.5; // Gravity
        this.life -= this.decay;
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.life / 100);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size); // Square particles for cyber feel
      }
    }

    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

/**
 * ------------------------------------------------------------------
 * 4. UI 组件 (COMPONENTS)
 * ------------------------------------------------------------------
 */

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group
      ${active 
        ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
    `}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className={`text-sm font-medium ${active ? 'text-cyan-300' : ''}`}>{label}</span>
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
    )}
  </button>
);

const TaskCard = ({ task, isCompleted, onToggle, delay }) => {
  return (
    <div 
      className={`glass-card rounded-lg p-4 flex items-center justify-between gap-4 transition-all duration-500 hover:bg-white/10 animate-glitch
        ${isCompleted ? 'border-emerald-500/30 bg-emerald-900/10' : ''}
      `}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${task.type === 'med' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
            {task.time}
          </span>
          {task.type === 'med' && <Pill className="w-3 h-3 text-pink-400" />}
        </div>
        <h3 className={`font-bold ${isCompleted ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-100'}`}>
          {task.title}
        </h3>
        <p className="text-sm text-slate-400 mt-1">{task.detail}</p>
      </div>

      <button
        onClick={() => onToggle(task.id)}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-[0.85] duration-200
          ${isCompleted 
            ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
            : 'bg-transparent border-slate-600 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'}
        `}
      >
        {isCompleted ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Circle className="w-6 h-6 text-slate-500" />}
      </button>
    </div>
  );
};

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

/**
 * ------------------------------------------------------------------
 * 5. 主要视图模块 (VIEWS)
 * ------------------------------------------------------------------
 */

const DashboardView = ({ completedTasks, toggleTask }) => {
  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SCHEDULE_DATA.map((section, idx) => {
          const allDone = section.tasks.every(t => completedTasks[t.id]);
          return (
            <div key={section.id} className="relative group">
              {/* 背景光晕 */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur`}></div>
              
              <div className={`relative glass-card rounded-2xl p-5 border-t-2 ${section.color} transition-transform duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white/5 ${allDone ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">{section.period}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{section.tasks.filter(t => completedTasks[t.id]).length}/{section.tasks.length} DONE</span>
                </div>
                
                <div className="space-y-3">
                  {section.tasks.map((task, tIdx) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      isCompleted={!!completedTasks[task.id]} 
                      onToggle={toggleTask}
                      delay={idx * 3 + tIdx}
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

const TreatmentView = () => (
  <div className="space-y-8 animate-glitch pb-24 md:pb-0">
    {/* 药物清单 */}
    <div className="glass-card rounded-2xl p-6 border border-pink-500/20">
      <SectionHeader title="药理干预方案" subtitle="PHARMACOLOGICAL INTERVENTION" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {TREATMENT_PLAN.meds.map((med, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-pink-500/40 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-pink-300">{med.name}</h3>
              <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-slate-400 group-hover:text-pink-200 transition-colors">{med.role}</span>
            </div>
            <div className="text-sm text-slate-300 mb-2 font-mono flex items-center gap-2">
              <Clock className="w-3 h-3" /> {med.usage}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{med.note}</p>
          </div>
        ))}
      </div>
    </div>

    {/* 行为守则 */}
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/20">
      <SectionHeader title="行为矫正协议" subtitle="BEHAVIORAL CORRECTION PROTOCOL" />
      <div className="space-y-3 mt-4">
        {TREATMENT_PLAN.rules.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-gradient-to-r from-cyan-950/20 to-transparent p-3 rounded-lg border-l-4 border-cyan-600">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center shrink-0">
              <span className="font-mono text-cyan-400 font-bold">{idx + 1}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-200">{item.rule}</h4>
              <p className="text-sm text-slate-500">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 新版病理闭环视图 - 包含环形布局和垂直闭环
const PathologyView = () => {
  // 计算环形布局的位置 (半径 280px)
  const radius = 260;
  const centerX = 350;
  const centerY = 350;

  return (
    <div className="h-full flex flex-col pb-24 md:pb-0 animate-glitch">
      <div className="glass-card rounded-2xl p-6 border border-violet-500/20 relative min-h-[800px] flex flex-col items-center overflow-hidden">
        <div className="w-full relative z-10">
          <SectionHeader title="共病病理闭环" subtitle="PATHOLOGICAL FEEDBACK LOOP" />
        </div>
        
        {/* 背景装饰网格 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* --- 桌面端：环形反应堆布局 (Cyber Reactor) --- */}
        <div className="hidden lg:block relative w-[700px] h-[700px] mt-4">
          
          {/* 中心核心：跳动的反应源 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-cyan-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-[pulse-glow_3s_infinite]">
            <div className="absolute inset-0 rounded-full border border-cyan-400 border-dashed animate-[rotate-slow_10s_linear_infinite]" />
            <div className="text-center z-10">
              <RefreshCw className="w-10 h-10 text-cyan-400 mx-auto mb-1 animate-spin duration-[10000ms]" />
              <div className="text-[10px] font-mono text-cyan-300 tracking-widest">CYCLE</div>
              <div className="text-[8px] font-mono text-cyan-500">ACTIVE</div>
            </div>
          </div>

          {/* 环形连接线 SVG */}
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
            {/* 轨道圆环 */}
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="url(#circleGradient)" strokeWidth="2" className="circle-flow" />
          </svg>

          {/* 节点分布 */}
          {PATHOLOGY_LOOP.map((step, idx) => {
            // 计算角度：从 -90度 (12点钟) 开始，顺时针排列
            const totalSteps = PATHOLOGY_LOOP.length;
            const angleDeg = (360 / totalSteps) * idx - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            
            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);

            return (
              <div 
                key={step.id}
                className="absolute w-48 -ml-24 -mt-10" // Center the div
                style={{ left: x, top: y }}
              >
                <div className={`glass-card p-3 rounded-xl border relative group transition-all duration-300 hover:scale-110 hover:z-20 border-${step.color.split('-')[1]}-500/40`}>
                  {/* 连接点 */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-${step.color.split('-')[1]}-500/10 blur-xl`} />
                  
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

        {/* --- 移动端：垂直U形闭环 (Mobile Snake Loop) --- */}
        <div className="lg:hidden relative w-full mt-4 flex justify-center pl-8"> {/* Left padding for the return pipe */}
          
          {/* 左侧巨大的回流管路 (Cyber Feedback Pipe) */}
          <div className="absolute left-0 top-4 bottom-4 w-6 border-l-2 border-t-2 border-b-2 border-red-500/30 rounded-l-3xl z-0" />
          <div className="absolute left-0 top-4 bottom-4 w-6 border-l-2 border-t-2 border-b-2 border-red-500 rounded-l-3xl z-0 animate-[pulse_2s_infinite] opacity-50" />
          
          {/* 上行粒子动画 (Reflux) */}
          <div className="absolute left-[-2px] bottom-4 w-2 h-2 bg-red-500 rounded-full animate-[float_3s_linear_infinite_reverse]" 
               style={{ offsetPath: 'path("M 0 600 L 0 0")', offsetDistance: '0%' }} 
          />
          
          <div className="flex flex-col gap-4 w-full max-w-sm z-10">
             {/* 顶部标签 */}
            <div className="absolute -left-1 top-0 bg-red-900/50 text-red-400 text-[10px] px-2 py-1 rounded border border-red-500/30 font-mono transform -rotate-90 origin-bottom-left translate-y-12">
               REFLUX FEEDBACK LOOP
            </div>

            {PATHOLOGY_LOOP.map((step, idx) => (
              <div key={step.id} className="relative group">
                <div className={`glass-card p-4 rounded-xl border-l-4 transition-all hover:bg-white/5 relative bg-[#0B0F19]
                   ${step.border}
                `}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className={`font-bold ${step.color}`}>{step.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                    </div>
                    <span className="text-2xl font-mono opacity-20 font-bold">0{step.id}</span>
                  </div>
                  
                  {/* 箭头连接 */}
                  {idx < PATHOLOGY_LOOP.length - 1 && (
                    <div className="absolute -bottom-5 left-8 text-slate-600">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {/* 最后一个节点连接回左侧管路 */}
                {idx === PATHOLOGY_LOOP.length - 1 && (
                  <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-red-500/50" />
                )}
                {/* 第一个节点连接回左侧管路 */}
                {idx === 0 && (
                  <div className="absolute top-1/2 -left-6 w-6 h-[2px] bg-red-500/50" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------
 * 6. 主应用 (MAIN APP)
 * ------------------------------------------------------------------
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [completedTasks, setCompletedTasks] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 时钟更新
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 任务切换处理
  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const isNowCompleted = !prev[taskId];
      
      if (isNowCompleted) {
        // 触发多巴胺效果
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      
      return {
        ...prev,
        [taskId]: isNowCompleted
      };
    });
  };

  // 计算整体进度
  const totalTasks = useMemo(() => SCHEDULE_DATA.reduce((acc, curr) => acc + curr.tasks.length, 0), []);
  const doneCount = Object.keys(completedTasks).length;
  const progress = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="min-h-screen relative text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-100">
      <GlobalStyles />
      <div className="noise-bg" />
      <div className="noise-overlay" />
      <ParticleCanvas active={showConfetti} />

      {/* 顶部状态栏 (PC Only) */}
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

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-4 bg-black/20 p-1 rounded-2xl border border-white/5">
          <NavButton 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')} 
            icon={LayoutDashboard} 
            label="日程监控" 
          />
          <NavButton 
            active={activeTab === 'treatment'} 
            onClick={() => setActiveTab('treatment')} 
            icon={Pill} 
            label="治疗方案" 
          />
          <NavButton 
            active={activeTab === 'pathology'} 
            onClick={() => setActiveTab('pathology')} 
            icon={GitMerge} 
            label="病理闭环" 
          />
        </nav>

        {/* 状态指示器 */}
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

      {/* 主内容区域 */}
      <main className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
        {activeTab === 'schedule' && (
          <DashboardView completedTasks={completedTasks} toggleTask={toggleTask} />
        )}
        {activeTab === 'treatment' && <TreatmentView />}
        {activeTab === 'pathology' && <PathologyView />}
      </main>

      {/* 移动端底部导航 Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-50">
        <div className="glass-card rounded-2xl p-2 flex justify-between items-center shadow-2xl shadow-black/50 border border-white/10">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'schedule' ? 'text-cyan-400 bg-white/5' : 'text-slate-500'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium">日程</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('treatment')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'treatment' ? 'text-pink-400 bg-white/5' : 'text-slate-500'}`}
          >
            <Pill className="w-6 h-6" />
            <span className="text-[10px] font-medium">方案</span>
          </button>

          <button 
            onClick={() => setActiveTab('pathology')}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${activeTab === 'pathology' ? 'text-violet-400 bg-white/5' : 'text-slate-500'}`}
          >
            <GitMerge className="w-6 h-6" />
            <span className="text-[10px] font-medium">闭环</span>
          </button>
        </div>
      </div>
    </div>
  );
}