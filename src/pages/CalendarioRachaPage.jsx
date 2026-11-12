import React, { useState } from 'react';
import { Flame, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { getFechaLocalISO } from '../services/storage';

export default function CalendarioRachaPage({ rachaData, historial, modoVista }) {
  const esMovil = modoVista === 'mobile';
  const [fechaVista, setFechaVista] = useState(new Date());

  const year = fechaVista.getFullYear();
  const month = fechaVista.getMonth();

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const primerDiaMes = new Date(year, month, 1).getDay();
  const offsetInicio = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
  const totalDiasMes = new Date(year, month + 1, 0).getDate();

  const hoyISO = getFechaLocalISO(new Date());
  const diasSet = new Set(rachaData.diasEntrenados || []);

  const cambiarMes = (delta) => {
    setFechaVista(new Date(year, month + delta, 1));
  };

  return (
    <div className={`${esMovil ? 'p-4 space-y-5 pb-28' : 'p-5 md:p-10 max-w-5xl mx-auto space-y-8 pb-32'}`}>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#23121d] via-[#17112b] to-[#0f172a] border border-orange-500/35 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl border ${rachaData.rachaActual > 0 ? 'bg-gradient-to-tr from-orange-600/30 to-amber-500/20 border-orange-400/50 shadow-lg shadow-orange-600/25' : 'bg-slate-900 border-slate-700'}`}>
              <Flame className={`w-10 h-10 ${rachaData.rachaActual > 0 ? 'fill-orange-500 text-amber-300 animate-bounce' : 'text-slate-500'}`} />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-300 text-[10px] font-black uppercase tracking-wider">
                {rachaData.estadoTipo === 'regreso'
                  ? '🔥 ¡Qué bueno que volviste!'
                  : rachaData.rachaActual > 0
                  ? '🔥 Racha Caliente Activa'
                  : '⚡ Enciende tu Racha'}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {rachaData.rachaActual} {rachaData.rachaActual === 1 ? 'Día' : 'Días'} de Racha
              </h1>
              <p className="text-xs md:text-sm text-orange-100/80 font-medium">
                {rachaData.mensajeEstado}
              </p>
            </div>
          </div>

          <div className="bg-[#090814]/80 border border-orange-500/25 px-5 py-3.5 rounded-2xl flex items-center gap-3 self-stretch sm:self-auto">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Mejor Racha</span>
              <span className="text-lg font-black text-white">{rachaData.mejorRacha} días</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#100e22] border border-indigo-500/25 rounded-3xl p-5 md:p-7 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">
              {nombresMeses[month]} {year}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => cambiarMes(-1)} className="p-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-indigo-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setFechaVista(new Date())} className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-xs font-bold text-sky-300">
              Hoy
            </button>
            <button onClick={() => cambiarMes(1)} className="p-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-indigo-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {diasSemana.map((d) => (
            <div key={d} className="text-[11px] font-extrabold uppercase text-indigo-300/70 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {Array.from({ length: offsetInicio }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square rounded-2xl bg-transparent" />
          ))}

          {Array.from({ length: totalDiasMes }).map((_, idx) => {
            const diaNum = idx + 1;
            const fechaCelda = `${year}-${String(month + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
            const entrenoEseDia = diasSet.has(fechaCelda);
            const esHoy = fechaCelda === hoyISO;

            return (
              <div
                key={fechaCelda}
                className={`aspect-square rounded-2xl border flex flex-col items-center justify-center relative transition-all ${
                  entrenoEseDia
                    ? 'bg-gradient-to-br from-orange-500/30 via-violet-600/30 to-sky-500/20 border-orange-400/60 shadow-md shadow-orange-950/40'
                    : esHoy
                    ? 'bg-indigo-950/60 border-sky-400 text-white'
                    : 'bg-[#080712]/80 border-indigo-500/15 text-slate-400'
                }`}
              >
                <span className={`text-xs md:text-sm font-black ${entrenoEseDia || esHoy ? 'text-white' : ''}`}>
                  {diaNum}
                </span>
                {entrenoEseDia && (
                  <Flame className="w-3.5 h-3.5 md:w-4 md:h-4 fill-orange-500 text-amber-300 mt-0.5" />
                )}
                {esHoy && !entrenoEseDia && (
                  <span className="text-[8px] font-extrabold text-sky-400 uppercase mt-0.5">Hoy</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-indigo-500/15 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-orange-500 text-amber-300" /> Día con rutina iniciada/completada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-sky-400 inline-block" /> Día actual
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" /> Historial de Entrenamientos
        </h3>

        {historial.length === 0 ? (
          <div className="bg-[#100e22] border border-indigo-500/20 p-8 rounded-3xl text-center text-sm text-indigo-300/70">
            Inicia cualquier rutina hoy para marcar el día en tu calendario y encender tu flamita.
          </div>
        ) : (
          <div className="space-y-3">
            {historial.map((item) => (
              <div key={item.id} className="bg-[#100e22] border border-violet-500/25 p-5 rounded-3xl flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-emerald-500/15 rounded-2xl text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{item.rutinaNombre}</h4>
                    <p className="text-xs text-indigo-300">
                      Duración: {Math.floor(item.duracion / 60)} min {item.duracion % 60} seg • ~{item.caloriasEstimadas || Math.max(45, Math.round((item.duracion / 60) * 6.5))} kcal
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-violet-600/20 text-sky-300 border border-violet-500/30 px-3 py-1 rounded-full font-mono font-bold">
                  {item.fecha}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
