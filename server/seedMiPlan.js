import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'airyfit_db',
  port: Number(process.env.DB_PORT) || 8889,
});

// 1. Catálogo de ejercicios de tu rutina
const ejerciciosReales = [
  { id: 'ej_patada_polea', nombre: 'Patada de mula en polea baja', grupo: 'Glúteo', equipo: 'Polea baja' },
  { id: 'ej_zancadas', nombre: 'Zancadas caminando', grupo: 'Glúteo / Pierna', equipo: 'Peso corporal / Mancuernas' },
  { id: 'ej_hip_1pie', nombre: 'Hip Thrust a 1 pie', grupo: 'Glúteo', equipo: 'Banco / Mancuerna' },
  { id: 'ej_patada_banco', nombre: 'Patada de mula recargada en banco', grupo: 'Glúteo', equipo: 'Banco / Polea o Tobillera' },
  { id: 'ej_patada_lateral', nombre: 'Patada lateral', grupo: 'Glúteo Medio', equipo: 'Polea / Banda' },
  { id: 'ej_patada_recta', nombre: 'Patada de mula postura recta parada', grupo: 'Glúteo', equipo: 'Polea / Máquina' },
  { id: 'ej_pm_mancuernas', nombre: 'Peso muerto con mancuernas (pies semi cerrados)', grupo: 'Femoral / Glúteo', equipo: 'Mancuernas' },
  { id: 'ej_femoral_acostada', nombre: 'Femoral acostada en máquina', grupo: 'Femoral', equipo: 'Máquina Curl Femoral' },
  { id: 'ej_elev_laterales', nombre: 'Elevaciones laterales de hombro (1 min sin parar)', grupo: 'Hombro', equipo: 'Mancuernas' },
  { id: 'ej_press_militar', nombre: 'Press militar con mancuernas (1 min sin parar)', grupo: 'Hombro', equipo: 'Mancuernas' },
  { id: 'ej_jalon_triangulo', nombre: 'Jalón cerrado con triángulo', grupo: 'Espalda', equipo: 'Polea alta' },
  { id: 'ej_pullover_lazo', nombre: 'Pull over con lazo en polea', grupo: 'Espalda', equipo: 'Polea alta / Lazo' },
  { id: 'ej_curl_concentrado', nombre: 'Curl de bíceps concentrado', grupo: 'Bíceps', equipo: 'Mancuerna' },
  { id: 'ej_eliptica', nombre: 'Cardiovascular en elíptica (ligera-moderada)', grupo: 'Cardio', equipo: 'Elíptica' },
  { id: 'ej_leg_extension', nombre: 'Leg Extension (Extensión de cuádriceps)', grupo: 'Cuádriceps', equipo: 'Máquina Extensiones' },
  { id: 'ej_sentadilla_libre', nombre: 'Sentadilla libre profunda (pirámide ascendente)', grupo: 'Cuádriceps', equipo: 'Barra olímpica' },
  { id: 'ej_bulgaras', nombre: 'Sentadilla Búlgara', grupo: 'Cuádriceps / Glúteo', equipo: 'Banco / Mancuernas' },
  { id: 'ej_prensa_cerrada', nombre: 'Prensa pies cerrados', grupo: 'Cuádriceps', equipo: 'Prensa 45°' },
  { id: 'ej_sentadilla_sumo_manc', nombre: 'Sentadilla sumo con mancuernas', grupo: 'Glúteo / Aductores', equipo: 'Mancuerna' },
  { id: 'ej_pantorrilla_prensa', nombre: 'Elevación de pies en prensa para pantorrilla', grupo: 'Pantorrilla', equipo: 'Prensa 45°' },
  { id: 'ej_costurera', nombre: 'Costurera (Pantorrilla sentada)', grupo: 'Pantorrilla', equipo: 'Máquina Costurera' },
  { id: 'ej_pantorrilla_hack', nombre: 'Elevación de pies en Hack', grupo: 'Pantorrilla', equipo: 'Máquina Hack' },
  { id: 'ej_pantorrilla_1pie', nombre: 'Elevación de punta a 1 pie parada con disco', grupo: 'Pantorrilla', equipo: 'Disco / Escalón' },
  { id: 'ej_hip_barra_libre', nombre: 'Hip Thrust con barra libre', grupo: 'Glúteo', equipo: 'Barra olímpica' },
  { id: 'ej_sentadilla_sumo', nombre: 'Sentadilla tipo sumo', grupo: 'Glúteo / Femoral', equipo: 'Barra / Mancuerna' },
  { id: 'ej_pm_barra', nombre: 'Peso muerto pies anchura de hombros', grupo: 'Femoral / Glúteo', equipo: 'Barra olímpica' },
  { id: 'ej_femoral_21', nombre: 'Femoral acostado (Sets de 21: rápidas, normales, lentas)', grupo: 'Femoral', equipo: 'Máquina Curl Femoral' },
  { id: 'ej_pm_1pie', nombre: 'Peso muerto a 1 pie súper lento', grupo: 'Femoral / Glúteo', equipo: 'Mancuerna' },
];

