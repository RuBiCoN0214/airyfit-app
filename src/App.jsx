import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RestTimer from './components/RestTimer';
import RutinasPage from './pages/RutinasPage';
import DetalleRutinaPage from './pages/DetalleRutinaPage';
import CrearRutinaPage from './pages/CrearRutinaPage';
import CrearEjercicioPage from './pages/CrearEjercicioPage';
import EjerciciosPage from './pages/EjerciciosPage';
import WorkoutPage from './pages/WorkoutPage';
import CalendarioRachaPage from './pages/CalendarioRachaPage';
import PerfilPage from './pages/PerfilPage';
import AuthPortada from './components/AuthPortada';
import NutricionPage from './pages/NutricionPage';
import { MySQLService } from './services/mysqlSync';
import { StorageService, getFechaLocalISO } from './services/storage';

export default function App() {
  const [tabActiva, setTabActiva] = useState('rutinas');
  const [paginaAnteriorEjercicio, setPaginaAnteriorEjercicio] = useState('ejercicios');
  const [modoVista, setModoVista] = useState('desktop');
  const [rutinas, setRutinas] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [sesionActiva, setSesionActiva] = useState(() => {
    try {
      const s = sessionStorage.getItem("airyfit_sesion_actual");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [perfil, setPerfil] = useState({});
  const [rachaData, setRachaData] = useState({
    diasEntrenados: [],
    rachaActual: 0,
    mejorRacha: 0,
    mensajeEstado: '',
    estadoTipo: 'inactiva',
  });
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [entrenamientoActivo, setEntrenamientoActivo] = useState(null);
  const [indiceEjercicioInicial, setIndiceEjercicioInicial] = useState(0);
  const [mostrarTimer, setMostrarTimer] = useState(false);

  const evaluarRachaConReloj = (dataActual) => {
    const hoy = new Date();
    const hoyISO = getFechaLocalISO(hoy);

    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const ayerISO = getFechaLocalISO(ayer);

    const dias = dataActual.diasEntrenados || [];
    if (dias.length === 0) {
      return {
        ...dataActual,
        rachaActual: 0,
        estadoTipo: 'inactiva',
        mensajeEstado: '¡Inicia una rutina hoy para encender tu primera flamita!',
      };
    }

    const ultimoDia = [...dias].sort().pop();

    if (ultimoDia === hoyISO) {
      return {
        ...dataActual,
        estadoTipo: 'caliente',
        mensajeEstado: '¡Racha caliente! Ya entrenaste hoy, sigue así 🔥',
      };
    } else if (ultimoDia === ayerISO) {
      return {
        ...dataActual,
        estadoTipo: 'caliente',
        mensajeEstado: '¡Tu flamita sigue encendida! Inicia una rutina hoy para sumar otro día.',
      };
    } else {
      return {
        ...dataActual,
        rachaActual: 0,
        estadoTipo: 'inactiva',
        mensajeEstado: 'Tu racha se enfrió, ¡inicia una rutina hoy para reactivarla!',
      };
    }
  };

  useEffect(() => {
    setRutinas(StorageService.getRutinas());
    setEjercicios(StorageService.getEjercicios());
    setHistorial(StorageService.getHistorial());
    setPerfil(StorageService.getPerfil());

    const rachaGuardada = StorageService.getRachaData();
    const rachaEvaluada = evaluarRachaConReloj(rachaGuardada);
    setRachaData(rachaEvaluada);
    StorageService.saveRachaData(rachaEvaluada);
  }, []);

  const registrarActividadEnRacha = () => {
    const hoy = new Date();
    const hoyISO = getFechaLocalISO(hoy);

    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const ayerISO = getFechaLocalISO(ayer);

    const diasPrevios = rachaData.diasEntrenados || [];
    if (diasPrevios.includes(hoyISO)) return;

    const nuevosDias = [...diasPrevios, hoyISO];
    const ultimoDiaAnterior = [...diasPrevios].sort().pop();

    let nuevaRacha = 1;
    let tipo = 'caliente';
    let mensaje = '¡Flamita encendida! Has iniciado tu racha de entrenamiento 🔥';

    if (ultimoDiaAnterior === ayerISO) {
      nuevaRacha = (rachaData.rachaActual || 0) + 1;
      tipo = 'caliente';
      mensaje = `¡Imparable! Llevas ${nuevaRacha} días seguidos manteniendo tu flamita 🔥`;
    } else if (diasPrevios.length > 0) {
      nuevaRacha = 1;
      tipo = 'regreso';
      mensaje = '¡Qué bueno que volviste! Tu racha se ha reactivado hoy 🔥✨';
    }

    const nuevaMejor = Math.max(rachaData.mejorRacha || 0, nuevaRacha);
    const actualizada = {
      diasEntrenados: nuevosDias,
      rachaActual: nuevaRacha,
      mejorRacha: nuevaMejor,
      estadoTipo: tipo,
      mensajeEstado: mensaje,
    };

    setRachaData(actualizada);
    StorageService.saveRachaData(actualizada);
  };

  const handleVerDetalleRutina = (rutina) => {
    setRutinaSeleccionada(rutina);
    setTabActiva('detalle-rutina');
  };

  const handleActualizarRutina = (rutinaEditada) => {
    const nuevas = rutinas.map((r) => (r.id === rutinaEditada.id ? rutinaEditada : r));
    setRutinas(nuevas);
    setRutinaSeleccionada(rutinaEditada);
    StorageService.saveRutinas(nuevas);
  };

  
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/ejercicios").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("http://localhost:3001/api/rutinas").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("http://localhost:3001/api/historial").then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([ejsDB, rutsDB, histDB]) => {
      if (Array.isArray(ejsDB) && ejsDB.length > 0) setEjercicios(ejsDB);
      if (Array.isArray(rutsDB) && rutsDB.length > 0) setRutinas(rutsDB);
      if (Array.isArray(histDB) && histDB.length > 0) setHistorial(histDB);
    });
  }, []);

  const handleGuardarPerfil = (perfilActualizado) => {
    setPerfil(perfilActualizado);
    StorageService.savePerfil(perfilActualizado);
    MySQLService.guardarPerfil(perfilActualizado, sesionActiva?.id || 1);
  };

  const handleIniciarEntrenamiento = (rutina, indiceInicio = 0) => {
    registrarActividadEnRacha();
    const copia = JSON.parse(JSON.stringify(rutina));
    setEntrenamientoActivo(copia);
    setIndiceEjercicioInicial(indiceInicio);
    setTabActiva('workout');
  };

  const handleFinalizarEntrenamiento = (workoutFinalizado, tiempoSegundos) => {
    const hoy = new Date();
    const factorPeso = (Number(perfil.peso) || 60) / 60;
    const caloriasEstimadas = Math.max(35, Math.round((tiempoSegundos / 60) * 6.5 * factorPeso));

    const nuevaSesion = {
      id: 'h_' + Date.now(),
      rutinaNombre: workoutFinalizado.nombre,
      fecha: hoy.toLocaleDateString(),
      fechaISO: getFechaLocalISO(hoy),
      duracion: tiempoSegundos,
      caloriasEstimadas,
      ejercicios: workoutFinalizado.ejercicios,
    };
    const nuevoHistorial = [nuevaSesion, ...historial];
    setHistorial(nuevoHistorial);
    StorageService.saveHistorial(nuevoHistorial);
    setEntrenamientoActivo(null);
    setTabActiva('historial');
  };

  const handleGuardarRutina = (nuevaRutina) => {
    const actualizadas = [...rutinas, nuevaRutina];
    setRutinas(actualizadas);
    StorageService.saveRutinas(actualizadas);
    setTabActiva('rutinas');
  };

  const handleGuardarEjercicio = (nuevoEjercicio) => {
    const actualizados = [nuevoEjercicio, ...ejercicios];
    setEjercicios(actualizados);
    StorageService.saveEjercicios(actualizados);
    setTabActiva(paginaAnteriorEjercicio);
  };

  const esMovil = modoVista === 'mobile';

  
  const handleCerrarSesion = () => {
    setSesionActiva(null);
    try { sessionStorage.removeItem("airyfit_sesion_actual"); } catch {}
  };

  const handleAutenticado = async (cuenta) => {
    setSesionActiva(cuenta);
    try { sessionStorage.setItem("airyfit_sesion_actual", JSON.stringify(cuenta)); } catch {}
    const uid = cuenta?.id || 1;
    const perfilDB = await MySQLService.obtenerPerfil(uid);
    if (perfilDB) {
      setPerfil(perfilDB);
    } else if (cuenta?.nombre) {
      const nuevoPerf = { ...perfil, nombre: cuenta.nombre, usuario: cuenta.usuario || perfil.usuario, foto: "" };
      setPerfil(nuevoPerf);
    }
    const rutsDB = await fetch(`http://localhost:3001/api/rutinas/${uid}`).then(r => r.ok ? r.json() : []).catch(() => []);
    setRutinas(Array.isArray(rutsDB) ? rutsDB : []);
    const histDB = await fetch(`http://localhost:3001/api/historial/${uid}`).then(r => r.ok ? r.json() : []).catch(() => []);
    setHistorial(Array.isArray(histDB) ? histDB : []);
  };

  if (!sesionActiva) {
    return <AuthPortada onAutenticado={handleAutenticado} perfilActual={perfil} modoVista={modoVista} onCambiarModoVista={setModoVista} />;
  }

  return (
    <div className={`min-h-screen bg-[#07070e] text-slate-100 flex justify-center ${esMovil ? 'py-0 sm:py-6 bg-[#040409]' : ''}`}>
      <div
        className={`flex w-full transition-all duration-300 ${
          esMovil
            ? 'max-w-[430px] min-h-screen sm:min-h-[840px] sm:rounded-[2.5rem] overflow-hidden border border-indigo-500/35 shadow-2xl shadow-violet-950/60 flex-col bg-[#07070e]'
            : 'flex-col md:flex-row min-h-screen'
        }`}
      >
        <Sidebar
        onCerrarSesion={handleCerrarSesion}
          tabActiva={tabActiva}
          setTabActiva={setTabActiva}
          modoVista={modoVista}
              onCerrarSesion={handleCerrarSesion}
          setModoVista={setModoVista}
          entrenamientoActivo={entrenamientoActivo}
          rachaActual={rachaData.rachaActual}
        />

        <main className="flex-1 overflow-y-auto">
          {tabActiva === 'rutinas' && (
            <RutinasPage
              rutinas={rutinas}
              ejercicios={ejercicios}
              modoVista={modoVista}
              onVerDetalleRutina={handleVerDetalleRutina}
              onIniciarEntrenamiento={handleIniciarEntrenamiento}
              onIrACrearRutina={() => setTabActiva('crear-rutina')}
            />
          )}

          {tabActiva === 'detalle-rutina' && rutinaSeleccionada && (
            <DetalleRutinaPage
              rutina={rutinaSeleccionada}
              ejercicios={ejercicios}
              onActualizarRutina={handleActualizarRutina}
              onIniciarEntrenamiento={handleIniciarEntrenamiento}
              onVolver={() => setTabActiva('rutinas')}
            />
          )}

          {tabActiva === 'crear-rutina' && (
            <CrearRutinaPage
              ejercicios={ejercicios}
              onGuardarRutina={handleGuardarRutina}
              onIrACrearEjercicio={() => {
                setPaginaAnteriorEjercicio('crear-rutina');
                setTabActiva('crear-ejercicio');
              }}
              onCancelar={() => setTabActiva('rutinas')}
            />
          )}

          {tabActiva === 'crear-ejercicio' && (
            <CrearEjercicioPage
              onGuardarEjercicio={handleGuardarEjercicio}
              onVolver={() => setTabActiva(paginaAnteriorEjercicio)}
            />
          )}

          {tabActiva === 'ejercicios' && (
            <EjerciciosPage
              ejercicios={ejercicios}
              modoVista={modoVista}
              onIrACrearEjercicio={() => {
                setPaginaAnteriorEjercicio('ejercicios');
                setTabActiva('crear-ejercicio');
              }}
            />
          )}

          {tabActiva === 'workout' && entrenamientoActivo && (
            <WorkoutPage
              rutinaActiva={entrenamientoActivo}
              ejercicios={ejercicios}
              indiceInicial={indiceEjercicioInicial}
              onFinalizarEntrenamiento={handleFinalizarEntrenamiento}
              onTriggerTimer={() => setMostrarTimer(true)}
            />
          )}

          {tabActiva === 'historial' && (
            <CalendarioRachaPage
              rachaData={rachaData}
              historial={historial}
              modoVista={modoVista}
            />
          )}

          {tabActiva === 'nutricion' && (
            <NutricionPage perfil={perfil} modoVista={modoVista} userId={sesionActiva?.id || 1} />
          )}

          {tabActiva === 'perfil' && (
            <PerfilPage
              perfil={perfil}
              onGuardarPerfil={handleGuardarPerfil}
              historial={historial}
              rachaData={rachaData}
              modoVista={modoVista}
             onCerrarSesion={handleCerrarSesion} />
          )}
        </main>

        {mostrarTimer && <RestTimer onClose={() => setMostrarTimer(false)} />}
      </div>
    </div>
  );
}
