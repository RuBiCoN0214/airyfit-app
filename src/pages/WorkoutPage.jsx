import React, { useState, useEffect } from 'react';
import { Check, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function WorkoutPage({ rutinaActiva, ejercicios, onFinalizarEntrenamiento, onTriggerTimer, indiceInicial = 0 }) {
  const [datos, setDatos] = useState(rutinaActiva);
  const [seg, setSeg] = useState(0);
  const [ejercicioActualIdx, setEjercicioActualIdx] = useState(indiceInicial);

  useEffect(() => {
    const timer = setInterval(() => setSeg((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSerie = (ejIdx, sIdx) => {
    const copia = { ...datos };
    const actual = copia.ejercicios[ejIdx].series[sIdx].completada;
    copia.ejercicios[ejIdx].series[sIdx].completada = !actual;
    setDatos(copia);
    if (!actual) onTriggerTimer();
  };

  const agregarSerie = (ejIdx) => {
    const copia = { ...datos };
    const ultima = copia.ejercicios[ejIdx].series[copia.ejercicios[ejIdx].series.length - 1] || { peso: 0, reps: 0 };
    copia.ejercicios[ejIdx].series.push({ ...ultima, completada: false });
    setDatos(copia);
  };

  const ejActual = datos.ejercicios[ejercicioActualIdx];
  const infoActual = ejercicios.find((e) => e.id === ejActual?.ejercicioId) || { nombre: 'Ejercicio' };

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto space-y-6 pb-36">
      {/* Barra superior con reloj de sesión */}
      <div className="flex justify-between items-center bg-[#121029]/95 border border-violet-500/30 p-4 rounded-3xl sticky top-3 z-40 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-600/25 rounded-2xl text-sky-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-white">{datos.nombre}</h2>
            <p className="text-xs text-sky-400 font-mono font-bold">
              Tiempo: {Math.floor(seg / 60)}:{seg % 60 < 10 ? '0' : ''}{seg % 60}
            </p>
          </div>
        </div>
        <button
          onClick={() => onFinalizarEntrenamiento(datos, seg)}
          className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs md:text-sm shadow-lg shadow-emerald-500/20"
        >
          Terminar Rutina
        </button>
      </div>

      {/* Selector Rápido de Ejercicio (Pestañas numeradas) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {datos.ejercicios.map((item, idx) => {
          const info = ejercicios.find((e) => e.id === item.ejercicioId) || {};
          const activo = idx === ejercicioActualIdx;
          return (
            <button
              key={idx}
              onClick={() => setEjercicioActualIdx(idx)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activo
                  ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md'
                  : 'bg-[#100e22] text-indigo-300 border border-indigo-500/20'
              }`}
            >
              {idx + 1}. {info.nombre}
            </button>
          );
        })}
      </div>

      {/* Tarjeta del Ejercicio Actual */}
      {ejActual && (
        <div className="bg-[#100e22] border border-violet-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
            <div className="flex items-center gap-4">
              {infoActual.imagen && (
                <img src={infoActual.imagen} alt={infoActual.nombre} className="w-16 h-16 rounded-2xl object-cover border border-sky-400/30" />
              )}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-400">
                  Ejercicio {ejercicioActualIdx + 1} de {datos.ejercicios.length}
                </span>
                <h3 className="font-black text-white text-xl">{infoActual.nombre}</h3>
                <p className="text-xs text-indigo-300/80">{infoActual.instrucciones}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 text-[11px] font-extrabold uppercase text-indigo-300/70 text-center">
            <span className="col-span-2">Serie</span>
            <span className="col-span-4">Peso (kg)</span>
            <span className="col-span-4">Reps</span>
            <span className="col-span-2">Listo</span>
          </div>

          <div className="space-y-2.5">
            {ejActual.series.map((s, sIdx) => (
              <div
                key={sIdx}
                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-2xl border transition-all ${
                  s.completada ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-[#080712] border-indigo-500/15'
                }`}
              >
                <span className="col-span-2 text-center text-violet-400 font-black text-sm">{sIdx + 1}</span>
                <input
                  type="number"
                  value={s.peso}
                  onChange={(e) => {
                    const c = { ...datos };
                    c.ejercicios[ejercicioActualIdx].series[sIdx].peso = Number(e.target.value);
                    setDatos(c);
                  }}
                  className="col-span-4 bg-indigo-950/60 border border-indigo-500/30 rounded-xl py-2.5 text-center text-white font-bold"
                />
                <input
                  type="number"
                  value={s.reps}
                  onChange={(e) => {
                    const c = { ...datos };
                    c.ejercicios[ejercicioActualIdx].series[sIdx].reps = Number(e.target.value);
                    setDatos(c);
                  }}
                  className="col-span-4 bg-indigo-950/60 border border-indigo-500/30 rounded-xl py-2.5 text-center text-sky-300 font-bold"
                />
                <button
                  onClick={() => toggleSerie(ejercicioActualIdx, sIdx)}
                  className={`col-span-2 h-11 rounded-xl flex items-center justify-center transition-all ${
                    s.completada
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                      : 'bg-indigo-950 hover:bg-violet-600 text-indigo-300 hover:text-white'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => agregarSerie(ejercicioActualIdx)}
            className="w-full py-3 bg-indigo-950/70 hover:bg-indigo-900 text-sky-300 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 border border-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Agregar Serie Extra
          </button>

          {/* Controles Anterior / Siguiente Ejercicio */}
          <div className="flex justify-between gap-3 pt-4 border-t border-indigo-500/20">
            <button
              disabled={ejercicioActualIdx === 0}
              onClick={() => setEjercicioActualIdx((i) => Math.max(0, i - 1))}
              className="w-1/2 py-3.5 rounded-2xl bg-[#080712] disabled:opacity-30 text-indigo-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-indigo-500/25"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior Ejercicio
            </button>
            <button
              disabled={ejercicioActualIdx === datos.ejercicios.length - 1}
              onClick={() => setEjercicioActualIdx((i) => Math.min(datos.ejercicios.length - 1, i + 1))}
              className="w-1/2 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 disabled:opacity-30 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/25"
            >
              Siguiente Ejercicio <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