// 2. Tus 5 días de rutina estructurados
const rutinasReales = [
  {
    id: 'rut_dia1_gluteo',
    nombre: 'Día 1 • Glúteos y Femorales (Enfoque Bombeo)',
    enfoque: 'Glúteo y Femoral',
    ejercicios: [
      { id: 'ej_patada_polea', nombre: 'Calentamiento: Patada de mula en polea baja', series: [{ reps: 45, peso: 0 }, { reps: 45, peso: 0 }] },
      { id: 'ej_zancadas', nombre: 'Calentamiento: Zancadas (50 pasos)', series: [{ reps: 50, peso: 0 }] },
      { id: 'ej_hip_1pie', nombre: 'Hip Thrust a 1 pie (2x20 + 2x12)', series: [{ reps: 20, peso: 0 }, { reps: 20, peso: 0 }, { reps: 12, peso: 0 }, { reps: 12, peso: 0 }] },
      { id: 'ej_patada_banco', nombre: 'Patada de mula recargada en el banco', series: [{ reps: 15, peso: 0 }, { reps: 15, peso: 0 }, { reps: 12, peso: 0 }] },
      { id: 'ej_patada_lateral', nombre: 'Patada lateral', series: [{ reps: 15, peso: 0 }, { reps: 15, peso: 0 }, { reps: 15, peso: 0 }] },
      { id: 'ej_patada_recta', nombre: 'Patada de mula postura recta parada (35-20-12)', series: [{ reps: 35, peso: 0 }, { reps: 20, peso: 0 }, { reps: 12, peso: 0 }] },
      { id: 'ej_pm_mancuernas', nombre: 'Peso muerto con mancuernas (pies semi cerrados, puntas adentro)', series: [{ reps: 10, peso: 0 }, { reps: 10, peso: 0 }, { reps: 10, peso: 0 }, { reps: 10, peso: 0 }, { reps: 10, peso: 0 }] },
      { id: 'ej_femoral_acostada', nombre: 'Femoral acostada (12-15-20-25)', series: [{ reps: 12, peso: 0 }, { reps: 15, peso: 0 }, { reps: 20, peso: 0 }, { reps: 25, peso: 0 }] },
    ],
  },
  {
    id: 'rut_dia2_superior',
    nombre: 'Día 2 (Martes) • Tren Superior + 1h Elíptica',
    enfoque: 'Hombro, Espalda, Bíceps y Cardio',
    ejercicios: [
      { id: 'ej_elev_laterales', nombre: 'Elevaciones laterales (3 sets de 1 min sin parar)', series: [{ reps: 60, peso: 0 }, { reps: 60, peso: 0 }, { reps: 60, peso: 0 }] },
      { id: 'ej_press_militar', nombre: 'Press militar con mancuernas (3 sets de 1 min sin parar)', series: [{ reps: 60, peso: 0 }, { reps: 60, peso: 0 }, { reps: 60, peso: 0 }] },
      { id: 'ej_jalon_triangulo', nombre: 'Jalón cerrado triángulo (Biserie con Pull Over)', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_pullover_lazo', nombre: 'Pull over con lazo (Biserie)', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_curl_concentrado', nombre: 'Curl bíceps concentrado', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_eliptica', nombre: 'Cardiovascular en elíptica (60 min ligera-moderada)', series: [{ reps: 60, peso: 0 }] },
    ],
  },
  {
    id: 'rut_dia3_cuadriceps',
    nombre: 'Día 3 • Cuádriceps y Pantorrilla',
    enfoque: 'Cuádriceps y Pantorrilla',
    ejercicios: [
      { id: 'ej_leg_extension', nombre: 'Calentamiento: Leg Extension 2x100', series: [{ reps: 100, peso: 0 }, { reps: 100, peso: 0 }] },
      { id: 'ej_sentadilla_libre', nombre: 'Sentadilla libre profunda (50-40-30-20-10 subiendo peso)', series: [{ reps: 50, peso: 0 }, { reps: 40, peso: 0 }, { reps: 30, peso: 0 }, { reps: 20, peso: 0 }, { reps: 10, peso: 0 }] },
      { id: 'ej_bulgaras', nombre: 'Búlgaras', series: [{ reps: 15, peso: 0 }, { reps: 15, peso: 0 }, { reps: 15, peso: 0 }] },
      { id: 'ej_prensa_cerrada', nombre: 'Prensa pies cerrados', series: [{ reps: 35, peso: 0 }, { reps: 35, peso: 0 }, { reps: 35, peso: 0 }] },
      { id: 'ej_leg_extension', nombre: 'Leg Extension (50-15-12-10)', series: [{ reps: 50, peso: 0 }, { reps: 15, peso: 0 }, { reps: 12, peso: 0 }, { reps: 10, peso: 0 }] },
      { id: 'ej_sentadilla_sumo_manc', nombre: 'Sentadilla sumo con mancuernas', series: [{ reps: 8, peso: 0 }, { reps: 8, peso: 0 }, { reps: 8, peso: 0 }] },
      { id: 'ej_pantorrilla_prensa', nombre: 'Elevación de pies en prensa para pantorrilla', series: [{ reps: 35, peso: 0 }, { reps: 35, peso: 0 }, { reps: 35, peso: 0 }, { reps: 35, peso: 0 }, { reps: 35, peso: 0 }] },
      { id: 'ej_costurera', nombre: 'Costurera', series: [{ reps: 12, peso: 0 }, { reps: 12, peso: 0 }, { reps: 12, peso: 0 }] },
    ],
  },
  {
    id: 'rut_dia4_jueves',
    nombre: 'Día 4 (Jueves) • Tren Superior + Pantorrilla Extra',
    enfoque: 'Tren Superior y Pantorrilla',
    ejercicios: [
      { id: 'ej_elev_laterales', nombre: 'Elevaciones laterales (3 sets de 1 min sin parar)', series: [{ reps: 60, peso: 0 }, { reps: 60, peso: 0 }, { reps: 60, peso: 0 }] },
      { id: 'ej_press_militar', nombre: 'Press militar con mancuernas (3 sets de 1 min sin parar)', series: [{ reps: 60, peso: 0 }, { reps: 60, peso: 0 }, { reps: 60, peso: 0 }] },
      { id: 'ej_jalon_triangulo', nombre: 'Jalón cerrado triángulo + Pull over lazo', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_curl_concentrado', nombre: 'Curl bíceps concentrado', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_eliptica', nombre: 'Cardio elíptica (60 min)', series: [{ reps: 60, peso: 0 }] },
      { id: 'ej_pantorrilla_hack', nombre: 'Final: Elevación de pies en Hack (3x25 + 1x8)', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 8, peso: 0 }] },
      { id: 'ej_costurera', nombre: 'Final: Costurera 3x15', series: [{ reps: 15, peso: 0 }, { reps: 15, peso: 0 }, { reps: 15, peso: 0 }] },
      { id: 'ej_pantorrilla_1pie', nombre: 'Final: Elevación de punta a 1 pie parada con disco', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
    ],
  },
  {
    id: 'rut_dia5_gluteo2',
    nombre: 'Día 5 • Glúteos y Femorales (Fuerza y Control)',
    enfoque: 'Glúteo y Femoral',
    ejercicios: [
      { id: 'ej_hip_barra_libre', nombre: 'Calentamiento: Hip Thrust barra libre 1x50', series: [{ reps: 50, peso: 0 }] },
      { id: 'ej_sentadilla_sumo', nombre: 'Calentamiento: Sentadilla tipo sumo 2x25', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
      { id: 'ej_patada_polea', nombre: 'Patada de mula en polea 4x10-12', series: [{ reps: 12, peso: 0 }, { reps: 12, peso: 0 }, { reps: 10, peso: 0 }, { reps: 10, peso: 0 }] },
      { id: 'ej_bulgaras', nombre: 'Búlgaras 3x15', series: [{ reps: 15, peso: 0 }, { reps: 15, peso: 0 }, { reps: 15, peso: 0 }] },
      { id: 'ej_hip_1pie', nombre: 'Hip Thrust a 1 pie 5x12', series: [{ reps: 12, peso: 0 }, { reps: 12, peso: 0 }, { reps: 12, peso: 0 }, { reps: 12, peso: 0 }, { reps: 12, peso: 0 }] },
      { id: 'ej_pm_barra', nombre: 'Peso muerto pies anchura de hombros 3x6-8', series: [{ reps: 8, peso: 0 }, { reps: 8, peso: 0 }, { reps: 6, peso: 0 }] },
      { id: 'ej_femoral_21', nombre: 'Femoral acostado (3 sets de 21: rápidas, normales, lentas)', series: [{ reps: 21, peso: 0 }, { reps: 21, peso: 0 }, { reps: 21, peso: 0 }] },
      { id: 'ej_pm_1pie', nombre: 'Peso muerto a 1 pie 3x25 súper lentos', series: [{ reps: 25, peso: 0 }, { reps: 25, peso: 0 }, { reps: 25, peso: 0 }] },
    ],
  },
];

// 3. Tu plan de dieta exacto (5 comidas + 3.5L agua = 14 vasos + suplementos + reglas clave)
const dietaReal = {
  metaAguaVasos: 14, // 3 Litros diarios + 0.5 L en entrenamiento = 3.5 Litros (14 vasos de 250ml)
  vasosTomadosHoy: 4,
  fechaAgua: '2026-11-11',
  suplementos: [
    { id: 'sup_clem', nombre: '½ pastilla Clembuterol + 1 taza café sin azúcar', hora: '06:00 AM (Desayuno)', tomado: false },
    { id: 'sup_simi1', nombre: '1 cápsula Simi Bacilos (Toma 1)', hora: '06:00 AM (Desayuno)', tomado: false },
    { id: 'sup_simi2', nombre: '1 cápsula Simi Bacilos (Toma 2)', hora: '10:00 AM (Almuerzo)', tomado: false },
    { id: 'sup_agua_entreno', nombre: '½ Litro de agua pura durante entrenamiento', hora: 'Entrenamiento', tomado: false },
    { id: 'sup_vacio', nombre: 'Vacío Abdominal (1 hora antes de dormir)', hora: 'Antes de dormir', tomado: false },
  ],
  comidas: [
    {
      id: 'com_desayuno_06',
      nombre: 'Desayuno',
      hora: '06:00 AM',
      nota: 'REGLA: Evitar líquidos durante la comida (30 min antes o 30 min después). Incluye 1 Simi Bacilos + ½ pastilla clembuterol.',
      preparacion: 'Mezclar 1 scoop de Whey Protein con agua. Cocer ¼ taza de hojuelas de avena en agua y espolvorear canela al gusto. Acompañar con 1 taza de café sin azúcar.',
      alimentos: [
        { id: 'it_1', alimentoId: 'whey_protein', gramos: 32 }, // 1 scoop
        { id: 'it_2', alimentoId: 'avena_cocida', gramos: 60 }, // ¼ taza cocida
      ],
    },
    {
      id: 'com_almuerzo_10',
      nombre: 'Almuerzo',
      hora: '10:00 AM',
      nota: 'Proteína pesada en CRUDO (140g pollo o filete de res) • Arroz pesado en COCIDO • Tomar 1 Simi Bacilos.',
      preparacion: 'Asar 140 g de pechuga de pollo (o filete de res) a la plancha. Medir ¼ taza de arroz integral ya cocido y agregar 1 cucharada de aceite de oliva. Acompañar con 1 taza de té verde (30 min antes o después).',
      alimentos: [
        { id: 'it_3', alimentoId: 'pollo_pechuga', gramos: 140 },
        { id: 'it_4', alimentoId: 'arroz_integral', gramos: 45 }, // ¼ taza cocida
        { id: 'it_5', alimentoId: 'aceite_oliva', gramos: 14 }, // 1 cda
      ],
    },
    {
      id: 'com_comida_14',
      nombre: 'Comida',
      hora: '02:00 PM',
      nota: 'Pesar 150g de filete de res en CRUDO • Evitar líquidos durante la comida (30 min antes o después).',
      preparacion: 'Asar 150 g de filete de res con limón al gusto. Calentar 1 ½ tortillas de maíz hechas a mano al comal y servir con ½ taza de lechuga y espinaca fresca.',
      alimentos: [
        { id: 'it_6', alimentoId: 'res_filete', gramos: 150 },
        { id: 'it_7', alimentoId: 'tortilla_maiz', gramos: 45 }, // 1 ½ tortillas
        { id: 'it_8', alimentoId: 'verduras_mix', gramos: 50 }, // ½ taza lechuga y espinaca
      ],
    },
    {
      id: 'com_snack_17',
      nombre: 'Snack',
      hora: '05:00 PM',
      nota: 'Incluye 1 taza de té palo azul frío con 2 cdas de frutos rojos y 1 cdita de canela.',
      preparacion: 'Preparar 1 scoop de Whey Protein en agua. Servir 50 g de fresas/berries con 1 cucharada de yogurt griego natural. Acompañar con té palo azul frío con frutos rojos y canela.',
      alimentos: [
        { id: 'it_9', alimentoId: 'whey_protein', gramos: 32 }, // 1 scoop
        { id: 'it_10', alimentoId: 'frutos_rojos', gramos: 50 }, // 50 g fresas/berries
        { id: 'it_11', alimentoId: 'yogurt_griego', gramos: 15 }, // 1 cda
      ],
    },
    {
      id: 'com_cena_20',
      nombre: 'Cena',
      hora: '08:00 PM',
      nota: '100g pollo / tilapia / atún en CRUDO/DRENADO • Incluye 1 taza gelatina light limón + 1 Coca Zero (250ml) con agua y hielo. Hacer Vacío Abdominal 1h antes de dormir.',
      preparacion: 'Preparar 100 g de pollo, tilapia o atún a la mexicana (jitomate, cebolla, cilantro y limón). Acompañar con ½ taza de lechuga y pepino, 1 taza de gelatina light de limón y 250 ml de Coca Zero con agua y hielo.',
      alimentos: [
        { id: 'it_12', alimentoId: 'pescado_blanco', gramos: 100 }, // 100g tilapia / pollo / atún (intercambiable en 1 clic)
        { id: 'it_13', alimentoId: 'verduras_mix', gramos: 50 }, // ½ taza lechuga + pepino
      ],
    },
  ],
};

async function cargarTodoEnMySQL() {
  try {
    await pool.query(
      `INSERT INTO perfiles (id, nombre, usuario, sexo, objetivo, peso, estatura, grasa_actual, meta_calorias_diarias)
       VALUES (1, 'Atleta AiryFit', 'airyfit', 'mujer', 'Definición / Pérdida de Grasa', 60.0, 165, 21.0, 550)
       ON DUPLICATE KEY UPDATE objetivo = VALUES(objetivo)`
    );

    // Insertar ejercicios
    for (const ej of ejerciciosReales) {
      await pool.query(
        `INSERT INTO ejercicios (id, nombre, grupo, equipo, imagen)
         VALUES (?, ?, ?, ?, '')
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), grupo = VALUES(grupo), equipo = VALUES(equipo)`,
        [ej.id, ej.nombre, ej.grupo, ej.equipo]
      );
    }

    // Insertar rutinas
    for (const r of rutinasReales) {
      await pool.query(
        `INSERT INTO rutinas (id, nombre, enfoque, ejercicios_json)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), enfoque = VALUES(enfoque), ejercicios_json = VALUES(ejercicios_json)`,
        [r.id, r.nombre, r.enfoque, JSON.stringify(r.ejercicios)]
      );
    }

    // Insertar dieta completa
    await pool.query(
      `INSERT INTO planes_dieta (id, perfil_id, meta_agua_vasos, vasos_tomados_hoy, fecha_agua, suplementos_json, comidas_json)
       VALUES (1, 1, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         meta_agua_vasos = VALUES(meta_agua_vasos),
         vasos_tomados_hoy = VALUES(vasos_tomados_hoy),
         fecha_agua = VALUES(fecha_agua),
         suplementos_json = VALUES(suplementos_json),
         comidas_json = VALUES(comidas_json)`,
      [
        dietaReal.metaAguaVasos,
        dietaReal.vasosTomadosHoy,
        dietaReal.fechaAgua,
        JSON.stringify(dietaReal.suplementos),
        JSON.stringify(dietaReal.comidas),
      ]
    );

    // Insertar 30 días de racha consecutiva (del 13 Oct 2026 al 11 Nov 2026)
    const hoy = new Date(2026, 10, 11);
    for (let i = 29; i >= 0; i--) {
      const f = new Date(hoy);
      f.setDate(hoy.getDate() - i);
      const iso = f.toISOString().slice(0, 10);
      const texto = f.toLocaleDateString('es-MX');
      const diaSemana = f.getDay(); // 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie
      const rutinaDelDia =
        rutinasReales[(diaSemana >= 1 && diaSemana <= 5 ? diaSemana - 1 : 0)].nombre;

      await pool.query(
        `INSERT INTO historial_sesiones (id, rutina_nombre, fecha_texto, fecha_iso, duracion_segundos, calorias_estimadas, ejercicios_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE rutina_nombre = VALUES(rutina_nombre), fecha_iso = VALUES(fecha_iso)`,
        [`h_racha_${iso.replace(/-/g, '')}`, rutinaDelDia, texto, iso, 4200, 480, JSON.stringify([])]
      );
    }

    console.log('✅ ¡ÉXITO TOTAL! Se guardaron en MySQL (airyfit_db):');
    console.log(`   - ${ejerciciosReales.length} ejercicios personalizados`);
    console.log(`   - ${rutinasReales.length} días de rutina estructurados`);
    console.log(`   - 5 tiempos de comida + suplementos + 3.5L de agua`);
    console.log(`   - 🔥 30 días consecutivos de racha`);
  } catch (err) {
    console.error('❌ Error al conectar con MySQL (MAMP):', err.message);
  } finally {
    await pool.end();
  }
}

cargarTodoEnMySQL();
