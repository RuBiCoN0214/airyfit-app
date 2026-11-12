import React, { useState } from 'react';
import { ArrowLeft, Upload, Sparkles, Check } from 'lucide-react';

export default function CrearEjercicioPage({ onGuardarEjercicio, onVolver }) {
  const [nombre, setNombre] = useState('');
  const [musculo, setMusculo] = useState('Glúteos');
  const [equipo, setEquipo] = useState('Mancuerna');
  const [descripcion, setDescripcion] = useState('');
  const [imagenPreview, setImagenPreview] = useState('');

  const musculos = ['Glúteos', 'Cuádriceps', 'Femoral', 'Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Abdomen', 'Cardio'];

  const handleArchivoSubido = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onGuardarEjercicio({
      id: 'ej_' + Date.now(),
      nombre: nombre.trim(),
      musculo,
      equipo,
      imagen: imagenPreview || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      instrucciones: descripcion.trim() || 'Ejecuta el movimiento con técnica controlada.'
    });
  };

  return (
    <div className="p-5 md:p-10 max-w-3xl mx-auto space-y-6 pb-32">
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-indigo-200 hover:text-white bg-[#121026] border border-indigo-500/25 px-4 py-2.5 rounded-2xl text-sm font-bold"
      >
        <ArrowLeft className="w-4 h-4 text-sky-400" /> Volver
      </button>

      <div className="space-y-1">
        <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Base de Datos AiryFit
        </span>
        <h1 className="text-3xl font-black text-white">Crear Nuevo Ejercicio</h1>
        <p className="text-xs text-indigo-200/70">
          Se guardará automáticamente en la biblioteca para que puedas buscarlo y agregarlo a cualquier rutina.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#100e22] border border-indigo-500/25 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl">
        {/* Subir Foto / GIF */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-violet-300 block">
            Foto, GIF o Captura de Video del Ejercicio
          </label>
          <div className="border-2 border-dashed border-violet-500/40 hover:border-sky-400 rounded-3xl p-6 text-center bg-[#080712] transition-all">
            {imagenPreview ? (
              <div className="space-y-3">
                <img src={imagenPreview} alt="Vista previa" className="max-h-52 mx-auto rounded-2xl object-cover border border-sky-400/40" />
                <button
                  type="button"
                  onClick={() => setImagenPreview('')}
                  className="text-xs text-rose-400 font-bold underline"
                >
                  Quitar imagen
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 py-4">
                <div className="p-4 bg-violet-600/20 rounded-2xl text-sky-400">
                  <Upload className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-white">Haz clic para subir Foto o GIF desde tu dispositivo</span>
                <span className="text-xs text-slate-400">Soporta JPG, PNG, GIF o WebP</span>
                <input type="file" accept="image/*" onChange={handleArchivoSubido} className="hidden" />
              </label>
            )}
          </div>
          <input
            type="url"
            value={imagenPreview.startsWith('data:') ? '' : imagenPreview}
            onChange={(e) => setImagenPreview(e.target.value)}
            placeholder="O pega aquí el enlace URL de un GIF / imagen..."
            className="w-full bg-[#080712] border border-indigo-500/25 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-400"
          />
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300 block">
            Nombre del Ejercicio *
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Patada de Glúteo en Polea Baja"
            className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* Músculo y Equipo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300 block">Grupo Muscular</label>
            <select
              value={musculo}
              onChange={(e) => setMusculo(e.target.value)}
              className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl p-4 text-white font-semibold"
            >
              {musculos.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300 block">Equipo</label>
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl p-4 text-white font-semibold"
            >
              <option value="Mancuerna">Mancuerna</option>
              <option value="Barra">Barra</option>
              <option value="Polea">Polea</option>
              <option value="Máquina">Máquina</option>
              <option value="Peso Corporal">Peso Corporal</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-sky-300 block">
            Descripción / Técnica
          </label>
          <textarea
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe cómo realizar el movimiento, postura o tips importantes..."
            className="w-full bg-[#080712] border border-indigo-500/30 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-violet-400"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-black py-4 rounded-2xl shadow-xl shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Check className="w-5 h-5" /> Guardar Ejercicio en la Base de Datos
        </button>
      </form>
    </div>
  );
}
