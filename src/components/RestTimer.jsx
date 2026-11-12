import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Play, Pause, RotateCcw } from 'lucide-react';

export default function RestTimer({ onClose, tiempoInicial = 90 }) {
  const [total, setTotal] = useState(tiempoInicial);
  const [segundos, setSegundos] = useState(tiempoInicial);
  const [corriendo, setCorriendo] = useState(true);

  useEffect(() => {
    let interval = null;
    if (corriendo && segundos > 0) {
      interval = setInterval(() => setSegundos((s) => s - 1), 1000);
    } else if (segundos === 0) {
      setCorriendo(false);
    }
    return () => clearInterval(interval);
  }, [corriendo, segundos]);

  const progreso = total > 0 ? (segundos / total) * 100 : 0;
  const radio = 28;
  const circunferencia = 2 * Math.PI * radio;
  const strokeDashoffset = circunferencia - (progreso / 100) * circunferencia;

  const ajustarTiempo = (delta) => {
    const nuevo = Math.max(10, segundos + delta);
    setSegundos(nuevo);
    if (nuevo > total) setTotal(nuevo);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 bg-[#110f24]/95 border border-violet-500/40 p-4 rounded-3xl flex items-center gap-4 z-50 shadow-2xl shadow-violet-950/80 backdrop-blur-2xl">
      {/* Reloj Circular SVG */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-16 h-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radio}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-indigo-950"
          />
          <circle
            cx="32"
            cy="32"
            r={radio}
            stroke="url(#airyGradient)"
            strokeWidth="5"
            strokeDasharray={circunferencia}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="airyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute text-xs font-black font-mono text-white">
          {Math.floor(segundos / 60)}:{segundos % 60 < 10 ? '0' : ''}{segundos % 60}
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Reloj de Descanso</p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => ajustarTiempo(-15)} className="px-2 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 rounded-lg text-xs font-bold">-15s</button>
          <button onClick={() => setCorriendo(!corriendo)} className="p-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg">
            {corriendo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => { setSegundos(tiempoInicial); setTotal(tiempoInicial); setCorriendo(true); }} className="p-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 rounded-lg">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => ajustarTiempo(15)} className="px-2 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 rounded-lg text-xs font-bold">+15s</button>
        </div>
      </div>

      <button onClick={onClose} className="p-2 text-slate-400 hover:text-white self-start">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
