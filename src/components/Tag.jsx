import React from 'react';

const styles = {
  胃部: 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
  鼻炎: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  行为: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  按需: 'bg-slate-700/50 text-slate-400 border-slate-600',
};

export default function Tag({ type }) {
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border backdrop-blur-sm ${styles[type] || 'bg-slate-800 text-slate-400'}`}>
      {type}
    </span>
  );
}
