import React, { useState } from 'react';
import { ArrowLeft, Play, Edit3, Check, Plus, Trash2, Clock } from 'lucide-react';

export default function DetalleRutinaPage({ rutina, ejercicios, onActualizarRutina, onIniciarEntrenamiento, onVolver }) {
  const [editando, setEditando] = useState(false);
  const [rutinaLocal, setRutinaLocal] = useState(JSON.parse(JSON.stringify(rutina)));

  const getInfoEjercicio = (id) => ejercicios.find((e) => e.id === id) || { nombre: 'Ejercicio', musculo: 'General' };

  const handleCambioSerie = (ejIdx, sIdx, campo, valor) => {
    const copia = { ...rutinaLocal };
    copia.ejercicios[ejIdx].series[sIdx][campo] = Number(valor);
    setRutinaLocal(copia);
  };

  const handleAgregarSerie = (ejIdx) => {
    const copia = { ...rutinaLocal };
    const ultima = copia.ejercicios[ejIdx].series[copia.ejercicios[ejIdx].series.length - 1] || { peso: 20, reps: 10 };
    copia.ejercicios[ejIdx].series.push({ peso: ultima.peso, reps: ultima.reps, completada: false });
    setRutinaLocal(copia);
  };

  const handleEliminarSerie = (ejIdx, sIdx) => {
    const copia = { ...rutinaLocal };
    if (copia.ejercicios[ejIdx].series.length > 1) {
      copia.ejercicios[ejIdx].series.splice(sIdx, 1);
      setRutinaLocal(copia);
    }
  };

  const guardarCambios = () => {
    onActualizarRutina(rutinaLocal);
    setEditando(false);
  };

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto space-y-6 pb-32">
      {/* Navegación superior */}
      <div className="flex items-center justify-between">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-indigo-200 hover:text-white bg-[#121026] border border-indigo-500/25 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" /> Volver
        </button>

        <div className="flex items-center gap-2.5">
          {editando ? (
            <button
              onClick={guardarCambios}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" /> Guardar Cambios
            </button>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-2 bg-indigo-950 hover:bg-indigo-900 text-sky-300 border border-indigo-500/30 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
            >
              <Edit3 className="w-4 h-4 text-violet-400" /> Editar Series / Reps
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta Cabecera de Rutina */}
      <div className="bg-gradient-to-r from-[#171336] to-[#0f172a] border border-violet-500/30 p-6 md:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">Vista Previa de Rutina</span>
          {editando ? (
            <input
              type="text"
              value={rutinaLocal.nombre}
              onChange={(e) => setRutinaLocal({ ...rutinaLocal, nombre: e.target.value })}
              className="bg-[#090814] border border-violet-500/40 rounded-xl px-3 py-1.5 text-2xl font-black text-white w-full"
            />
          ) : (
            <h1 className="text-3xl font-black text-white">{rutinaLocal.nombre}</h1>
          )}
          <p className="text-xs text-indigo-200/70 flex items-center gap-2 pt-1">
            <Clock className="w-3.5 h-3.5 text-violet-400" /> Incluye cronómetro de sesión y reloj de descanso por serie
          </p>
        </div>

        <button
          onClick={() => onIniciarEntrenamiento(rutinaLocal)}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white px-7 py-4 rounded-2xl font-black shadow-xl shadow-violet-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" /> Empezar Rutina
        </button>
      </div>

      {/* Lista de Ejercicios Previstos */}
      <div className="space-y-5">
        {rutinaLocal.ejercicios.map((ej, ejIdx) => {
          const info = getInfoEjercicio(ej.ejercicioId);
          return (
            <div key={ejIdx} className="bg-[#100e22] border border-indigo-500/20 rounded-3xl p-5 md:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {info.imagen && (
                    <img src={info.imagen} alt={info.nombre} className="w-16 h-16 rounded-2xl object-cover border border-violet-500/30" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{info.nombre}</h3>
                    <span className="text-xs font-bold text-violet-300 bg-violet-500/15 px-2.5 py-0.5 rounded-full border border-violet-500/25">
                      {info.musculo}
                    </span>
                  </div>
                </div>

                {/* Botón rápido de iniciar desde este ejercicio */}
                <button
                  onClick={() => onIniciarEntrenamiento(rutinaLocal, ejIdx)}
                  title="Empezar desde este ejercicio"
                  className="p-3 bg-sky-500/15 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/30 rounded-2xl transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Tabla de Series */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-12 text-[11px] font-extrabold uppercase tracking-wider text-indigo-300/70 px-2">
                  <span className="col-span-3">Serie</span>
                  <span className="col-span-4 text-center">Peso (kg)</span>
                  <span className="col-span-4 text-center">Repeticiones</span>
                  <span className="col-span-1"></span>
                </div>

                {ej.series.map((s, sIdx) => (
                  <div key={sIdx} className="grid grid-cols-12 items-center gap-2 bg-[#090814]/80 border border-indigo-500/15 p-2.5 rounded-2xl">
                    <span className="col-span-3 text-xs font-black text-violet-400 pl-2">Serie {sIdx + 1}</span>
                    {editando ? (
                      <>
                        <input
                          type="number"
                          value={s.peso}
                          onChange={(e) => handleCambioSerie(ejIdx, sIdx, 'peso', e.target.value)}
                          className="col-span-4 bg-indigo-950/60 border border-violet-500/40 rounded-xl py-1.5 text-center text-white font-bold text-sm"
                        />
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => handleCambioSerie(ejIdx, sIdx, 'reps', e.target.value)}
                          className="col-span-4 bg-indigo-950/60 border border-violet-500/40 rounded-xl py-1.5 text-center text-white font-bold text-sm"
                        />
                        <button
                          onClick={() => handleEliminarSerie(ejIdx, sIdx)}
                          className="col-span-1 text-rose-400 hover:text-rose-300 flex justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="col-span-4 text-center text-sm font-bold text-white">{s.peso} kg</span>
                        <span className="col-span-4 text-center text-sm font-bold text-sky-300">{s.reps} reps</span>
                        <span className="col-span-1"></span>
                      </>
                    )}
                  </div>
                ))}

                {editando && (
                  <button
                    onClick={() => handleAgregarSerie(ejIdx)}
                    className="w-full py-2.5 mt-2 bg-indigo-950/60 hover:bg-indigo-900/70 border border-dashed border-violet-400/40 text-violet-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Añadir Serie
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
