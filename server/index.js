import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'airyfit_db',
  port: Number(process.env.DB_PORT) || 8889,
  waitForConnections: true,
  connectionLimit: 10,
});

const hashPassword = (pass) =>
  crypto.createHash('sha256').update(String(pass)).digest('hex');

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ conectado: true, db: 'airyfit_db', status: rows[0].ok });
  } catch (err) {
    res.status(500).json({ conectado: false, error: err.message });
  }
});

// --- AUTENTICACIÓN MULTI-USUARIO ---
app.post('/api/auth/registro', async (req, res) => {
  const { nombre, usuario, correo, password } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  const correoLimpio = correo.trim().toLowerCase();
  const usuarioLimpio = (usuario || nombre.split(' ')[0]).trim().toLowerCase().replace(/\s+/g, '');

  try {
    const [existentes] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correoLimpio]);
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'Ese correo electrónico ya está registrado.' });
    }

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, usuario, correo, password_hash) VALUES (?, ?, ?, ?)',
      [nombre.trim(), usuarioLimpio, correoLimpio, hashPassword(password)]
    );

    const nuevoId = result.insertId;

    // Crear su ficha de perfil inicial aislada
    await pool.query(
      `INSERT INTO perfiles (id, nombre, usuario, sexo, objetivo, peso, estatura, grasa_actual, meta_calorias_diarias, foto)
       VALUES (?, ?, ?, 'mujer', 'Recomposición Corporal', 60.0, 165, 22.0, 450, '')`,
      [nuevoId, nombre.trim(), usuarioLimpio]
    );

    res.json({
      id: nuevoId,
      nombre: nombre.trim(),
      usuario: usuarioLimpio,
      correo: correoLimpio,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identificador, password } = req.body;
  const idLimpio = (identificador || '').trim().toLowerCase();

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE LOWER(correo) = ? OR LOWER(usuario) = ? LIMIT 1',
      [idLimpio, idLimpio]
    );

    if (rows.length === 0 || rows[0].password_hash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Correo/usuario o contraseña incorrectos.' });
    }

    const u = rows[0];
    res.json({
      id: u.id,
      nombre: u.nombre,
      usuario: u.usuario,
      correo: u.correo,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/recuperar', async (req, res) => {
  const { correo, nuevaPassword } = req.body;
  const correoLimpio = (correo || '').trim().toLowerCase();

  try {
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE correo = ?', [correoLimpio]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No existe una cuenta con ese correo.' });
    }

    await pool.query('UPDATE usuarios SET password_hash = ? WHERE id = ?', [
      hashPassword(nuevaPassword),
      rows[0].id,
    ]);
    res.json({ actualizado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PERFIL AISLADO POR USUARIO ---
app.get('/api/perfil/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  try {
    const [rows] = await pool.query('SELECT * FROM perfiles WHERE id = ?', [userId]);
    if (rows.length === 0) return res.json(null);
    const p = rows[0];
    res.json({
      nombre: p.nombre,
      usuario: p.usuario,
      sexo: p.sexo,
      objetivo: p.objetivo,
      peso: Number(p.peso),
      estatura: Number(p.estatura),
      grasaActual: Number(p.grasa_actual),
      metaCaloriasDiarias: Number(p.meta_calorias_diarias),
      foto: p.foto || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/perfil/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  const p = req.body;
  try {
    await pool.query(
      `INSERT INTO perfiles (id, nombre, usuario, sexo, objetivo, peso, estatura, grasa_actual, meta_calorias_diarias, foto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         nombre = VALUES(nombre), usuario = VALUES(usuario), sexo = VALUES(sexo),
         objetivo = VALUES(objetivo), peso = VALUES(peso), estatura = VALUES(estatura),
         grasa_actual = VALUES(grasa_actual), meta_calorias_diarias = VALUES(meta_calorias_diarias),
         foto = VALUES(foto)`,
      [
        userId, p.nombre || 'Atleta', p.usuario || 'airyfit', p.sexo || 'mujer',
        p.objetivo || 'Recomposición Corporal', Number(p.peso) || 60,
        Number(p.estatura) || 165, Number(p.grasaActual) || 22,
        Number(p.metaCaloriasDiarias) || 450, p.foto || '',
      ]
    );
    res.json({ guardado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PLAN DE DIETA AISLADO POR USUARIO ---
app.get('/api/dieta/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  try {
    const [rows] = await pool.query('SELECT * FROM planes_dieta WHERE perfil_id = ? LIMIT 1', [userId]);
    if (rows.length === 0) return res.json(null);
    const d = rows[0];
    res.json({
      metaAguaVasos: d.meta_agua_vasos,
      vasosTomadosHoy: d.vasos_tomados_hoy,
      fechaAgua: d.fecha_agua ? new Date(d.fecha_agua).toISOString().slice(0, 10) : '',
      suplementos: typeof d.suplementos_json === 'string' ? JSON.parse(d.suplementos_json) : d.suplementos_json,
      comidas: typeof d.comidas_json === 'string' ? JSON.parse(d.comidas_json) : d.comidas_json,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dieta/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  const d = req.body;
  try {
    await pool.query(
      `INSERT IGNORE INTO perfiles (id, nombre, usuario) VALUES (?, 'Atleta', 'atleta')`,
      [userId]
    );
    await pool.query(
      `INSERT INTO planes_dieta (id, perfil_id, meta_agua_vasos, vasos_tomados_hoy, fecha_agua, suplementos_json, comidas_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         meta_agua_vasos = VALUES(meta_agua_vasos), vasos_tomados_hoy = VALUES(vasos_tomados_hoy),
         fecha_agua = VALUES(fecha_agua), suplementos_json = VALUES(suplementos_json),
         comidas_json = VALUES(comidas_json)`,
      [
        userId, userId,
        Number(d.metaAguaVasos) || 8, Number(d.vasosTomadosHoy) || 0,
        d.fechaAgua || null, JSON.stringify(d.suplementos || []), JSON.stringify(d.comidas || []),
      ]
    );
    res.json({ guardado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EJERCICIOS, RUTINAS E HISTORIAL POR USUARIO ---
app.get('/api/ejercicios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ejercicios ORDER BY creado_en ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/rutinas/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  try {
    const [rows] = await pool.query('SELECT * FROM rutinas WHERE usuario_id = ? ORDER BY creado_en ASC', [userId]);
    res.json(
      rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        enfoque: r.enfoque,
        ejercicios: typeof r.ejercicios_json === 'string' ? JSON.parse(r.ejercicios_json) : r.ejercicios_json,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rutinas/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  const lista = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (const r of lista) {
      await pool.query(
        `INSERT INTO rutinas (id, usuario_id, nombre, enfoque, ejercicios_json)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), enfoque = VALUES(enfoque), ejercicios_json = VALUES(ejercicios_json)`,
        [r.id, userId, r.nombre, r.enfoque || '', JSON.stringify(r.ejercicios || [])]
      );
    }
    res.json({ guardado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/historial/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM historial_sesiones WHERE usuario_id = ? ORDER BY fecha_iso DESC, creado_en DESC',
      [userId]
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        rutinaNombre: r.rutina_nombre,
        fecha: r.fecha_texto,
        fechaISO: r.fecha_iso ? new Date(r.fecha_iso).toISOString().slice(0, 10) : '',
        duracion: r.duracion_segundos,
        caloriasEstimadas: r.calorias_estimadas,
        ejercicios: typeof r.ejercicios_json === 'string' ? JSON.parse(r.ejercicios_json) : r.ejercicios_json,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/historial/:userId', async (req, res) => {
  const userId = Number(req.params.userId) || 1;
  const s = req.body;
  try {
    await pool.query(
      `INSERT INTO historial_sesiones (id, usuario_id, rutina_nombre, fecha_texto, fecha_iso, duracion_segundos, calorias_estimadas, ejercicios_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE duracion_segundos = VALUES(duracion_segundos), calorias_estimadas = VALUES(calorias_estimadas)`,
      [
        s.id || `h_${Date.now()}`, userId, s.rutinaNombre || 'Entrenamiento',
        s.fecha || new Date().toLocaleDateString(), s.fechaISO || null,
        Number(s.duracion) || 0, Number(s.caloriasEstimadas) || 0,
        JSON.stringify(s.ejercicios || []),
      ]
    );
    res.json({ guardado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API Multi-Usuario MySQL de AiryFit corriendo en http://localhost:${PORT}`);
});
