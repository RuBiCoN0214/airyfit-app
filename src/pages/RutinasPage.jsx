import React from 'react';
import { Plus, Play, Dumbbell, Sparkles, ChevronRight, Layers } from 'lucide-react';

export default function RutinasPage({ rutinas, ejercicios, onVerDetalleRutina, onIniciarEntrenamiento, onIrACrearRutina, modoVista }) {
  const getNombre = (id) => ejercicios.find((e) => e.id === id)?.nombre || 'Ejercicio';
  const esMovil = modoVista === 'mobile';

  return (
    <div className={`${esMovil ? 'p-4 space-y-5 pb-28' : 'p-5 md:p-10 max-w-7xl mx-auto space-y-8 pb-32'}`}>
      {/* Banner Principal */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#161332] via-[#100e24] to-[#0b132b] border border-indigo-500/25 ${esMovil ? 'p-5' : 'p-6 md:p-8'} rounded-3xl shadow-2xl`}>
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-sky-400" /> Planificador
            </div>
            <h1 className={`${esMovil ? 'text-2xl' : 'text-3xl md:text-4xl'} font-black text-white tracking-tight`}>
              Tus Rutinas
            </h1>
            <p className="text-indigo-200/70 text-xs md:text-sm">
              Toca una rutina para ver detalles, editar series o entrenar.
            </p>
          </div>

          <button
            onClick={onIrACrearRutina}
            className={`${esMovil ? 'w-full justify-center py-3 text-xs' : 'px-6 py-3.5 text-sm'} flex items-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white rounded-2xl font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer`}
          >
            <Plus className="w-4 h-4" /> Agregar Rutina
          </button>
        </div>
      </div>

      {/* Cuadrícula de Rutinas */}
      <div className={`grid ${esMovil ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {rutinas.map((r) => (
          <div
            key={r.id}
            onClick={() => onVerDetalleRutina(r)}
            className={`group cursor-pointer bg-[#100e22]/95 hover:bg-[#15122e] border border-indigo-500/20 hover:border-violet-400/50 ${esMovil ? 'p-4' : 'p-6'} rounded-3xl flex flex-col justify-between transition-all shadow-xl`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-gradient-to-br from-violet-600/20 to-sky-500/20 border border-violet-500/30 rounded-2xl text-sky-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-950/90 text-indigo-300 border border-indigo-500/20">
                  <Layers className="w-3 h-3 text-violet-400" /> {r.ejercicios.length} ejercicios
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className={`${esMovil ? 'text-lg' : 'text-xl'} font-black text-white group-hover:text-sky-300 transition-colors`}>
                    {r.nombre}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {r.ejercicios.map((e, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-indigo-950/70 border border-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-xl"
                    >
                      {getNombre(e.ejercicioId)} • {e.series.length}x
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-indigo-500/15 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVerDetalleRutina(r);
                }}
                className="w-1/2 py-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-xs font-bold border border-indigo-500/20"
              >
                Vista Previa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIniciarEntrenamiento(r);
                }}
                className="w-1/2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-sky-500 hover:brightness-110 text-white text-xs font-black py-2.5 rounded-2xl shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Empezar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
