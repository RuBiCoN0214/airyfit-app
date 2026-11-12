import React, { useState, useRef } from 'react';
import { X, RotateCw, RotateCcw, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

export default function AvatarCropperModal({ imageSrc, onConfirm, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [rotacion, setRotacion] = useState(0);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [arrastrando, setArrastrando] = useState(false);
  const inicioArrastre = useRef({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setArrastrando(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    inicioArrastre.current = { x: clientX - posicion.x, y: clientY - posicion.y };
  };

  const handlePointerMove = (e) => {
    if (!arrastrando) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosicion({
      x: clientX - inicioArrastre.current.x,
      y: clientY - inicioArrastre.current.y,
    });
  };

  const handlePointerUp = () => {
    setArrastrando(false);
  };

  const generarRecorteOptimizado = () => {
    const img = imgRef.current;
    if (!img) return;

    // Canvas final ligero (360x360) para garantizar que siempre quepa en localStorage
    const size = 360;
    const previewSize = 240; // Tamaño del visor circular en pantalla
    const ratio = size / previewSize;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#090814';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(size / 2 + posicion.x * ratio, size / 2 + posicion.y * ratio);
    ctx.rotate((rotacion * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calcular escala base para cubrir el círculo igual que object-cover
    const naturalW = img.naturalWidth || 300;
    const naturalH = img.naturalHeight || 300;
    const baseScale = Math.max(size / naturalW, size / naturalH);
    const drawW = naturalW * baseScale;
    const drawH = naturalH * baseScale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const dataUrlComprimido = canvas.toDataURL('image/jpeg', 0.85);
    onConfirm(dataUrlComprimido);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#110e24] border border-violet-500/40 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-sky-400">
            Ajustar Foto de Perfil
          </span>
          <button onClick={onCancel} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visor Circular Interactivo */}
        <div className="flex flex-col items-center gap-2">
          <div
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-sky-400 shadow-2xl shadow-violet-600/40 bg-[#080712] cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Vista previa"
              draggable={false}
              style={{
                transform: `translate(${posicion.x}px, ${posicion.y}px) rotate(${rotacion}deg) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="w-full h-full object-cover pointer-events-none transition-transform duration-75"
            />
          </div>
          <span className="text-[11px] text-indigo-300/80 flex items-center gap-1.5 font-medium">
            <Move className="w-3.5 h-3.5 text-sky-400" /> Arrastra la imagen para encuadrarla
          </span>
        </div>

        {/* Controles de Zoom y Rotación */}
        <div className="bg-[#080712] border border-indigo-500/20 p-4 rounded-2xl space-y-4">
          {/* Control de Zoom */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-indigo-200">
              <span className="flex items-center gap-1"><ZoomOut className="w-3.5 h-3.5 text-sky-400" /> Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
              <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5 text-violet-400" /></span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          {/* Botones de Rotación */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => setRotacion((r) => (r - 90) % 360)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-100"
            >
              <RotateCcw className="w-4 h-4 text-sky-400" /> Girar Izq. 90°
            </button>
            <button
              type="button"
              onClick={() => setRotacion((r) => (r + 90) % 360)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-100"
            >
              <RotateCw className="w-4 h-4 text-violet-400" /> Girar Der. 90°
            </button>
          </div>
        </div>

        {/* Botones Confirmar / Cancelar */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 py-3.5 rounded-2xl bg-slate-900 border border-indigo-500/20 text-slate-300 font-bold text-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={generarRecorteOptimizado}
            className="w-2/3 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:brightness-110 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Guardar Foto de Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
