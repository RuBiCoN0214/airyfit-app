import { CATALOGO_ALIMENTOS } from '../data/alimentosEquivalentes';

/**
 * Agrupa todos los ingredientes repetidos en todas las comidas del plan,
 * multiplica por `dias` (1, 7, 15, 30) y calcula cantidades reales para comprar en supermercado.
 */
export function generarResumenCompras(comidas, dias = 7) {
  const acumulado = {};

  comidas.forEach((comida) => {
    (comida.alimentos || []).forEach((item) => {
      if (!acumulado[item.alimentoId]) {
        acumulado[item.alimentoId] = 0;
      }
      acumulado[item.alimentoId] += Number(item.gramos) || 0;
    });
  });

  const ordenGrupos = { proteina: 1, carbohidrato: 2, grasa: 3, verdura: 4 };
  const etiquetasGrupo = {
    proteina: 'PROTEÍNAS Y CARNES',
    carbohidrato: 'CARBOHIDRATOS Y CEREALES',
    grasa: 'GRASAS SALUDABLES',
    verdura: 'VERDURAS Y FRESCOS',
  };

  const lista = Object.entries(acumulado)
    .map(([alimentoId, gramosDiarios]) => {
      const al = CATALOGO_ALIMENTOS.find((a) => a.id === alimentoId) || CATALOGO_ALIMENTOS[0];
      const gramosTotalesDieta = Math.round(gramosDiarios * dias);

      // Si en la dieta está "Ya cocido" (ej. arroz/pasta), calculamos cuánto comprar en crudo/seco
      let gramosCompra = gramosTotalesDieta;
      let notaCompra = al.estado;

      if (al.estado === 'Ya cocido' && al.factorCoccion && al.factorCoccion > 1) {
        gramosCompra = Math.round(gramosTotalesDieta / al.factorCoccion);
        notaCompra = `Comprar en seco/crudo (rinde ${gramosTotalesDieta.toLocaleString()}g cocido)`;
      }

      const kilos = (gramosCompra / 1000).toFixed(2);
      const cantidadPrincipal =
        al.estado === 'Líquido'
          ? `${(gramosCompra / 1000).toFixed(2)} L (${gramosCompra.toLocaleString()} ml)`
          : gramosCompra >= 1000
          ? `${kilos} kg (${gramosCompra.toLocaleString()} g)`
          : `${gramosCompra.toLocaleString()} g (${kilos} kg)`;

      // Equivalencia en piezas/unidades (ej. tortillas, huevos, latas de atún)
      const unidades = gramosTotalesDieta / (al.gramosPorUnidad || 100);
      const unidadesRed = unidades >= 10 ? Math.round(unidades) : Number(unidades.toFixed(1));
      const detalleUnidades = `≈ ${unidadesRed} ${al.unidadCasera}${unidadesRed !== 1 ? 's' : ''}`;

      return {
        alimentoId,
        nombre: al.nombre,
        grupo: al.grupo,
        grupoLabel: etiquetasGrupo[al.grupo] || 'OTROS',
        orden: ordenGrupos[al.grupo] || 9,
        gramosDiarios,
        gramosTotalesDieta,
        gramosCompra,
        cantidadPrincipal,
        detalleUnidades,
        notaCompra,
      };
    })
    .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre));

  return lista;
}

/**
 * Dibuja y descarga un Ticket de Supermercado en PNG de alta definición con el logo y estética de AiryFit
 */
export function descargarTicketComprasPNG(listaItems, dias = 7, nombreUsuario = 'Atleta') {
  const tituloPeriodo =
    dias === 1
      ? 'LISTA DIARIA (1 DÍA)'
      : dias === 7
      ? 'DESPENSA SEMANAL (7 DÍAS)'
      : dias === 15
      ? 'DESPENSA QUINCENAL (15 DÍAS)'
      : `DESPENSA MENSUAL (${dias} DÍAS)`;

  const alturaBase = 360;
  const alturaPorFila = 78;
  const canvasHeight = Math.max(680, alturaBase + listaItems.length * alturaPorFila + 140);

  const canvas = document.createElement('canvas');
  canvas.width = 860;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Fondo oscuro elegante AiryFit
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  bgGrad.addColorStop(0, '#090817');
  bgGrad.addColorStop(1, '#110e29');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 860, canvasHeight);

  // Tarjeta tipo Ticket central
  const tx = 48;
  const ty = 40;
  const tw = 764;
  const th = canvasHeight - 80;

  ctx.fillStyle = '#13102b';
  ctx.fillRect(tx, ty, tw, th);
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  ctx.strokeRect(tx, ty, tw, th);

  // Cabecera con Logo geométrico AiryFit
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(tx + 54, ty + 62, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#090817';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('AF', tx + 41, ty + 69);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('AIRYFIT', tx + 90, ty + 62);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('STUDIO GYM & NUTRITION', tx + 90, ty + 84);

  // Badge del periodo
  ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
  ctx.fillRect(tx + 36, ty + 115, tw - 72, 46);
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(tx + 36, ty + 115, tw - 72, 46);

  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText(`🛒 ${tituloPeriodo}`, tx + 54, ty + 145);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText(
    `Plan de: ${nombreUsuario}   •   Fecha: ${new Date().toLocaleDateString()}`,
    tx + 38,
    ty + 192
  );

  // Línea punteada de corte de ticket
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.beginPath();
  ctx.moveTo(tx + 30, ty + 215);
  ctx.lineTo(tx + tw - 30, ty + 215);
  ctx.stroke();
  ctx.setLineDash([]);

  // Listado de ingredientes sumados
  let cursorY = ty + 255;

  listaItems.forEach((item) => {
    // Cuadro de check de supermercado
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx + 40, cursorY - 16, 20, 20);

    // Nombre del ingrediente
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(item.nombre, tx + 74, cursorY);

    // Cantidad total a la derecha en verde esmeralda
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px sans-serif';
    const textoCant = item.cantidadPrincipal;
    const anchoCant = ctx.measureText(textoCant).width;
    ctx.fillText(textoCant, tx + tw - 42 - anchoCant, cursorY);

    // Subtexto con equivalencia en piezas/tazas y nota crudo/cocido
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    ctx.fillText(`${item.detalleUnidades}  •  ${item.notaCompra}`, tx + 74, cursorY + 24);

    // Separador sutil
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tx + 40, cursorY + 42);
    ctx.lineTo(tx + tw - 40, cursorY + 42);
    ctx.stroke();

    cursorY += alturaPorFila;
  });

  // Pie del ticket
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.beginPath();
  ctx.moveTo(tx + 30, canvasHeight - 95);
  ctx.lineTo(tx + tw - 30, canvasHeight - 95);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(
    `TOTAL: ${listaItems.length} INGREDIENTES AGRUPADOS  •  GENERADO CON AIRYFIT`,
    tx + 42,
    canvasHeight - 62
  );

  const link = document.createElement('a');
  link.download = `Ticket_Compras_AiryFit_${dias}dias.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
