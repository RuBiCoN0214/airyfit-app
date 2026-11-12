import React, { useState, useEffect } from 'react';
import {
  Utensils, Plus, Trash2, ArrowLeftRight, Droplets, Pill,
  Clock, Flame, Check, Sparkles, BookOpen, X, Info, ChefHat, Scale, Eye, ShoppingCart, Download
} from 'lucide-react';
import {
  CATALOGO_ALIMENTOS,
  PLAN_DIETA_INICIAL,
  calcularEquivalencia,
  obtenerMedidasPracticas,
} from '../data/alimentosEquivalentes';
import { getFechaLocalISO } from '../services/storage';
import { MySQLService } from '../services/mysqlSync';
import { generarResumenCompras, descargarTicketComprasPNG } from '../services/listaComprasGenerator';

const STORAGE_DIETA_KEY = 'airyfit_plan_dieta_v2';

export default function NutricionPage({ perfil, modoVista, userId = 1 }) {
  const esMovil = modoVista === 'mobile';
  const hoyISO = getFechaLocalISO(new Date());

  const [plan, setPlan] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_DIETA_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed.fechaAgua !== hoyISO) {
          return {
            ...parsed,
            fechaAgua: hoyISO,
            vasosTomadosHoy: 0,
            suplementos: (parsed.suplementos || []).map((s) => ({ ...s, tomado: false })),
          };
        }
        return parsed;
      }
    } catch (_) {}
    return { ...PLAN_DIETA_INICIAL, fechaAgua: hoyISO };
  });

  useEffect(() => {
    MySQLService.obtenerDieta(userId).then((dietaDB) => {
      if (dietaDB && dietaDB.comidas) {
        setPlan((prev) => ({ ...prev, ...dietaDB }));
      }
    });
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DIETA_KEY, JSON.stringify(plan));
    } catch (_) {}
    MySQLService.guardarDieta(plan, userId);
  }, [plan]);

  // Modales y vistas interactivas
  const [comidaFichaId, setComidaFichaId] = useState(null); // Abre la ficha completa de una comida
  const [intercambioActivo, setIntercambioActivo] = useState(null); // { comidaId, item }
  const [comidaAgregando, setComidaAgregando] = useState(null); // comidaId

  // Estado para agregar alimento con selector de unidad (g, kg, casera/piezas/tazas, ml/L)
  const [nuevoAlimentoId, setNuevoAlimentoId] = useState('pollo_pechuga');
  const [unidadEntrada, setUnidadEntrada] = useState('g'); // 'g' | 'kg' | 'casera' | 'L'
  const [cantidadEntrada, setCantidadEntrada] = useState('140');

  const [mostrandoNuevaComida, setMostrandoNuevaComida] = useState(false);
  const [nombreNuevaComida, setNombreNuevaComida] = useState('');
  const [horaNuevaComida, setHoraNuevaComida] = useState('12:00 PM');
  const [notaNuevaComida, setNotaNuevaComida] = useState('');
  const [prepNuevaComida, setPrepNuevaComida] = useState('');

  const [nuevoSupNombre, setNuevoSupNombre] = useState('');
  const [nuevoSupHora, setNuevoSupHora] = useState('En ayunas');
  const [mostrandoTablaMaestra, setMostrandoTablaMaestra] = useState(false);
  const [mostrandoListaCompras, setMostrandoListaCompras] = useState(false);
  const [diasCompra, setDiasCompra] = useState(7);
  const [grupoTabla, setGrupoTabla] = useState('proteina');

  // Conversor rápido independiente dentro de la Tabla Maestra
  const [convValor, setConvValor] = useState('1');
  const [convTipo, setConvTipo] = useState('kg_a_g');

  const getAlimento = (id) =>
    CATALOGO_ALIMENTOS.find((a) => a.id === id) || CATALOGO_ALIMENTOS[0];

  const totalesDia = plan.comidas.reduce(
    (acc, comida) => {
      comida.alimentos.forEach((item) => {
        const al = getAlimento(item.alimentoId);
        const factor = (Number(item.gramos) || 0) / 100;
        acc.kcal += al.kcal100 * factor;
        acc.prot += al.prot100 * factor;
        acc.carb += al.carb100 * factor;
        acc.gras += al.gras100 * factor;
      });
      return acc;
    },
    { kcal: 0, prot: 0, carb: 0, gras: 0 }
  );

  const cambiarMetaAgua = (nuevaMeta) => {
    setPlan((prev) => ({
      ...prev,
      metaAguaVasos: Math.max(1, Math.min(20, Number(nuevaMeta) || 8)),
    }));
  };

  const toggleSuplemento = (id) => {
    setPlan((prev) => ({
      ...prev,
      suplementos: prev.suplementos.map((s) =>
        s.id === id ? { ...s, tomado: !s.tomado } : s
      ),
    }));
  };

  const agregarSuplemento = (e) => {
    e.preventDefault();
    if (!nuevoSupNombre.trim()) return;
    setPlan((prev) => ({
      ...prev,
      suplementos: [
        ...prev.suplementos,
        { id: `sup_${Date.now()}`, nombre: nuevoSupNombre.trim(), hora: nuevoSupHora, tomado: false },
      ],
    }));
    setNuevoSupNombre('');
  };

  const eliminarSuplemento = (id) => {
    setPlan((prev) => ({
      ...prev,
      suplementos: prev.suplementos.filter((s) => s.id !== id),
    }));
  };

  const crearComida = (e) => {
    e.preventDefault();
    if (!nombreNuevaComida.trim()) return;
    setPlan((prev) => ({
      ...prev,
      comidas: [
        ...prev.comidas,
        {
          id: `com_${Date.now()}`,
          nombre: nombreNuevaComida.trim(),
          hora: horaNuevaComida,
          nota: notaNuevaComida.trim(),
          preparacion: prepNuevaComida.trim(),
          alimentos: [],
        },
      ],
    }));
    setNombreNuevaComida('');
    setNotaNuevaComida('');
    setPrepNuevaComida('');
    setMostrandoNuevaComida(false);
  };

  const actualizarCampoComida = (comidaId, campo, valor) => {
    setPlan((prev) => ({
      ...prev,
      comidas: prev.comidas.map((c) =>
        c.id === comidaId ? { ...c, [campo]: valor } : c
      ),
    }));
  };

  const eliminarComida = (comidaId) => {
    setPlan((prev) => ({
      ...prev,
      comidas: prev.comidas.filter((c) => c.id !== comidaId),
    }));
    if (comidaFichaId === comidaId) setComidaFichaId(null);
  };

  const calcularGramosDesdeUnidad = () => {
    const val = Number(cantidadEntrada) || 0;
    const al = getAlimento(nuevoAlimentoId);
    if (unidadEntrada === 'kg' || unidadEntrada === 'L') return Math.round(val * 1000);
    if (unidadEntrada === 'casera') return Math.round(val * (al.gramosPorUnidad || 100));
    return Math.round(val);
  };

  const agregarAlimentoAComida = (e) => {
    e.preventDefault();
    if (!comidaAgregando) return;
    const gr = Math.max(1, calcularGramosDesdeUnidad());
    setPlan((prev) => ({
      ...prev,
      comidas: prev.comidas.map((c) =>
        c.id === comidaAgregando
          ? {
              ...c,
              alimentos: [
                ...c.alimentos,
                { id: `item_${Date.now()}`, alimentoId: nuevoAlimentoId, gramos: gr },
              ],
            }
          : c
      ),
    }));
    setComidaAgregando(null);
  };

  const eliminarAlimento = (comidaId, itemId) => {
    setPlan((prev) => ({
      ...prev,
      comidas: prev.comidas.map((c) =>
        c.id === comidaId
          ? { ...c, alimentos: c.alimentos.filter((i) => i.id !== itemId) }
          : c
      ),
    }));
  };

  const aplicarIntercambio = (comidaId, itemId, nuevoAlId, gramosEquivalentes) => {
    setPlan((prev) => ({
      ...prev,
      comidas: prev.comidas.map((c) =>
        c.id === comidaId
          ? {
              ...c,
              alimentos: c.alimentos.map((i) =>
                i.id === itemId
                  ? { ...i, alimentoId: nuevoAlId, gramos: gramosEquivalentes }
                  : i
              ),
            }
          : c
      ),
    }));
    setIntercambioActivo(null);
  };

  const resultadoConversor = () => {
    const v = Number(convValor) || 0;
    if (convTipo === 'kg_a_g') return `${v} kg = ${(v * 1000).toLocaleString()} gramos`;
    if (convTipo === 'g_a_kg') return `${v} g = ${(v / 1000).toFixed(3)} kilogramos`;
    if (convTipo === 'L_a_ml') return `${v} Litros = ${(v * 1000).toLocaleString()} ml (${(v / 0.24).toFixed(1)} tazas)`;
    if (convTipo === 'tazas_a_ml') return `${v} tazas = ${Math.round(v * 240)} ml (${((v * 240) / 1000).toFixed(2)} L)`;
    if (convTipo === 'pollo_crudo_cocido') return `${v} g pollo crudo ≈ ${Math.round(v * 0.75)} g ya cocido`;
    if (convTipo === 'arroz_cocido_crudo') return `${v} g arroz cocido ≈ ${Math.round(v / 2.8)} g en crudo`;
    return '';
  };
  const comidaFichaActual = plan.comidas.find((c) => c.id === comidaFichaId) || null;

  return (
    <div className={`${esMovil ? 'p-4 space-y-5 pb-28' : 'p-5 md:p-10 max-w-6xl mx-auto space-y-7 pb-32'}`}>
      {/* ENCABEZADO Y RESUMEN DE CALORÍAS / MACROS */}
      <div className="bg-gradient-to-br from-[#171336] via-[#110e26] to-[#0c162d] border border-violet-500/30 rounded-3xl p-5 md:p-7 shadow-2xl space-y-5">
        <div className={`flex ${esMovil ? 'flex-col gap-3' : 'flex-col sm:flex-row sm:items-center justify-between gap-4'}`}>
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-sky-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Plan Alimenticio Inteligente
            </span>
            <h2 className={`${esMovil ? 'text-2xl' : 'text-2xl md:text-3xl'} font-black text-white mt-0.5`}>
              Mi Dieta y Equivalencias
            </h2>
            <p className="text-xs text-indigo-300/80 mt-0.5">
              Toca cualquier comida para abrir su ficha completa, método de preparación y medidas
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMostrandoListaCompras(true)}
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Lista de Compras
            </button>
            <button
              onClick={() => setMostrandoTablaMaestra(!mostrandoTablaMaestra)}
              className="flex items-center gap-1.5 bg-indigo-950/90 hover:bg-indigo-900 border border-sky-400/30 text-sky-300 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" /> Tabla y Medidas
            </button>
            <button
              onClick={() => setMostrandoNuevaComida(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-sky-500 hover:brightness-110 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-violet-600/25"
            >
              <Plus className="w-4 h-4" /> Comida
            </button>
          </div>
        </div>

        {/* Tarjetas de Macros Totales del Día */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#090814]/85 border border-orange-500/30 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-orange-300 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3" /> Total Diario
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {Math.round(totalesDia.kcal)} <span className="text-xs text-slate-400">kcal</span>
            </p>
          </div>
          <div className="bg-[#090814]/85 border border-sky-500/30 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-sky-300 uppercase">Proteína</span>
            <p className="text-xl font-black text-sky-300 mt-0.5">{Math.round(totalesDia.prot)} g</p>
          </div>
          <div className="bg-[#090814]/85 border border-violet-500/30 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-violet-300 uppercase">Carbohidratos</span>
            <p className="text-xl font-black text-violet-300 mt-0.5">{Math.round(totalesDia.carb)} g</p>
          </div>
          <div className="bg-[#090814]/85 border border-emerald-500/30 p-3.5 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-300 uppercase">Grasas</span>
            <p className="text-xl font-black text-emerald-300 mt-0.5">{Math.round(totalesDia.gras)} g</p>
          </div>
        </div>
      </div>

      {/* TABLA MAESTRA DE EQUIVALENCIAS Y CONVERSOR DE KILOS / LITROS / COCIDO */}
      {mostrandoTablaMaestra && (
        <div className="bg-[#100e22] border border-sky-400/35 rounded-3xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Conversor de Medidas y Tabla de Equivalencias</h3>
              <p className="text-[11px] text-slate-400">
                Kilos, litros, tazas, piezas y equivalencia Crudo ↔ Cocido
              </p>
            </div>
            <button onClick={() => setMostrandoTablaMaestra(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversor Rápido */}
          <div className="bg-[#080712] border border-violet-500/30 p-4 rounded-2xl space-y-3">
            <span className="text-[11px] font-extrabold text-violet-300 uppercase flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-400" /> Calculadora Rápida de Cocina
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                step="0.01"
                value={convValor}
                onChange={(e) => setConvValor(e.target.value)}
                className="w-full sm:w-28 bg-[#100e22] border border-indigo-500/30 rounded-xl px-3 py-2 text-sm text-white font-black"
              />
              <select
                value={convTipo}
                onChange={(e) => setConvTipo(e.target.value)}
                className="flex-1 bg-[#100e22] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white font-bold"
              >
                <option value="kg_a_g">Kilogramos (kg) → Gramos (g)</option>
                <option value="g_a_kg">Gramos (g) → Kilogramos (kg)</option>
                <option value="L_a_ml">Litros (L) → Mililitros y Tazas</option>
                <option value="tazas_a_ml">Tazas (240 ml) → Mililitros y Litros</option>
                <option value="pollo_crudo_cocido">Pollo/Carne en Crudo (g) → Peso ya Cocido (g)</option>
                <option value="arroz_cocido_crudo">Arroz/Pasta ya Cocido (g) → Peso en Crudo/Seco (g)</option>
              </select>
            </div>
            <p className="text-sm font-black text-emerald-400">{resultadoConversor()}</p>
          </div>

          {/* Filtros de tabla por grupo */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'proteina', label: 'Proteínas (Crudo)' },
              { id: 'carbohidrato', label: 'Carbohidratos (Cocido)' },
              { id: 'grasa', label: 'Grasas Saludables' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGrupoTabla(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                  grupoTabla === tab.id
                    ? 'bg-sky-500 text-slate-950 font-black'
                    : 'bg-[#080712] text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-indigo-500/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-indigo-950/90 text-[10px] uppercase font-extrabold text-indigo-200">
                  <th className="py-2.5 px-3">Alimento</th>
                  <th className="py-2.5 px-3">Medida Casera / Cocción</th>
                  <th className="py-2.5 px-3">Kcal</th>
                  <th className="py-2.5 px-3">Prot</th>
                  <th className="py-2.5 px-3">Carb</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-500/15">
                {CATALOGO_ALIMENTOS.filter((a) => a.grupo === grupoTabla).map((al) => (
                  <tr key={al.id} className="bg-[#080712]/70 text-slate-200">
                    <td className="py-2.5 px-3">
                      <span className="font-bold block">{al.nombre}</span>
                      <span className="text-[10px] text-violet-300">{al.estado}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300">{al.notaCoccion}</td>
                    <td className="py-2.5 px-3 font-mono">{al.kcal100}</td>
                    <td className="py-2.5 px-3 font-mono text-sky-300 font-bold">{al.prot100}g</td>
                    <td className="py-2.5 px-3 font-mono text-violet-300 font-bold">{al.carb100}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HIDRATACIÓN Y SUPLEMENTOS */}
      <div className={`grid ${esMovil ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-5'}`}>
        <div className="bg-[#100e22] border border-sky-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-sky-400 uppercase">
                <Droplets className="w-4 h-4" /> Hidratación Diaria
              </span>
              <h3 className="text-lg font-black text-white">
                {plan.vasosTomadosHoy} / {plan.metaAguaVasos} Vasos ({(plan.vasosTomadosHoy * 0.25).toFixed(2)} L)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Meta:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={plan.metaAguaVasos}
                onChange={(e) => cambiarMetaAgua(e.target.value)}
                className="w-12 bg-[#080712] border border-sky-500/30 rounded-lg px-2 py-1 text-center text-white font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: plan.metaAguaVasos }).map((_, idx) => {
              const lleno = idx < plan.vasosTomadosHoy;
              return (
                <button
                  key={idx}
                  onClick={() =>
                    setPlan((prev) => ({
                      ...prev,
                      fechaAgua: hoyISO,
                      vasosTomadosHoy: lleno && idx === prev.vasosTomadosHoy - 1 ? idx : idx + 1,
                    }))
                  }
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                    lleno
                      ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md shadow-sky-500/30 font-black'
                      : 'bg-[#080712] text-slate-500 border-indigo-500/20 hover:border-sky-400/50'
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#100e22] border border-violet-500/30 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-violet-400 uppercase">
              <Pill className="w-4 h-4" /> Vitaminas y Suplementos
            </span>
            <span className="text-[11px] text-slate-400 font-bold">
              {plan.suplementos.filter((s) => s.tomado).length}/{plan.suplementos.length} tomados
            </span>
          </div>

          <div className="space-y-2">
            {plan.suplementos.map((sup) => (
              <div
                key={sup.id}
                className="flex items-center justify-between bg-[#080712] border border-indigo-500/20 px-3.5 py-2.5 rounded-2xl"
              >
                <button
                  onClick={() => toggleSuplemento(sup.id)}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                      sup.tomado
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-indigo-500/40 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${sup.tomado ? 'line-through text-slate-500' : 'text-white'}`}>
                      {sup.nombre}
                    </p>
                    <p className="text-[10px] text-violet-300/80">{sup.hora}</p>
                  </div>
                </button>
                <button
                  onClick={() => eliminarSuplemento(sup.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={agregarSuplemento} className="flex gap-2">
            <input
              type="text"
              value={nuevoSupNombre}
              onChange={(e) => setNuevoSupNombre(e.target.value)}
              placeholder="Ej. Vitamina D3, Magnesio..."
              className="flex-1 bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={nuevoSupHora}
              onChange={(e) => setNuevoSupHora(e.target.value)}
              placeholder="Hora"
              className="w-24 bg-[#080712] border border-indigo-500/30 rounded-xl px-2.5 py-2 text-xs text-violet-200"
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-xl text-xs font-black"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* LISTADO DE COMIDAS DEL DÍA (AL HACER CLIC SE ABRE SU FICHA COMPLETA) */}
      <div className="space-y-4">
        {plan.comidas.map((comida) => {
          const kcalComida = comida.alimentos.reduce((acc, it) => {
            const al = getAlimento(it.alimentoId);
            return acc + (al.kcal100 * it.gramos) / 100;
          }, 0);

          return (
            <div
              key={comida.id}
              className="bg-[#100e22] border border-indigo-500/25 hover:border-sky-400/50 rounded-3xl p-5 space-y-4 shadow-xl transition-all"
            >
              {/* Encabezado clickeable para abrir la Ficha de la Comida */}
              <div className="flex items-start justify-between gap-2 border-b border-indigo-500/15 pb-3">
                <div
                  onClick={() => setComidaFichaId(comida.id)}
                  className="cursor-pointer group flex-1"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-sky-400" /> {comida.nombre}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-950 text-sky-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> {comida.hora}
                    </span>
                    <span className="text-[11px] font-black text-orange-400">
                      {Math.round(kcalComida)} kcal
                    </span>
                  </div>
                  {comida.nota && (
                    <p className="text-[11px] text-amber-300/90 mt-1 flex items-center gap-1">
                      <Info className="w-3 h-3 shrink-0" /> {comida.nota}
                    </p>
                  )}
                  {comida.preparacion && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
                      <ChefHat className="w-3 h-3 text-violet-400 shrink-0" /> {comida.preparacion}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setComidaFichaId(comida.id)}
                    className="flex items-center gap-1 bg-violet-500/20 hover:bg-violet-500/35 text-violet-200 border border-violet-400/30 px-2.5 py-1.5 rounded-xl text-[11px] font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ficha
                  </button>
                  <button
                    onClick={() => {
                      setComidaAgregando(comida.id);
                      setUnidadEntrada('g');
                      setCantidadEntrada('140');
                    }}
                    className="flex items-center gap-1 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 px-2.5 py-1.5 rounded-xl text-[11px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Alimento
                  </button>
                </div>
              </div>

              {/* Alimentos dentro de esta comida */}
              <div className="space-y-2.5">
                {comida.alimentos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Sin alimentos aún. Toca "+ Alimento".</p>
                ) : (
                  comida.alimentos.map((item) => {
                    const al = getAlimento(item.alimentoId);
                    const kcalItem = Math.round((al.kcal100 * item.gramos) / 100);
                    const protItem = Math.round((al.prot100 * item.gramos) / 100);
                    const carbItem = Math.round((al.carb100 * item.gramos) / 100);
                    const medidas = obtenerMedidasPracticas(al, item.gramos);

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#080712] border border-indigo-500/20 p-3.5 rounded-2xl"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-black text-white">
                              {item.gramos} g
                            </span>
                            <span className="text-sm font-bold text-indigo-100">{al.nombre}</span>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              {al.estado}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300/90 font-semibold">
                            {medidas.casera} • {medidas.metrico} {medidas.coccion && `• ${medidas.coccion}`}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {kcalItem} kcal • <strong className="text-sky-300">{protItem}g P</strong> •{' '}
                            <strong className="text-violet-300">{carbItem}g C</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => setIntercambioActivo({ comidaId: comida.id, item })}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600/30 to-sky-500/30 hover:from-violet-600 hover:to-sky-500 text-sky-200 hover:text-white border border-sky-400/40 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" /> Cambiar / Equivalente
                          </button>
                          <button
                            onClick={() => eliminarAlimento(comida.id, item.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FICHA DETALLADA DE LA COMIDA SELECCIONADA (CON PREPARACIÓN, OBSERVACIONES Y MEDIDAS) */}
      {comidaFichaActual && (() => {
        const resumenComida = comidaFichaActual.alimentos.reduce(
          (acc, it) => {
            const al = getAlimento(it.alimentoId);
            const f = it.gramos / 100;
            acc.kcal += al.kcal100 * f;
            acc.prot += al.prot100 * f;
            acc.carb += al.carb100 * f;
            acc.gras += al.gras100 * f;
            return acc;
          },
          { kcal: 0, prot: 0, carb: 0, gras: 0 }
        );

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#110e24] border border-sky-400/40 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-indigo-500/20 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                    Ficha de Tiempo de Comida
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-violet-400" /> {comidaFichaActual.nombre}
                  </h3>
                  <p className="text-xs text-indigo-300 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" /> Horario: {comidaFichaActual.hora}
                  </p>
                </div>
                <button
                  onClick={() => setComidaFichaId(null)}
                  className="p-1.5 rounded-xl bg-indigo-950 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resumen nutricional exclusivo de esta comida */}
              <div className="grid grid-cols-4 gap-2 bg-[#080712] border border-indigo-500/25 p-3 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">CALORÍAS</span>
                  <span className="text-sm font-black text-orange-400">{Math.round(resumenComida.kcal)} kcal</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">PROTEÍNA</span>
                  <span className="text-sm font-black text-sky-300">{Math.round(resumenComida.prot)} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">CARBOS</span>
                  <span className="text-sm font-black text-violet-300">{Math.round(resumenComida.carb)} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">GRASAS</span>
                  <span className="text-sm font-black text-emerald-300">{Math.round(resumenComida.gras)} g</span>
                </div>
              </div>

              {/* Desglose de alimentos con equivalencias en piezas, tazas, kg/L y cocido */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-200">
                  Alimentos y Medidas Exactas
                </h4>
                {comidaFichaActual.alimentos.map((item) => {
                  const al = getAlimento(item.alimentoId);
                  const medidas = obtenerMedidasPracticas(al, item.gramos);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#080712] border border-indigo-500/20 p-3.5 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white">
                          {item.gramos} g de {al.nombre}{' '}
                          <span className="text-[10px] font-bold text-violet-300">({al.estado})</span>
                        </p>
                        <p className="text-xs text-emerald-300 font-semibold">
                          {medidas.casera} • {medidas.metrico}
                        </p>
                        {medidas.coccion && (
                          <p className="text-[11px] text-amber-300/90">{medidas.coccion}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setIntercambioActivo({ comidaId: comidaFichaActual.id, item })}
                        className="shrink-0 flex items-center gap-1 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 px-3 py-2 rounded-xl text-[11px] font-black transition-all"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" /> Cambiar
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Observaciones y Método de Preparación Editables */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5" /> Observaciones / Recordatorio clave
                  </label>
                  <input
                    type="text"
                    value={comidaFichaActual.nota || ''}
                    onChange={(e) => actualizarCampoComida(comidaFichaActual.id, 'nota', e.target.value)}
                    placeholder="Ej. Pesar en crudo, tomar 1 vaso de agua antes..."
                    className="w-full bg-[#080712] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-violet-300 flex items-center gap-1.5 mb-1">
                    <ChefHat className="w-3.5 h-3.5 text-sky-400" /> Método de Preparación / Cómo comerlo
                  </label>
                  <textarea
                    rows={3}
                    value={comidaFichaActual.preparacion || ''}
                    onChange={(e) => actualizarCampoComida(comidaFichaActual.id, 'preparacion', e.target.value)}
                    placeholder="Escribe aquí cómo prepararlo (ej. a la plancha, al vapor, especias permitidas, orden de ingesta...)"
                    className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => eliminarComida(comidaFichaActual.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-2"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar comida
                </button>
                <button
                  onClick={() => setComidaFichaId(null)}
                  className="bg-gradient-to-r from-violet-600 to-sky-500 text-white font-black px-6 py-2.5 rounded-2xl text-xs shadow-lg"
                >
                  Listo / Guardar Ficha
                </button>
              </div>
            </div>
          </div>
        );
      })()}


      {/* MODAL TICKET DE LISTA DE COMPRAS AGRUPADA */}
      {mostrandoListaCompras && (() => {
        const resumenCompras = generarResumenCompras(plan.comidas, diasCompra);
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#110e24] border border-emerald-400/40 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-start justify-between border-b border-indigo-500/20 pb-3.5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    AIRYFIT • TICKET DE SUPERMERCADO
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-sky-400" /> Lista de Compras Total
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ingredientes repetidos sumados automáticamente y convertidos a peso de compra
                  </p>
                </div>
                <button
                  onClick={() => setMostrandoListaCompras(false)}
                  className="p-1.5 rounded-xl bg-indigo-950 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selector de Periodo: Diario / Semanal / Quincenal / Mensual */}
              <div className="grid grid-cols-4 gap-2 bg-[#080712] p-1.5 rounded-2xl border border-indigo-500/25">
                {[
                  { d: 1, label: "1 Día" },
                  { d: 7, label: "Semanal (7d)" },
                  { d: 15, label: "15 Días" },
                  { d: 30, label: "Mensual (30d)" },
                ].map((op) => (
                  <button
                    key={op.d}
                    onClick={() => setDiasCompra(op.d)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      diasCompra === op.d
                        ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              {/* Vista previa estilo Ticket */}
              <div className="flex-1 overflow-y-auto bg-[#080712] border-2 border-dashed border-indigo-500/35 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-dashed border-slate-700 pb-2 text-[11px] font-mono text-sky-300">
                  <span>AIRYFIT STUDIO • {diasCompra} {diasCompra === 1 ? "DÍA" : "DÍAS"}</span>
                  <span>{resumenCompras.length} PRODUCTOS</span>
                </div>

                {resumenCompras.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    Agrega alimentos a tus comidas para generar tu ticket de compras.
                  </p>
                ) : (
                  resumenCompras.map((item) => (
                    <div
                      key={item.alimentoId}
                      className="flex items-start justify-between gap-3 border-b border-indigo-500/15 pb-2.5 last:border-none"
                    >
                      <div>
                        <p className="text-xs font-black text-white">{item.nombre}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.detalleUnidades} • {item.notaCompra}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-400 block">
                          {item.cantidadPrincipal}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({item.gramosDiarios}g/día)
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() =>
                  descargarTicketComprasPNG(resumenCompras, diasCompra, perfil?.nombre || "Atleta")
                }
                disabled={resumenCompras.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-600 hover:brightness-110 disabled:opacity-40 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Descargar Ticket de Compras en Imagen (PNG)
              </button>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE INTERCAMBIO INTELIGENTE DE EQUIVALENCIAS */}
      {intercambioActivo && (() => {
        const alimentoActual = getAlimento(intercambioActivo.item.alimentoId);
        const gramosActuales = intercambioActivo.item.gramos;
        const opcionesEquivalentes = CATALOGO_ALIMENTOS.filter(
          (a) => a.grupo === alimentoActual.grupo && a.id !== alimentoActual.id
        );

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#110e24] border border-violet-500/40 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[88vh] flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                  Calculadora de Equivalencia Exacta
                </span>
                <button onClick={() => setIntercambioActivo(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#080712] border border-indigo-500/30 p-3.5 rounded-2xl">
                <p className="text-[11px] text-slate-400">Alimento original en tu dieta:</p>
                <p className="text-sm font-black text-white mt-0.5">
                  {gramosActuales} g de {alimentoActual.nombre}{' '}
                  <span className="text-xs font-bold text-violet-300">({alimentoActual.estado})</span>
                </p>
              </div>

              <div className="overflow-y-auto space-y-2 pr-1 flex-1">
                {opcionesEquivalentes.map((opcion) => {
                  const grEq = calcularEquivalencia(alimentoActual, gramosActuales, opcion);
                  const medEq = obtenerMedidasPracticas(opcion, grEq);
                  return (
                    <button
                      key={opcion.id}
                      onClick={() =>
                        aplicarIntercambio(
                          intercambioActivo.comidaId,
                          intercambioActivo.item.id,
                          opcion.id,
                          grEq
                        )
                      }
                      className="w-full flex items-center justify-between bg-[#080712] hover:bg-indigo-950/70 border border-indigo-500/25 hover:border-sky-400 p-3.5 rounded-2xl text-left transition-all"
                    >
                      <div className="pr-2">
                        <p className="text-xs font-black text-white">{opcion.nombre}</p>
                        <span className="text-[10px] font-bold text-violet-300 block">
                          Pesar: {opcion.estado} • {medEq.casera}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-emerald-400">{grEq} g</span>
                        <span className="block text-[10px] text-slate-400">{medEq.metrico}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL PARA AGREGAR ALIMENTO CON SELECTOR DE UNIDAD (GRAMOS, KILOS, PIEZAS/TAZAS, LITROS) */}
      {comidaAgregando && (() => {
        const alSeleccionado = getAlimento(nuevoAlimentoId);
        const gramosCalculados = calcularGramosDesdeUnidad();
        const previewMedidas = obtenerMedidasPracticas(alSeleccionado, gramosCalculados);

        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <form
              onSubmit={agregarAlimentoAComida}
              className="bg-[#110e24] border border-violet-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                  Agregar Alimento y Medida
                </span>
                <button type="button" onClick={() => setComidaAgregando(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-indigo-300 block mb-1">Alimento</label>
                  <select
                    value={nuevoAlimentoId}
                    onChange={(e) => setNuevoAlimentoId(e.target.value)}
                    className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                  >
                    {CATALOGO_ALIMENTOS.map((al) => (
                      <option key={al.id} value={al.id}>
                        {al.nombre} ({al.estado})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-sky-300 block mb-1">Cantidad</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={cantidadEntrada}
                      onChange={(e) => setCantidadEntrada(e.target.value)}
                      className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-sm text-white font-black"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-violet-300 block mb-1">Unidad de medida</label>
                    <select
                      value={unidadEntrada}
                      onChange={(e) => setUnidadEntrada(e.target.value)}
                      className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                    >
                      <option value="g">Gramos (g) / ml</option>
                      <option value="casera">{alSeleccionado.unidadCasera}(s)</option>
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="L">Litros (L)</option>
                    </select>
                  </div>
                </div>

                {/* Vista previa de equivalencia automática */}
                <div className="bg-[#080712] border border-emerald-500/30 p-3 rounded-2xl text-xs space-y-1">
                  <p className="font-black text-emerald-400">
                    Equivale a: {gramosCalculados} g ({previewMedidas.casera})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {previewMedidas.metrico} {previewMedidas.coccion && `• ${previewMedidas.coccion}`}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white font-black py-3 rounded-2xl text-xs"
              >
                Añadir a la Comida
              </button>
            </form>
          </div>
        );
      })()}

      {/* MODAL PARA AGREGAR NUEVA COMIDA / SNACK */}
      {mostrandoNuevaComida && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form
            onSubmit={crearComida}
            className="bg-[#110e24] border border-violet-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-sky-400">
                Nueva Comida o Snack
              </span>
              <button type="button" onClick={() => setMostrandoNuevaComida(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-indigo-300 block mb-1">Nombre (ej. Colación, Pre-Entreno)</label>
                <input
                  type="text"
                  required
                  value={nombreNuevaComida}
                  onChange={(e) => setNombreNuevaComida(e.target.value)}
                  placeholder="Ej. Snack de media tarde"
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-sky-300 block mb-1">Hora sugerida</label>
                <input
                  type="text"
                  value={horaNuevaComida}
                  onChange={(e) => setHoraNuevaComida(e.target.value)}
                  placeholder="Ej. 04:30 PM"
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-300 block mb-1">Observación rápida</label>
                <input
                  type="text"
                  value={notaNuevaComida}
                  onChange={(e) => setNotaNuevaComida(e.target.value)}
                  placeholder="Ej. Pesar en crudo, tomar agua antes"
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-violet-300 block mb-1">Método de preparación</label>
                <textarea
                  rows={2}
                  value={prepNuevaComida}
                  onChange={(e) => setPrepNuevaComida(e.target.value)}
                  placeholder="Ej. Cocinar a la plancha sin aceite, sazonar con limón..."
                  className="w-full bg-[#080712] border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-sky-500 text-white font-black py-3 rounded-2xl text-xs"
            >
              Crear Comida
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
