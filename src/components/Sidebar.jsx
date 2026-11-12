import React from 'react';
import { LayoutDashboard, Dumbbell, Utensils, Calendar, User, LogOut, Sparkles, Smartphone, Monitor, Flame } from 'lucide-react';

export default function Sidebar({ onCerrarSesion, tabActiva, setTabActiva, modoVista, setModoVista, entrenamientoActivo, rachaActual = 0 }) {
  const menuItems = [
    { id: 'rutinas', label: 'Mis Rutinas', icon: LayoutDashboard },
    { id: 'ejercicios', label: 'Ejercicios', icon: Dumbbell },
    { id: 'historial', label: 'Racha y Calendario', icon: Calendar },
    { id: 'nutricion', label: 'Mi Dieta', icon: Utensils },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ];

  return (
    <>
      {modoVista === 'mobile' && (
        <div className="bg-[#0e0d1d] border-b border-indigo-500/20 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-violet-600 to-sky-500 rounded-xl">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-white via-indigo-200 to-sky-400 bg-clip-text text-transparent">
              AIRYFIT
            </span>
            <button
              onClick={() => setTabActiva('historial')}
              className="ml-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 text-xs font-black"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-400" />
              <span>{rachaActual}</span>
            </button>
          </div>
          <button
            onClick={() => setModoVista('desktop')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-[11px] font-bold text-sky-300 transition-all"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Laptop</span>
          </button>
        </div>
      )}

      <aside className={`w-72 bg-[#0b0a17]/95 backdrop-blur-2xl border-r border-indigo-500/15 p-6 flex-col justify-between min-h-screen sticky top-0 z-40 ${modoVista === 'mobile' ? 'hidden' : 'hidden md:flex'}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-3 bg-gradient-to-tr from-violet-600 via-indigo-500 to-sky-400 rounded-2xl shadow-lg shadow-violet-600/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-sky-400">
                AIRYFIT
              </span>
              <span className="text-[10px] font-extrabold text-violet-400 tracking-[0.2em] uppercase block">
                STUDIO GYM
              </span>
            </div>
          </div>

          <button
            onClick={() => setTabActiva('historial')}
            className="w-full p-3.5 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-violet-600/15 border border-orange-500/30 hover:border-orange-400 rounded-2xl flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-xl">
                <Flame className={`w-5 h-5 ${rachaActual > 0 ? 'fill-orange-500 text-orange-400 animate-pulse' : 'text-slate-400'}`} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-300">Racha Activa</p>
                <p className="text-sm font-black text-white">{rachaActual} {rachaActual === 1 ? 'día' : 'días'} en fuego</p>
              </div>
            </div>
            <span className="text-xs font-black text-orange-400">VER →</span>
          </button>

          {entrenamientoActivo && (
            <button
              onClick={() => setTabActiva('workout')}
              className="w-full p-4 bg-gradient-to-r from-violet-600/20 to-sky-500/20 border border-violet-400/40 rounded-2xl flex items-center justify-between text-sky-300 hover:border-sky-400 transition-all shadow-lg shadow-violet-950/50"
            >
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-violet-400 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">Sesión Activa</p>
                  <p className="text-xs text-white font-bold truncate max-w-[115px]">{entrenamientoActivo.nombre}</p>
                </div>
              </div>
              <span className="text-[11px] font-black bg-gradient-to-r from-violet-500 to-sky-500 text-white px-2.5 py-1 rounded-lg">
                ABRIR
              </span>
            </button>
          )}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = tabActiva === item.id || (item.id === 'rutinas' && ['detalle-rutina', 'crear-rutina'].includes(tabActiva)) || (item.id === 'ejercicios' && tabActiva === 'crear-ejercicio');
              return (
                <button
                  key={item.id}
                  onClick={() => setTabActiva(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 border border-violet-400/30'
                      : 'text-slate-400 hover:bg-indigo-950/40 hover:text-indigo-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-indigo-500/15 space-y-3">
          <button
            onClick={() => setModoVista(modoVista === 'desktop' ? 'mobile' : 'desktop')}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/25 rounded-2xl text-xs font-bold text-sky-300 transition-all cursor-pointer"
          >
            {modoVista === 'desktop' ? <Smartphone className="w-4 h-4 text-violet-400" /> : <Monitor className="w-4 h-4 text-sky-400" />}
            <span>{modoVista === 'desktop' ? 'Cambiar a Vista Celular' : 'Cambiar a Vista Laptop'}</span>
          </button>
        </div>
        {onCerrarSesion && (
        <div className="p-4 border-t border-indigo-500/20 mt-auto">
          <button
            onClick={onCerrarSesion}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      )}
    </aside>

      <nav className={`fixed bottom-0 left-0 right-0 bg-[#0b0a17]/95 backdrop-blur-2xl border-t border-indigo-500/20 px-3 py-2.5 justify-around items-center z-50 ${modoVista === 'mobile' ? 'flex max-w-[430px] mx-auto' : 'flex md:hidden'}`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = tabActiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTabActiva(item.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isSelected ? 'text-sky-400 scale-105' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-violet-400' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
