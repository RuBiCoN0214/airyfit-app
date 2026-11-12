export const TEMAS_DISPONIBLES = [
  {
    id: 'neon',
    nombre: 'Neón Violeta',
    descripcion: 'Original oscuro y cielo',
    colores: ['#7c3aed', '#38bdf8', '#070612'],
  },
  {
    id: 'rosa',
    nombre: 'Fucsia Studio',
    descripcion: 'Magenta y rosa vibrante',
    colores: ['#ec4899', '#fb7185', '#160714'],
  },
  {
    id: 'verde',
    nombre: 'Esmeralda Pro',
    descripcion: 'Verde bosque y menta',
    colores: ['#10b981', '#2dd4bf', '#05140f'],
  },
  {
    id: 'blanco',
    nombre: 'Modo Blanco',
    descripcion: 'Limpio y luminoso',
    colores: ['#4f46e5', '#0ea5e9', '#f8fafc'],
  },
];

const THEME_KEY = 'airyfit_tema_visual_v1';

export const ThemeService = {
  obtenerTema() {
    try {
      return localStorage.getItem(THEME_KEY) || 'neon';
    } catch {
      return 'neon';
    }
  },
  aplicarTema(temaId) {
    const valido = TEMAS_DISPONIBLES.some((t) => t.id === temaId) ? temaId : 'neon';
    document.documentElement.setAttribute('data-tema', valido);
    try {
      localStorage.setItem(THEME_KEY, valido);
    } catch {}
    return valido;
  },
};
