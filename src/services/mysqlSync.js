const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api`;

export const MySQLService = {
  async obtenerPerfil(userId = 1) {
    try {
      const res = await fetch(`${API_URL}/perfil/${userId}`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async guardarPerfil(perfil, userId = 1) {
    try {
      await fetch(`${API_URL}/perfil/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });
    } catch {}
  },
  async obtenerDieta(userId = 1) {
    try {
      const res = await fetch(`${API_URL}/dieta/${userId}`);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async guardarDieta(planDieta, userId = 1) {
    try {
      await fetch(`${API_URL}/dieta/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planDieta),
      });
    } catch {}
  },
};
