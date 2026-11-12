import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CrearRutinaPage({ ejercicios, onGuardarRutina, onIrACrearEjercicio, onCancelar }) {
  const [nombreRutina, setNombreRutina] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState([]);

  const ejerciciosFiltrados = ejercicios.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.musculo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleEjercicio = (ej) => {
    const existe = seleccionados.find((item) => item.ejercicioId === ej.id);
    if (existe) {
      setSeleccionados(seleccionados.filter((item) => item.ejercicioId !== ej.id));
    } else {
      setSeleccionados([
        ...seleccionados,
        {
          ejercicioId: ej.id,
          numSeries: 3,
          repsObjetivo: 12,
          pesoObjetivo: 20,
        },
      ]);
    }
  };

  const actualizarConfig = (ejercicioId, campo, valor) => {
    setSeleccionados(
      seleccionados.map((item) =>
        item.ejercicioId === ejercicioId ? { ...item, [campo]: Math.max(1, Number(valor)) } : item
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombreRutina.trim() || seleccionados.length === 0) return;

    const ejerciciosFormateados = seleccionados.map((item) => ({
      ejercicioId: item.ejercicioId,
      series: Array.from({ length: item.numSeries }, () => ({
        peso: item.pesoObjetivo,
        reps: item.repsObjetivo,
        completada: false,
      })),
    }));

    onGuardarRutina({
      id: 'r_' + Date.now(),
      nombre: nombreRutina,
      ejercicios: ejerciciosFormateados,
    });
  };

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancelar}
          className="flex items-center gap-2 text-indigo-200 hover:text-white bg-[#121026] border border-indigo-500/25 px-4 py-2.5 rounded-2xl text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" /> Cancelar
        </button>

        <button
          type="button"
          onClick={onIrACrearEjercicio}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Ejercicio
        </button>
      </div>

      <div className="space-y-1">
        <span className="text-xs font-extrabold uppercase tracking-widest text-violet-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Constructor de Rutina
        </span>
        <h1 className="text-3xl font-black text-white">Nueva Rutina</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de rutina */}
        <div className="bg-[#100e22] border border-indigo-500/25 p-5 rounded-3xl space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
            1. Nombre de tu Rutina
          </label>
          <input
            type="text"
            required
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
            placeholder="Ej. MARTES • Glúteo y Femoral"
            className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl p-4 text-white text-lg font-bold focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* Buscador y Selector de Ejercicios */}
        <div className="bg-[#100e22] border border-indigo-500/25 p-5 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
              2. Busca y Selecciona Ejercicios ({seleccionados.length} elegidos)
            </label>
            <button
              type="button"
              onClick={onIrACrearEjercicio}
              className="text-xs font-bold text-violet-400 hover:text-sky-300 underline text-left"
            >
              ¿No encuentras tu ejercicio? Créalo aquí →
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-indigo-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o músculo (ej. Glúteos, Press, Espalda)..."
              className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {ejerciciosFiltrados.map((ej) => {
              const estaSeleccionado = seleccionados.some((s) => s.ejercicioId === ej.id);
              return (
                <div
                  key={ej.id}
                  onClick={() => toggleEjercicio(ej)}
                  className={`cursor-pointer p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    estaSeleccionado
                      ? 'bg-gradient-to-r from-violet-600/25 to-sky-500/20 border-sky-400'
                      : 'bg-[#080712] border-indigo-500/15 hover:border-violet-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {ej.imagen && (
                      <img src={ej.imagen} alt={ej.nombre} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-white">{ej.nombre}</p>
                      <span className="text-[11px] font-semibold text-violet-300">{ej.musculo}</span>
                    </div>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${estaSeleccionado ? 'text-sky-400' : 'text-slate-700'}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuración de Series y Repeticiones de los seleccionados */}
        {seleccionados.length > 0 && (
          <div className="bg-[#100e22] border border-violet-500/30 p-5 rounded-3xl space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-violet-300 block">
              3. Configura Series, Repeticiones y Peso Inicial
            </label>

            <div className="space-y-3">
              {seleccionados.map((item) => {
                const info = ejercicios.find((e) => e.id === item.ejercicioId) || {};
                return (
                  <div
                    key={item.ejercicioId}
                    className="bg-[#080712] border border-indigo-500/20 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {info.imagen && <img src={info.imagen} alt={info.nombre} className="w-12 h-12 rounded-xl object-cover" />}
                      <div>
                        <h4 className="font-bold text-white text-sm">{info.nombre}</h4>
                        <p className="text-xs text-indigo-300">{info.musculo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">SERIES</span>
                        <input
                          type="number"
                          min="1"
                          max="15"
                          value={item.numSeries}
                          onChange={(e) => actualizarConfig(item.ejercicioId, 'numSeries', e.target.value)}
                          className="w-16 bg-indigo-950/70 border border-indigo-500/30 rounded-xl py-1.5 text-center text-white font-bold text-sm"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">REPS</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={item.repsObjetivo}
                          onChange={(e) => actualizarConfig(item.ejercicioId, 'repsObjetivo', e.target.value)}
                          className="w-16 bg-indigo-950/70 border border-indigo-500/30 rounded-xl py-1.5 text-center text-sky-300 font-bold text-sm"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 block">PESO (KG)</span>
                        <input
                          type="number"
                          min="0"
                          value={item.pesoObjetivo}
                          onChange={(e) => actualizarConfig(item.ejercicioId, 'pesoObjetivo', e.target.value)}
                          className="w-20 bg-indigo-950/70 border border-indigo-500/30 rounded-xl py-1.5 text-center text-violet-300 font-bold text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleEjercicio({ id: item.ejercicioId })}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl ml-1 mt-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!nombreRutina.trim() || seleccionados.length === 0}
          className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 disabled:opacity-40 text-white font-black py-4 rounded-2xl shadow-xl shadow-violet-600/30 transition-all cursor-pointer"
        >
          Guardar Rutina Completa
        </button>
      </form>
    </div>
  );
}
