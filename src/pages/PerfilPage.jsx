import SelectorTema from "../components/SelectorTema";
import React, { useState, useEffect } from 'react';
import {
  Sparkles, Scale, Ruler, Target, Edit3, Check, Share2, Download, X,
  Activity, ShieldCheck, Camera, Plus, Flame
, LogOut } from 'lucide-react';
import { getFechaLocalISO } from '../services/storage';
import AvatarCropperModal from '../components/AvatarCropperModal';

export default function PerfilPage({ perfil, onGuardarPerfil, historial, rachaData, modoVista, onCerrarSesion }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(perfil);
  const [mostrarModalCompartir, setMostrarModalCompartir] = useState(false);
  const [periodo, setPeriodo] = useState('mes');
  const [caloriasRapidas, setCaloriasRapidas] = useState('');
  const [imagenParaRecortar, setImagenParaRecortar] = useState(null);
  const [avisoFormato, setAvisoFormato] = useState('');

  useEffect(() => {
    setForm(perfil);
  }, [perfil]);

  const esMovil = modoVista === 'mobile';

  const handleChange = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSeleccionarFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setAvisoFormato('');

    try {
      const esHeic =
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif') ||
        file.type === 'image/heic' ||
        file.type === 'image/heif';

      if (typeof createImageBitmap === 'function') {
        try {
          const bitmap = await createImageBitmap(file);
          const canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(bitmap, 0, 0);
          const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setImagenParaRecortar(jpegDataUrl);
          return;
        } catch (bitmapErr) {
          if (esHeic) {
            setAvisoFormato(
              'Chrome no decodifica archivos .HEIC directamente. Abre http://localhost:5173 en Safari (que sí los soporta en Mac) o exporta la foto a JPG.'
            );
            return;
          }
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenParaRecortar(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setAvisoFormato('No se pudo cargar esa imagen. Prueba con JPG, PNG o WEBP.');
    }
  };

  const handleConfirmarRecorte = (fotoRecortadaDataUrl) => {
    const actualizado = { ...form, foto: fotoRecortadaDataUrl };
    setForm(actualizado);
    onGuardarPerfil(actualizado);
    setImagenParaRecortar(null);
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    onGuardarPerfil(form);
    setEditando(false);
  };

  const hoyISO = getFechaLocalISO(new Date());
  const hoyLocalStr = new Date().toLocaleDateString();

  const sesionesDeHoy = historial.filter(
    (s) => s.fechaISO === hoyISO || s.fecha === hoyLocalStr
  );

  const caloriasPorEntrenamientoHoy = sesionesDeHoy.reduce((acc, s) => {
    const mins = (s.duracion || 0) / 60;
    const factorPeso = (Number(form.peso) || 60) / 60;
    const kcal = s.caloriasEstimadas || Math.round(mins * 6.5 * factorPeso);
    return acc + kcal;
  }, 0);

  const caloriasExtraHoy =
    form.fechaCaloriasExtra === hoyISO ? Number(form.caloriasExtraHoy || 0) : 0;

  const totalCaloriasQuemadasHoy = caloriasPorEntrenamientoHoy + caloriasExtraHoy;
  const metaCalorias = form.metaCaloriasDiarias !== "" && form.metaCaloriasDiarias != null ? Math.max(1, Number(form.metaCaloriasDiarias)) : 450;
  const porcentajeCalorias = Math.min(100, Math.round((totalCaloriasQuemadasHoy / metaCalorias) * 100));
  const caloriasRestantes = Math.max(0, metaCalorias - totalCaloriasQuemadasHoy);

  const handleSumarCaloriasHoy = (e) => {
    e.preventDefault();
    const extra = Number(caloriasRapidas);
    if (!extra || extra <= 0) return;
    const actualizado = {
      ...form,
      fechaCaloriasExtra: hoyISO,
      caloriasExtraHoy: caloriasExtraHoy + extra,
    };
    setForm(actualizado);
    onGuardarPerfil(actualizado);
    setCaloriasRapidas('');
  };

  const estaturaM = (Number(form.estatura) || 165) / 100;
  const pesoActual = Number(form.peso) || 60;
  const imc = (pesoActual / (estaturaM * estaturaM)).toFixed(1);

  const pesoIdealMin = (18.5 * estaturaM * estaturaM).toFixed(1);
  const pesoIdealMax = (24.9 * estaturaM * estaturaM).toFixed(1);
  const pesoIdealOptimo = ((Number(pesoIdealMin) + Number(pesoIdealMax)) / 2).toFixed(1);

  const tablaACE =
    form.sexo === 'hombre'
      ? [
          { categoria: 'Grasa Esencial', rango: '2% – 5%', min: 2, max: 5.9, nota: 'Mínimo fisiológico' },
          { categoria: 'Atleta / Definición', rango: '6% – 13%', min: 6, max: 13.9, nota: 'Alto rendimiento y marcación' },
          { categoria: 'Fitness (Ideal Saludable)', rango: '14% – 17%', min: 14, max: 17.9, nota: 'Estético, sostenible y óptimo' },
          { categoria: 'Promedio Aceptable', rango: '18% – 24%', min: 18, max: 24.9, nota: 'Rango general saludable' },
          { categoria: 'Exceso / Obesidad', rango: '25% o más', min: 25, max: 100, nota: 'Riesgo metabólico elevado' },
        ]
      : [
          { categoria: 'Grasa Esencial', rango: '10% – 13%', min: 10, max: 13.9, nota: 'Mínimo hormonal femenino' },
          { categoria: 'Atleta / Definición', rango: '14% – 20%', min: 14, max: 20.9, nota: 'Alto rendimiento y tono muscular' },
          { categoria: 'Fitness (Ideal Saludable)', rango: '21% – 24%', min: 21, max: 24.9, nota: 'Estético, hormonalmente óptimo' },
          { categoria: 'Promedio Aceptable', rango: '25% – 31%', min: 25, max: 31.9, nota: 'Rango general saludable' },
          { categoria: 'Exceso / Obesidad', rango: '32% o más', min: 32, max: 100, nota: 'Riesgo metabólico elevado' },
        ];

  const grasaNum = Number(form.grasaActual) || (form.sexo === 'hombre' ? 16 : 22);
  const categoriaActual =
    tablaACE.find((fila) => grasaNum >= fila.min && grasaNum <= fila.max) || tablaACE[2];

  const rangoGrasaObjetivo = () => {
    if (form.sexo === 'hombre') {
      if (form.objetivo === 'Definición / Pérdida de Grasa') return '10% – 14%';
      if (form.objetivo === 'Hipertrofia / Ganar Masa') return '13% – 17%';
      return '12% – 16%';
    } else {
      if (form.objetivo === 'Definición / Pérdida de Grasa') return '17% – 21%';
      if (form.objetivo === 'Hipertrofia / Ganar Masa') return '20% – 24%';
      return '19% – 23%';
    }
  };

  const ahora = Date.now();
  const msDia = 24 * 60 * 60 * 1000;
  const sesionesFiltradas = historial.filter((s) => {
    if (periodo === 'todo') return true;
    const timestamp = Number(String(s.id).replace('h_', '')) || ahora;
    const dias = (ahora - timestamp) / msDia;
    return periodo === 'semana' ? dias <= 7 : dias <= 30;
  });

  const totalSesiones = sesionesFiltradas.length;
  const volumenLevantado = sesionesFiltradas.reduce((acc, s) => {
    let vol = 0;
    s.ejercicios?.forEach((ej) => {
      ej.series?.forEach((ser) => {
        if (ser.completada) vol += (Number(ser.peso) || 0) * (Number(ser.reps) || 0);
      });
    });
    return acc + vol;
  }, 0);

  const descargarFichaPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1120;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 900, 1120);
    grad.addColorStop(0, '#090817');
    grad.addColorStop(0.5, '#16113a');
    grad.addColorStop(1, '#0b192c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 1120);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 828, 1048);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('AIRYFIT • STUDIO GYM', 75, 105);

    const etiquetaPeriodo =
      periodo === 'semana' ? 'RESUMEN SEMANAL' : periodo === 'mes' ? 'RESUMEN ÚLTIMO MES' : 'HISTORIAL COMPLETO';
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`${etiquetaPeriodo}  •  🔥 RACHA: ${rachaData?.rachaActual || 0} DÍAS`, 75, 148);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(form.nombre || 'Atleta', 75, 235);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '26px sans-serif';
    ctx.fillText(`@${form.usuario || 'airyfit'}  •  Meta: ${form.objetivo}`, 75, 280);

    const dibujarCaja = (x, y, w, h, titulo, valor, colorValor) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(titulo, x + 28, y + 48);

      ctx.fillStyle = colorValor;
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(valor, x + 28, y + 115);
    };

    dibujarCaja(75, 340, 360, 160, 'ENTRENAMIENTOS', `${totalSesiones}`, '#38bdf8');
    dibujarCaja(465, 340, 360, 160, 'CALORÍAS HOY', `${totalCaloriasQuemadasHoy} kcal`, '#fb923c');
    dibujarCaja(75, 525, 750, 160, 'VOLUMEN TOTAL MOVIDO', `${volumenLevantado.toLocaleString()} kg`, '#34d399');

    dibujarCaja(75, 710, 235, 160, 'PESO ACTUAL', `${form.peso} kg`, '#ffffff');
    dibujarCaja(332, 710, 235, 160, 'GRASA CORP.', `${form.grasaActual}%`, '#38bdf8');
    dibujarCaja(590, 710, 235, 160, 'IMC CLÍNICO', `${imc}`, '#c084fc');

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Peso Saludable: ${pesoIdealMin} – ${pesoIdealMax} kg  |  Grasa Ideal: ${rangoGrasaObjetivo()}`, 75, 950);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Generado el ${new Date().toLocaleDateString()} con AiryFit`, 75, 1020);

    const link = document.createElement('a');
    link.download = `AiryFit_Resultados_${form.usuario || 'atleta'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  return (
    <div className={`${esMovil ? 'p-4 space-y-5 pb-28' : 'p-5 md:p-10 max-w-5xl mx-auto space-y-8 pb-32'}`}>
      <div className="bg-gradient-to-br from-[#171336] via-[#110e26] to-[#0c162d] border border-violet-500/30 rounded-3xl p-5 md:p-8 shadow-2xl space-y-5">
        <div className={`flex ${esMovil ? 'flex-col items-start gap-4' : 'flex-col sm:flex-row sm:items-center justify-between gap-6'}`}>
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={form.foto}
                alt="Perfil"
                className={`${esMovil ? 'w-16 h-16' : 'w-20 h-20 md:w-24 md:h-24'} rounded-full object-cover border-2 border-sky-400 shadow-lg shadow-violet-600/30`}
              />
              <label
                title="Subir y encuadrar foto de perfil"
                className="absolute -bottom-1 -right-1 p-2 bg-gradient-to-r from-violet-600 to-sky-500 hover:brightness-110 text-white rounded-full cursor-pointer shadow-lg border-2 border-[#110e26] transition-transform hover:scale-110"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleSeleccionarFoto}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-violet-400" /> Ficha Atlética
              </span>
              <h2 className={`${esMovil ? 'text-xl' : 'text-2xl md:text-3xl'} font-black text-white leading-tight`}>
                {form.nombre}
              </h2>
              <p className="text-violet-300 text-xs font-semibold">@{form.usuario}</p>
            </div>
          </div>

          <div className={`flex ${esMovil ? 'w-full' : ''} gap-2.5`}>
            <button
              onClick={() => setEditando(!editando)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-950/90 hover:bg-indigo-900 text-indigo-100 border border-indigo-500/30 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-violet-400" />
              {editando ? 'Cerrar Edición' : 'Editar Datos'}
            </button>
            <button
              onClick={() => setMostrarModalCompartir(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-sky-500 hover:brightness-110 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-violet-600/25 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" /> Compartir
            </button>
            {onCerrarSesion && (
              <button
                onClick={onCerrarSesion}
                className="flex items-center justify-center bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all"
              >
                Salir
              </button>
            )}
          </div>
        </div>

        {avisoFormato && (
          <div className="bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-semibold p-3.5 rounded-2xl">
            {avisoFormato}
          </div>
        )}

        {editando ? (
          <form onSubmit={handleGuardar} className="pt-4 border-t border-indigo-500/20 space-y-4">
            <div className={`grid ${esMovil ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} gap-4`}>
              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Sexo Biológico</label>
                <select
                  value={form.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold"
                >
                  <option value="mujer">Mujer</option>
                  <option value="hombre">Hombre</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Objetivo Principal</label>
                <select
                  value={form.objetivo}
                  onChange={(e) => handleChange('objetivo', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold"
                >
                  <option value="Recomposición Corporal">Recomposición Corporal</option>
                  <option value="Definición / Pérdida de Grasa">Definición / Pérdida de Grasa</option>
                  <option value="Hipertrofia / Ganar Masa">Hipertrofia / Ganar Masa</option>
                  <option value="Fuerza y Rendimiento">Fuerza y Rendimiento</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-sky-300 block mb-1">Peso Actual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.peso}
                  onChange={(e) => handleChange('peso', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-sky-300 block mb-1">Estatura (cm)</label>
                <input
                  type="number"
                  value={form.estatura}
                  onChange={(e) => handleChange('estatura', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-violet-300 block mb-1">% Grasa Corporal Actual</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.grasaActual}
                  onChange={(e) => handleChange('grasaActual', e.target.value)}
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white font-bold"
                />
              </div>
              <div className={esMovil ? "col-span-1" : "sm:col-span-2 md:col-span-3"}>
                <label className="text-[11px] font-bold text-orange-300 block mb-1">
                  Meta de Calorías Activas a Quemar por Día (kcal)
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="any"
                  name="metaCaloriasDiarias"
                  value={form.metaCaloriasDiarias ?? ""}
                  onChange={(e) => handleChange("metaCaloriasDiarias", e.target.value)}
                  placeholder="Escribe tu meta diaria (ej. 450)"
                  className="w-full bg-[#080712] border border-orange-500/40 focus:border-sky-400 rounded-xl px-3.5 py-2.5 text-sm text-white font-black focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl text-sm shadow-lg"
            >
              <Check className="w-4 h-4" /> Guardar Ficha Biométrica
            </button>
          </form>
        ) : (
          <div className={`grid ${esMovil ? 'grid-cols-2 gap-2.5' : 'grid-cols-2 sm:grid-cols-4 gap-3'} pt-2`}>
            <div className="bg-[#090814]/80 border border-indigo-500/20 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-300/70 uppercase flex items-center gap-1">
                <Scale className="w-3 h-3 text-sky-400" /> Peso Actual
              </span>
              <p className="text-lg font-black text-white mt-0.5">{form.peso} kg</p>
            </div>
            <div className="bg-[#090814]/80 border border-indigo-500/20 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-300/70 uppercase flex items-center gap-1">
                <Ruler className="w-3 h-3 text-violet-400" /> Estatura
              </span>
              <p className="text-lg font-black text-white mt-0.5">{form.estatura} cm</p>
            </div>
            <div className="bg-[#090814]/80 border border-indigo-500/20 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-300/70 uppercase flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" /> Grasa Corp.
              </span>
              <p className="text-lg font-black text-sky-300 mt-0.5">{form.grasaActual}%</p>
            </div>
            <div className="bg-[#090814]/80 border border-indigo-500/20 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-indigo-300/70 uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-violet-400" /> Objetivo
              </span>
              <p className="text-xs font-extrabold text-violet-200 mt-1 line-clamp-1">{form.objetivo}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#100e22] border border-orange-500/30 rounded-3xl p-5 md:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-orange-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-orange-500" /> Balance Energético Diario
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">Calorías Quemadas Hoy</h3>
          </div>

          <form onSubmit={handleSumarCaloriasHoy} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="3000"
              value={caloriasRapidas}
              onChange={(e) => setCaloriasRapidas(e.target.value)}
              placeholder="+ kcal extra hoy"
              className="bg-[#080712] border border-orange-500/30 rounded-xl px-3 py-2 text-xs text-white w-36 focus:outline-none focus:border-orange-400"
            />
            <button
              type="submit"
              className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl font-black text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Sumar
            </button>
          </form>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-orange-300">
              Quemadas hoy: <strong className="text-white">{totalCaloriasQuemadasHoy} kcal</strong>
            </span>
            <span className="text-slate-400">
              Meta: <strong className="text-sky-300">{metaCalorias} kcal</strong> ({porcentajeCalorias}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-[#080712] rounded-full overflow-hidden border border-indigo-500/20 p-0.5">
            <div
              style={{ width: `${porcentajeCalorias}%` }}
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-sky-400 rounded-full transition-all duration-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-indigo-500/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-950/80 text-[11px] font-extrabold uppercase text-indigo-200">
                <th className="py-3 px-4">Concepto Energético</th>
                <th className="py-3 px-4">Valor</th>
                {!esMovil && <th className="py-3 px-4">Detalle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/15 text-xs">
              <tr className="bg-[#080712]/60 text-slate-200">
                <td className="py-3 px-4 font-bold">Meta Diaria</td>
                <td className="py-3 px-4 font-mono font-black text-sky-300">{metaCalorias} kcal</td>
                {!esMovil && <td className="py-3 px-4 text-slate-400">Objetivo diario configurado</td>}
              </tr>
              <tr className="bg-[#080712]/60 text-slate-200">
                <td className="py-3 px-4 font-bold">Quemadas en Rutinas Hoy</td>
                <td className="py-3 px-4 font-mono font-black text-orange-400">{caloriasPorEntrenamientoHoy} kcal</td>
                {!esMovil && <td className="py-3 px-4 text-slate-400">Calculado por duración y peso</td>}
              </tr>
              <tr className="bg-[#080712]/60 text-slate-200">
                <td className="py-3 px-4 font-bold">Actividad Extra Hoy</td>
                <td className="py-3 px-4 font-mono font-black text-amber-300">{caloriasExtraHoy} kcal</td>
                {!esMovil && <td className="py-3 px-4 text-slate-400">Cardio / pasos añadidos</td>}
              </tr>
              <tr className="bg-gradient-to-r from-orange-500/15 to-violet-600/15 text-white font-bold">
                <td className="py-3 px-4">Faltante para tu Meta</td>
                <td className="py-3 px-4 font-mono font-black text-emerald-400">
                  {caloriasRestantes === 0 ? '¡Meta Cumplida! 🎉' : `${caloriasRestantes} kcal`}
                </td>
                {!esMovil && <td className="py-3 px-4 text-indigo-200">Balance actualizado hoy</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#100e22] border border-indigo-500/25 rounded-3xl p-5 md:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-500/15 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Parámetros Clínicos Validados (OMS & ACE)
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">Diagnóstico de Peso y Grasa Ideal</h3>
          </div>
          <span className="text-xs bg-indigo-950 text-sky-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold w-fit">
            IMC: {imc} kg/m²
          </span>
        </div>

        <div className={`grid ${esMovil ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
          <div className="bg-[#080712] border border-sky-500/25 p-4 rounded-2xl space-y-1">
            <p className="text-[11px] font-extrabold uppercase text-sky-400">Rango de Peso Saludable</p>
            <p className="text-2xl font-black text-white">
              {pesoIdealMin} – {pesoIdealMax} <span className="text-sm font-bold text-slate-400">kg</span>
            </p>
            <p className="text-xs text-slate-400">
              Referencia media: <strong className="text-sky-300">{pesoIdealOptimo} kg</strong>
            </p>
          </div>

          <div className="bg-[#080712] border border-violet-500/25 p-4 rounded-2xl space-y-1">
            <p className="text-[11px] font-extrabold uppercase text-violet-400">% Grasa Ideal para tu Meta</p>
            <p className="text-2xl font-black text-white">{rangoGrasaObjetivo()}</p>
            <p className="text-xs text-slate-400">
              Para <strong className="text-violet-300">{form.objetivo}</strong>
            </p>
          </div>

          <div className="bg-[#080712] border border-emerald-500/25 p-4 rounded-2xl space-y-1">
            <p className="text-[11px] font-extrabold uppercase text-emerald-400">Tu Clasificación Actual</p>
            <p className="text-lg font-black text-white">{categoriaActual.categoria}</p>
            <p className="text-xs text-slate-400">{categoriaActual.nota}</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
            Tabla de Referencia Oficial ACE ({form.sexo === 'hombre' ? 'Hombres' : 'Mujeres'})
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-indigo-500/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-indigo-950/80 text-[11px] font-extrabold uppercase text-indigo-200">
                  <th className="py-3 px-4">Clasificación</th>
                  <th className="py-3 px-4">Rango % Grasa</th>
                  {!esMovil && <th className="py-3 px-4">Descripción Fisiológica</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/15 text-xs">
                {tablaACE.map((fila, idx) => {
                  const esTuRango = fila.categoria === categoriaActual.categoria;
                  return (
                    <tr
                      key={idx}
                      className={
                        esTuRango
                          ? 'bg-gradient-to-r from-violet-600/30 to-sky-500/20 text-white font-bold'
                          : 'bg-[#080712]/60 text-slate-300'
                      }
                    >
                      <td className="py-3 px-4 flex items-center gap-2">
                        {fila.categoria}
                        {esTuRango && (
                          <span className="text-[10px] bg-sky-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                            TÚ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-300">{fila.rango}</td>
                      {!esMovil && <td className="py-3 px-4 text-slate-400">{fila.nota}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {imagenParaRecortar && (
        <AvatarCropperModal
          imageSrc={imagenParaRecortar}
          onConfirm={handleConfirmarRecorte}
          onCancel={() => setImagenParaRecortar(null)}
        />
      )}

      {mostrarModalCompartir && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#110e24] border border-violet-500/40 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                Ficha de Resultados
              </span>
              <button onClick={() => setMostrarModalCompartir(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#080712] p-1.5 rounded-2xl border border-indigo-500/20">
              {[
                { id: 'semana', label: 'Esta Semana' },
                { id: 'mes', label: 'Último Mes' },
                { id: 'todo', label: 'Todo' },
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => setPeriodo(op.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    periodo === op.id
                      ? 'bg-gradient-to-r from-violet-600 to-sky-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#19143d] via-[#110e29] to-[#0b1b34] border-2 border-violet-500/50 rounded-3xl p-6 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-widest text-sky-400">AIRYFIT PRO</span>
                <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full">
                  🔥 {rachaData?.rachaActual || 0} DÍAS RACHA
                </span>
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">{form.nombre}</h4>
                <p className="text-xs text-indigo-300">Meta: {form.objetivo}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#080712]/80 p-3.5 rounded-2xl border border-indigo-500/25">
                  <span className="text-[10px] text-slate-400 font-bold block">SESIONES</span>
                  <span className="text-2xl font-black text-sky-400">{totalSesiones}</span>
                </div>
                <div className="bg-[#080712]/80 p-3.5 rounded-2xl border border-indigo-500/25">
                  <span className="text-[10px] text-slate-400 font-bold block">CALORÍAS HOY</span>
                  <span className="text-2xl font-black text-orange-400">{totalCaloriasQuemadasHoy}</span>
                </div>
                <div className="col-span-2 bg-[#080712]/80 p-3.5 rounded-2xl border border-indigo-500/25 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">VOLUMEN LEVANTADO</span>
                    <span className="text-xl font-black text-emerald-400">{volumenLevantado.toLocaleString()} kg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">COMPOSICIÓN</span>
                    <span className="text-sm font-black text-white">
                      {form.peso} kg • {form.grasaActual}% grasa
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={descargarFichaPNG}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Descargar Ficha en Imagen (PNG)
            </button>
          </div>
        </div>
      )}

      <SelectorTema />

      {/* BOTÓN DE CERRAR SESIÓN AL FINAL DE MI PERFIL */}
      {onCerrarSesion && (
        <div className="pt-2 pb-6">
          <button
            type="button"
            onClick={onCerrarSesion}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/35 font-black py-3.5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
