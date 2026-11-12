import SelectorTema from "./SelectorTema";
import React, { useState } from 'react';
import {
  Dumbbell, Sparkles, Mail, Lock, User, ArrowRight,
  KeyRound, CheckCircle2, Eye, EyeOff, Flame, Activity,
  Loader2, Smartphone, Monitor
} from 'lucide-react';

const API_AUTH = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth`;

export default function AuthPortada({ onAutenticado, modoVista = 'desktop', onCambiarModoVista }) {
  const [vista, setVista] = useState('login'); // 'login' | 'registro' | 'recuperar'
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const esSimuladorMovil = modoVista === 'mobile';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador: correo, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas.');
        setCargando(false);
        return;
      }

      onAutenticado(data);
    } catch (_) {
      setError('No se pudo conectar con el servidor. Verifica que MAMP y node server/index.js estén encendidos.');
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim() || !correo.trim() || password.length < 3) {
      setError('Completa tu nombre, correo y una contraseña de al menos 3 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_AUTH}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, correo, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo crear la cuenta.');
        setCargando(false);
        return;
      }

      onAutenticado(data);
    } catch (_) {
      setError('Error de conexión al registrar la cuenta.');
    } finally {
      setCargando(false);
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');
    if (nuevaPassword.length < 3) {
      setError('La nueva contraseña debe tener al menos 3 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_AUTH}/recuperar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, nuevaPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No se pudo actualizar la contraseña.');
        setCargando(false);
        return;
      }

      setMensajeExito('¡Contraseña actualizada! Ya puedes iniciar sesión.');
      setPassword('');
      setNuevaPassword('');
      setTimeout(() => {
        setMensajeExito('');
        setVista('login');
      }, 1800);
    } catch (_) {
      setError('Error de conexión al actualizar la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  const contenidoPortada = (
    <div
      className={`w-full bg-[#070612] text-white relative overflow-x-hidden overflow-y-auto flex flex-col justify-center ${
        esSimuladorMovil ? 'min-h-full px-4 py-6' : 'min-h-[100dvh] px-4 py-8 sm:p-6 md:p-8'
      }`}
    >
      {/* FONDO CON MOVIMIENTO */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-violet-600/35 blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 -right-20 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-sky-500/25 blur-3xl animate-bounce"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute -bottom-24 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #818cf8 1px, transparent 1px), linear-gradient(to bottom, #818cf8 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full mx-auto ${
          esSimuladorMovil
            ? 'flex flex-col gap-5'
            : 'max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center'
        }`}
      >
        {/* CABECERA / PORTADA HERO */}
        <div className={`${esSimuladorMovil ? 'space-y-3 text-center' : 'lg:col-span-6 space-y-3.5 sm:space-y-5 text-center lg:text-left'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-sky-400/35 text-sky-300 text-[10px] font-extrabold tracking-wider uppercase shadow-lg">
            <Sparkles className="w-3 h-3 text-violet-400 animate-spin" style={{ animationDuration: '8s' }} />
            AiryFit • Tu Entrenamiento Sin Límites
          </div>

          <div className="space-y-2">
            <div className={`flex items-center justify-center ${esSimuladorMovil ? '' : 'lg:justify-start'} gap-2.5`}>
              <div className={`${esSimuladorMovil ? 'w-11 h-11' : 'w-11 h-11 sm:w-14 sm:h-14'} rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-xl shadow-violet-600/40 animate-pulse shrink-0`}>
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h1 className={`${esSimuladorMovil ? 'text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-black tracking-tight bg-gradient-to-r from-white via-sky-200 to-violet-300 bg-clip-text text-transparent`}>
                AIRYFIT
              </h1>
            </div>

            <p className={`${esSimuladorMovil ? 'text-base' : 'text-base sm:text-lg md:text-xl'} font-bold text-indigo-100 leading-snug`}>
              Tu físico, tus reglas, tu progreso.
            </p>
            <p className={`${esSimuladorMovil ? 'text-[11px]' : 'text-[11px] sm:text-xs md:text-sm'} text-slate-400 max-w-md mx-auto ${esSimuladorMovil ? '' : 'lg:mx-0'} leading-relaxed`}>
              Diseña tus rutinas, calcula tus equivalencias nutricionales y lleva tu control deportivo al siguiente nivel. Todo lo que necesitas para entrenar con libertad y constancia, en un solo lugar.
            </p>
          </div>

          {/* Tarjetas compactas */}
          <div className={`grid grid-cols-2 gap-2.5 max-w-md mx-auto ${esSimuladorMovil ? '' : 'lg:mx-0'}`}>
            <div className="bg-[#110e26]/85 backdrop-blur-md border border-violet-500/30 p-2.5 rounded-2xl flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">100% Libre</span>
                <span className="text-[11px] font-black text-white block truncate">Entrena a tu ritmo</span>
              </div>
            </div>

            <div className="bg-[#110e26]/85 backdrop-blur-md border border-sky-500/30 p-2.5 rounded-2xl flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Progreso Real</span>
                <span className="text-[11px] font-black text-sky-300 block truncate">Dieta y Rutinas</span>
              </div>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE ACCESO */}
        <div className={`${esSimuladorMovil ? 'w-full' : 'lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none'}`}>
          <div className={`bg-[#100e22]/90 backdrop-blur-xl border border-violet-500/35 rounded-3xl ${esSimuladorMovil ? 'p-4' : 'p-5 sm:p-6 md:p-8'} shadow-2xl space-y-4`}>
            {vista !== 'recuperar' && (
              <div className="grid grid-cols-2 gap-1.5 bg-[#080712] p-1.5 rounded-2xl border border-indigo-500/25">
                <button
                  type="button"
                  onClick={() => { setVista('login'); setError(''); }}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    vista === 'login'
                      ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => { setVista('registro'); setError(''); }}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    vista === 'registro'
                      ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs font-semibold p-3 rounded-2xl">
                {error}
              </div>
            )}

            {mensajeExito && (
              <div className="bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs font-semibold p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {mensajeExito}
              </div>
            )}

            {vista === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <h2 className="text-lg font-black text-white">Iniciar Sesión</h2>
                  <p className="text-[11px] text-slate-400">Ingresa con tu correo electrónico y contraseña</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Correo o Usuario</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="atleta@airyfit.com"
                        className="w-full bg-[#080712] border border-indigo-500/30 focus:border-sky-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-indigo-300">Contraseña</label>
                      <button
                        type="button"
                        onClick={() => { setVista('recuperar'); setError(''); }}
                        className="text-[11px] font-bold text-sky-400 hover:text-sky-300 cursor-pointer"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={mostrarPass ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#080712] border border-indigo-500/30 focus:border-sky-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarPass(!mostrarPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {mostrarPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-black py-3 rounded-2xl text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                >
                  {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Entrar a mi Cuenta <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {vista === 'registro' && (
              <form onSubmit={handleRegistro} className="space-y-3.5">
                <div>
                  <h2 className="text-lg font-black text-white">Crear Cuenta Nueva</h2>
                  <p className="text-[11px] text-slate-400">Crea tu espacio personal y empieza hoy mismo</p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Nombre Completo</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Nombre de Usuario (Opcional)</label>
                    <input
                      type="text"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      placeholder="ej. valeria_fit"
                      className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={mostrarPass ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Crea tu contraseña"
                        className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:brightness-110 text-slate-950 font-black py-3 rounded-2xl text-xs shadow-lg cursor-pointer"
                >
                  {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Comenzar mi Entrenamiento <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {vista === 'recuperar' && (
              <form onSubmit={handleRecuperar} className="space-y-3.5">
                <div className="flex items-center gap-2 text-sky-400">
                  <KeyRound className="w-5 h-5" />
                  <h2 className="text-lg font-black text-white">Restablecer Contraseña</h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ingresa el correo registrado de tu cuenta para actualizar tu contraseña.
                </p>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-indigo-300 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-sky-300 block mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      placeholder="Escribe tu nueva contraseña"
                      className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setVista('login'); setError(''); }}
                    className="flex-1 bg-indigo-950 text-indigo-200 font-bold py-3 rounded-2xl text-xs cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={cargando}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-sky-500 text-white font-black py-3 rounded-2xl text-xs cursor-pointer"
                  >
                    Guardar Nueva Clave
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#04030a] relative">
      {/* INTERRUPTOR FLOTANTE MODO TELÉFONO / COMPUTADORA EN PORTADA */}
      <div className="fixed top-4 left-4 z-50"><SelectorTema compacto /></div>
      {onCambiarModoVista && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-[#121026]/90 backdrop-blur-md border border-indigo-500/35 p-1 rounded-2xl shadow-2xl">
          <button
            type="button"
            onClick={() => onCambiarModoVista('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              !esSimuladorMovil
                ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Computadora
          </button>
          <button
            type="button"
            onClick={() => onCambiarModoVista('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              esSimuladorMovil
                ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Teléfono
          </button>
        </div>
      )}

      {esSimuladorMovil ? (
        <div className="min-h-screen flex items-center justify-center p-4 pt-16 bg-gradient-to-b from-[#070614] via-[#0c0a20] to-[#05040c]">
          <div className="w-[395px] max-w-full h-[812px] max-h-[88vh] rounded-[3rem] border-[6px] border-indigo-950/90 shadow-[0_0_60px_rgba(99,102,241,0.3)] overflow-hidden flex flex-col bg-[#070612] relative">
            {/* Barra superior simulador teléfono */}
            <div className="bg-[#0b091c] px-5 py-2 flex items-center justify-between border-b border-indigo-500/20 shrink-0">
              <span className="text-[10px] font-black text-sky-400 tracking-wider uppercase">AiryFit Mobile</span>
              <div className="w-16 h-3.5 bg-black rounded-full border border-indigo-500/20" />
              <span className="text-[10px] font-bold text-slate-400">5G</span>
            </div>
            <div className="flex-1 overflow-y-auto">{contenidoPortada}</div>
          </div>
        </div>
      ) : (
        contenidoPortada
      )}
    </div>
  );
}
