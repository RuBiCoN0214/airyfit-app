const STORAGE_KEYS = {
  RUTINAS: 'airyfit_v3_rutinas',
  EJERCICIOS: 'airyfit_v3_ejercicios',
  HISTORIAL: 'airyfit_v3_historial',
  PERFIL: 'airyfit_v3_perfil',
  RACHA: 'airyfit_v3_racha',
};

const DEFAULT_EJERCICIOS = [
  { 
    id: '1', 
    nombre: 'Curl de Bíceps con Mancuernas', 
    musculo: 'Bíceps', 
    equipo: 'Mancuerna',
    imagen: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Mantén los codos pegados al torso, eleva la mancuerna contrayendo el bíceps sin balancear la espalda.'
  },
  { 
    id: '2', 
    nombre: 'Empuje de Cadera (Hip Thrust)', 
    musculo: 'Glúteos', 
    equipo: 'Barra',
    imagen: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Apoya las escápulas en el banco, empuja con la fuerza de los talones y aprieta los glúteos arriba.'
  },
  { 
    id: '3', 
    nombre: 'Arnold Press', 
    musculo: 'Hombros', 
    equipo: 'Mancuerna',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Comienza con las palmas mirando a tu pecho y gira los hombros progresivamente al subir.'
  },
  { 
    id: '4', 
    nombre: 'Jalón al Pecho en Polea', 
    musculo: 'Espalda', 
    equipo: 'Polea',
    imagen: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Lleva la barra hacia la clavícula contrayendo los dorsales y saca el pecho.'
  },
  { 
    id: '5', 
    nombre: 'Press de Banca Plano', 
    musculo: 'Pecho', 
    equipo: 'Barra',
    imagen: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Baja la barra controladamente hasta el centro del pecho y empuja de forma explosiva.'
  },
  { 
    id: '6', 
    nombre: 'Sentadilla Búlgara', 
    musculo: 'Cuádriceps', 
    equipo: 'Mancuerna',
    imagen: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    instrucciones: 'Apoya el empeine trasero en un banco y desciende verticalmente manteniendo el torso firme.'
  }
];

const DEFAULT_RUTINAS = [
  {
    id: 'r1',
    nombre: 'LUNES • Glúteo & Pierna',
    ejercicios: [
      { ejercicioId: '2', series: [{ peso: 60, reps: 10, completada: false }, { peso: 65, reps: 10, completada: false }, { peso: 70, reps: 8, completada: false }] },
      { ejercicioId: '6', series: [{ peso: 16, reps: 12, completada: false }, { peso: 16, reps: 12, completada: false }] }
    ]
  },
  {
    id: 'r2',
    nombre: 'MARTES • Torso Push',
    ejercicios: [
      { ejercicioId: '5', series: [{ peso: 40, reps: 10, completada: false }, { peso: 45, reps: 8, completada: false }] },
      { ejercicioId: '3', series: [{ peso: 14, reps: 12, completada: false }, { peso: 14, reps: 12, completada: false }] }
    ]
  },
  {
    id: 'r3',
    nombre: 'VIERNES • Espalda & Bíceps',
    ejercicios: [
      { ejercicioId: '4', series: [{ peso: 45, reps: 12, completada: false }, { peso: 50, reps: 10, completada: false }] },
      { ejercicioId: '1', series: [{ peso: 12, reps: 12, completada: false }, { peso: 12, reps: 12, completada: false }] }
    ]
  }
];

const DEFAULT_PERFIL = {
  nombre: 'Rubí Aguilar',
  usuario: 'r_aaggg',
  bio: 'Construyendo fuerza y estética en AiryFit 💜⚡',
  sexo: 'mujer',
  edad: 24,
  peso: 58,
  estatura: 164,
  grasaActual: 22,
  objetivo: 'Recomposición Corporal',
  metaCaloriasDiarias: 450,
  caloriasExtraHoy: 0,
  unidadPeso: 'kg',
  unidadMedida: 'cm',
  foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
};

// Obtener fecha local en formato YYYY-MM-DD según el reloj del dispositivo
export const getFechaLocalISO = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const StorageService = {
  getRutinas: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.RUTINAS)) || DEFAULT_RUTINAS,
  saveRutinas: (rutinas) => localStorage.setItem(STORAGE_KEYS.RUTINAS, JSON.stringify(rutinas)),
  getEjercicios: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EJERCICIOS)) || DEFAULT_EJERCICIOS,
  saveEjercicios: (ejercicios) => localStorage.setItem(STORAGE_KEYS.EJERCICIOS, JSON.stringify(ejercicios)),
  getHistorial: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORIAL)) || [],
  saveHistorial: (historial) => localStorage.setItem(STORAGE_KEYS.HISTORIAL, JSON.stringify(historial)),
  getPerfil: () => ({ ...DEFAULT_PERFIL, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.PERFIL)) || {}) }),
  savePerfil: (perfil) => localStorage.setItem(STORAGE_KEYS.PERFIL, JSON.stringify(perfil)),
  getRachaData: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.RACHA)) || {
      diasEntrenados: [], // Array de strings 'YYYY-MM-DD'
      rachaActual: 0,
      mejorRacha: 0,
      mensajeEstado: '¡Inicia una rutina hoy para encender tu primera flamita!',
      estadoTipo: 'inactiva', // 'inactiva' | 'caliente' | 'regreso'
    },
  saveRachaData: (data) => localStorage.setItem(STORAGE_KEYS.RACHA, JSON.stringify(data)),
};
