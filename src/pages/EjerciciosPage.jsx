import React, { useState } from 'react';
import { Search, Plus, Dumbbell, Sparkles } from 'lucide-react';

export default function EjerciciosPage({ ejercicios, onIrACrearEjercicio, modoVista }) {
  const [busqueda, setBusqueda] = useState('');
  const [grupoFiltro, setGrupoFiltro] = useState('Todos');

  const esMovil = modoVista === 'mobile';
  const grupos = ['Todos', ...new Set(ejercicios.map((e) => e.grupo))];

  const filtrados = ejercicios.filter((ej) => {
    const coincideTexto = ej.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideGrupo = grupoFiltro === 'Todos' || ej.grupo === grupoFiltro;
    return coincideTexto && coincideGrupo;
  });

  return (
    <div className={`${esMovil ? 'p-4 space-y-4 pb-28' : 'p-5 md:p-10 max-w-6xl mx-auto space-y-6 pb-32'}`}>
      {/* Cabecera */}
      <div className={`flex ${esMovil ? 'flex-col gap-3' : 'flex-col sm:flex-row sm:items-center justify-between gap-4'}`}>
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-sky-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Catálogo Completo
          </span>
          <h2 className={`${esMovil ? 'text-2xl' : 'text-2xl md:text-3xl'} font-black text-white mt-0.5`}>
            Biblioteca de Ejercicios
          </h2>
          <p className="text-xs text-indigo-300/80 mt-0.5">
            {ejercicios.length} ejercicios disponibles para tus rutinas
          </p>
        </div>

        <button
          onClick={onIrACrearEjercicio}
          className={`${esMovil ? 'w-full justify-center py-3' : 'px-5 py-3'} flex items-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-black rounded-2xl text-xs shadow-lg shadow-violet-600/25 transition-all cursor-pointer`}
        >
          <Plus className="w-4 h-4" /> Nuevo Ejercicio
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ejercicio por nombre..."
            className="w-full bg-[#100e22] border border-indigo-500/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-indigo-300/40 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {grupos.map((g) => (
            <button
              key={g}
              onClick={() => setGrupoFiltro(g)}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                grupoFiltro === g
                  ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md shadow-violet-600/25'
                  : 'bg-[#100e22] text-indigo-300 border border-indigo-500/25 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Listado Adaptativo: Lista horizontal limpia en Móvil / Grid en Computadora */}
      {filtrados.length === 0 ? (
        <div className="bg-[#100e22] border border-indigo-500/20 rounded-3xl p-10 text-center space-y-2">
          <Dumbbell className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
          <p className="text-sm font-bold text-white">No se encontraron ejercicios</p>
          <p className="text-xs text-slate-400">Prueba con otro nombre o crea uno personalizado.</p>
        </div>
      ) : esMovil ? (
        /* VISTA MÓVIL OPTIMIZADA (Tarjetas tipo fila con miniatura nítida) */
        <div className="space-y-2.5">
          {filtrados.map((ej) => (
            <div
              key={ej.id}
              className="flex items-center gap-3.5 bg-[#100e22] border border-indigo-500/25 rounded-2xl p-2.5 shadow-md"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#080712] border border-indigo-500/20 shrink-0 flex items-center justify-center">
                {ej.imagen ? (
                  <img
                    src={ej.imagen}
                    alt={ej.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Dumbbell className="w-6 h-6 text-indigo-400/50" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {ej.grupo}
                  </span>
                  {ej.equipo && (
                    <span className="text-[10px] font-semibold text-sky-300/80 bg-sky-500/10 px-2 py-0.5 rounded-md">
                      {ej.equipo}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                  {ej.nombre}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VISTA COMPUTADORA (Cuadrícula amplia de tarjetas) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map((ej) => (
            <div
              key={ej.id}
              className="bg-[#100e22] border border-indigo-500/25 hover:border-sky-400/50 rounded-3xl overflow-hidden shadow-xl transition-all group flex flex-col"
            >
              <div className="h-48 bg-[#080712] relative overflow-hidden flex items-center justify-center">
                {ej.imagen ? (
                  <img
                    src={ej.imagen}
                    alt={ej.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Dumbbell className="w-10 h-10 text-indigo-400/40" />
                )}
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#090814]/85 backdrop-blur-md text-sky-300 border border-sky-400/30">
                  {ej.grupo}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="text-base font-black text-white leading-snug">{ej.nombre}</h3>
                {ej.equipo && (
                  <p className="text-xs font-semibold text-indigo-300/75">Equipo: {ej.equipo}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
