import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { TEMAS_DISPONIBLES, ThemeService } from '../services/themeService';

export default function SelectorTema({ compacto = false }) {
  const [temaActual, setTemaActual] = useState(() => ThemeService.obtenerTema());

  useEffect(() => {
    ThemeService.aplicarTema(temaActual);
  }, [temaActual]);

  const cambiarTema = (id) => {
    const aplicado = ThemeService.aplicarTema(id);
    setTemaActual(aplicado);
  };

  if (compacto) {
    return (
      <div className="flex items-center gap-1.5 bg-[#121026]/90 backdrop-blur-md border border-indigo-500/35 px-2.5 py-1.5 rounded-2xl shadow-xl">
        <Palette className="w-3.5 h-3.5 text-sky-400 mr-0.5 shrink-0" />
        {TEMAS_DISPONIBLES.map((t) => {
          const activo = temaActual === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => cambiarTema(t.id)}
              title={`${t.nombre} (${t.descripcion})`}
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                activo ? 'scale-110 ring-2 ring-white' : 'opacity-75 hover:opacity-100'
              }`}
              style={{
                background: `linear-gradient(135deg, ${t.colores[0]}, ${t.colores[1]})`,
              }}
            >
              {activo && <Check className="w-3 h-3 text-white drop-shadow" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-[#100e22] border border-indigo-500/25 rounded-3xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/20 text-sky-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Apariencia de la App</h3>
            <p className="text-[11px] text-slate-400">Elige tu paleta de color favorita</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {TEMAS_DISPONIBLES.map((t) => {
          const activo = temaActual === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => cambiarTema(t.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                activo
                  ? 'border-sky-400 bg-indigo-950/60 shadow-lg'
                  : 'border-indigo-500/20 bg-[#080712]/70 hover:border-indigo-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {t.colores.map((hex, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/40"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                {activo && <Check className="w-4 h-4 text-sky-400" />}
              </div>
              <div>
                <span className="text-xs font-black text-white block">{t.nombre}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">{t.descripcion}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
