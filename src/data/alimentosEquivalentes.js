// Base nutricional por cada 100 g + equivalencias caseras reales (piezas, tazas, cucharadas, ml) y factor crudo/cocido
export const CATALOGO_ALIMENTOS = [
  // PROTEÍNAS (Pesadas en CRUDO / Fresco)
  { id: 'pollo_pechuga', nombre: 'Pechuga de Pollo sin piel', grupo: 'proteina', estado: 'En crudo', kcal100: 120, prot100: 22.5, carb100: 0, gras100: 2.6, unidadCasera: 'filete mediano', gramosPorUnidad: 120, factorCoccion: 0.75, notaCoccion: '100g crudo ≈ 75g ya cocido' },
  { id: 'res_filete', nombre: 'Filete / Bistec de Res magro', grupo: 'proteina', estado: 'En crudo', kcal100: 135, prot100: 21.5, carb100: 0, gras100: 5.0, unidadCasera: 'bistec mediano', gramosPorUnidad: 130, factorCoccion: 0.72, notaCoccion: '100g crudo ≈ 72g ya asado' },
  { id: 'molida_res', nombre: 'Carne Molida de Res (95/5 magra)', grupo: 'proteina', estado: 'En crudo', kcal100: 137, prot100: 21.4, carb100: 0, gras100: 5.0, unidadCasera: 'taza medidora', gramosPorUnidad: 150, factorCoccion: 0.75, notaCoccion: '100g crudo ≈ 75g cocida' },
  { id: 'pescado_blanco', nombre: 'Filete de Pescado Blanco (Tilapia/Basa)', grupo: 'proteina', estado: 'En crudo', kcal100: 96, prot100: 20.1, carb100: 0, gras100: 1.7, unidadCasera: 'filete', gramosPorUnidad: 140, factorCoccion: 0.78, notaCoccion: '100g crudo ≈ 78g cocido' },
  { id: 'salmon', nombre: 'Filete de Salmón fresco', grupo: 'proteina', estado: 'En crudo', kcal100: 208, prot100: 20.0, carb100: 0, gras100: 13.0, unidadCasera: 'posta / filete', gramosPorUnidad: 150, factorCoccion: 0.80, notaCoccion: '100g crudo ≈ 80g cocido' },
  { id: 'camaron', nombre: 'Camarón limpio sin cáscara', grupo: 'proteina', estado: 'En crudo', kcal100: 85, prot100: 20.1, carb100: 0, gras100: 0.5, unidadCasera: 'taza', gramosPorUnidad: 145, factorCoccion: 0.75, notaCoccion: '100g crudo ≈ 75g cocido' },
  { id: 'atun_agua', nombre: 'Atún en agua (lata drenada)', grupo: 'proteina', estado: 'Drenado', kcal100: 116, prot100: 25.5, carb100: 0, gras100: 0.8, unidadCasera: 'lata drenada', gramosPorUnidad: 100, factorCoccion: 1, notaCoccion: 'Listo para consumir' },
  { id: 'claras_huevo', nombre: 'Claras de Huevo líquidas', grupo: 'proteina', estado: 'En crudo', kcal100: 52, prot100: 11.0, carb100: 0.7, gras100: 0.2, unidadCasera: 'clara de huevo', gramosPorUnidad: 33, factorCoccion: 0.90, notaCoccion: '1 clara ≈ 33g (3 claras ≈ 100g)' },
  { id: 'huevo_entero', nombre: 'Huevo Entero fresco', grupo: 'proteina', estado: 'En crudo', kcal100: 143, prot100: 12.6, carb100: 0.7, gras100: 9.5, unidadCasera: 'pieza', gramosPorUnidad: 55, factorCoccion: 0.92, notaCoccion: '1 pieza mediana sin cáscara ≈ 55g' },
  { id: 'panela', nombre: 'Queso Panela light / bajo en grasa', grupo: 'proteina', estado: 'Fresco', kcal100: 175, prot100: 18.0, carb100: 2.0, gras100: 10.5, unidadCasera: 'rebanada gruesa', gramosPorUnidad: 40, factorCoccion: 1, notaCoccion: 'Listo para consumir' },
  { id: 'yogurt_griego', nombre: 'Yogurt Griego natural sin azúcar', grupo: 'proteina', estado: 'Fresco', kcal100: 59, prot100: 10.3, carb100: 3.6, gras100: 0.4, unidadCasera: 'taza (240 ml)', gramosPorUnidad: 240, factorCoccion: 1, notaCoccion: '1 taza ≈ 240g / 0.24 L' },
  { id: 'whey_protein', nombre: 'Proteína Whey en polvo', grupo: 'proteina', estado: 'En seco', kcal100: 380, prot100: 78.0, carb100: 6.0, gras100: 4.5, unidadCasera: 'scoop (medida)', gramosPorUnidad: 32, factorCoccion: 1, notaCoccion: '1 scoop estándar ≈ 32g' },

  // CARBOHIDRATOS (Pesados YA COCIDOS o listos)
  { id: 'arroz_blanco', nombre: 'Arroz Blanco cocido', grupo: 'carbohidrato', estado: 'Ya cocido', kcal100: 130, prot100: 2.7, carb100: 28.2, gras100: 0.3, unidadCasera: 'taza cocida', gramosPorUnidad: 160, factorCoccion: 2.8, notaCoccion: '160g cocido (1 taza) ≈ 57g en crudo' },
  { id: 'arroz_integral', nombre: 'Arroz Integral cocido', grupo: 'carbohidrato', estado: 'Ya cocido', kcal100: 112, prot100: 2.3, carb100: 23.5, gras100: 0.8, unidadCasera: 'taza cocida', gramosPorUnidad: 165, factorCoccion: 2.7, notaCoccion: '165g cocido (1 taza) ≈ 60g en crudo' },
  { id: 'papa_cocida', nombre: 'Papa blanca / cambray cocida', grupo: 'carbohidrato', estado: 'Ya cocida', kcal100: 87, prot100: 1.9, carb100: 20.1, gras100: 0.1, unidadCasera: 'taza en cubos', gramosPorUnidad: 150, factorCoccion: 0.95, notaCoccion: '1 pieza mediana ≈ 150g' },
  { id: 'camote_cocido', nombre: 'Camote amarillo / morado cocido', grupo: 'carbohidrato', estado: 'Ya cocido', kcal100: 90, prot100: 2.0, carb100: 20.7, gras100: 0.1, unidadCasera: 'taza en puré/cubos', gramosPorUnidad: 160, factorCoccion: 0.95, notaCoccion: '1 taza cocida ≈ 160g' },
  { id: 'pasta_cocida', nombre: 'Pasta / Espagueti cocido', grupo: 'carbohidrato', estado: 'Ya cocido', kcal100: 131, prot100: 5.0, carb100: 25.0, gras100: 1.1, unidadCasera: 'taza cocida', gramosPorUnidad: 140, factorCoccion: 2.4, notaCoccion: '140g cocida (1 taza) ≈ 58g en seco' },
  { id: 'avena_cocida', nombre: 'Avena cocida en agua', grupo: 'carbohidrato', estado: 'Ya cocida', kcal100: 71, prot100: 2.5, carb100: 12.0, gras100: 1.5, unidadCasera: 'taza cocida', gramosPorUnidad: 230, factorCoccion: 2.5, notaCoccion: '1 taza cocida ≈ 230g' },
  { id: 'avena_cruda', nombre: 'Hojuelas de Avena (peso en seco)', grupo: 'carbohidrato', estado: 'En seco', kcal100: 379, prot100: 13.2, carb100: 67.7, gras100: 6.5, unidadCasera: 'taza en seco', gramosPorUnidad: 80, factorCoccion: 1, notaCoccion: '1/2 taza ≈ 40g • 1 taza ≈ 80g' },
  { id: 'tortilla_maiz', nombre: 'Tortilla de Maíz', grupo: 'carbohidrato', estado: 'Lista', kcal100: 218, prot100: 5.7, carb100: 44.6, gras100: 2.8, unidadCasera: 'pieza', gramosPorUnidad: 30, factorCoccion: 1, notaCoccion: '1 tortilla estándar ≈ 30g' },
  { id: 'tostada_horneada', nombre: 'Tostada de Maíz Horneada', grupo: 'carbohidrato', estado: 'Lista', kcal100: 360, prot100: 7.5, carb100: 75.0, gras100: 3.0, unidadCasera: 'pieza', gramosPorUnidad: 12, factorCoccion: 1, notaCoccion: '1 tostada horneada ≈ 12g' },
  { id: 'pan_integral', nombre: 'Pan Integral de caja', grupo: 'carbohidrato', estado: 'Listo', kcal100: 247, prot100: 12.0, carb100: 43.0, gras100: 3.4, unidadCasera: 'rebanada', gramosPorUnidad: 28, factorCoccion: 1, notaCoccion: '1 rebanada ≈ 28g' },
  { id: 'frijoles_cocidos', nombre: 'Frijoles cocidos sin grasa', grupo: 'carbohidrato', estado: 'Ya cocidos', kcal100: 132, prot100: 8.9, carb100: 23.7, gras100: 0.5, unidadCasera: 'taza cocida', gramosPorUnidad: 170, factorCoccion: 2.2, notaCoccion: '1/2 taza ≈ 85g • 1 taza ≈ 170g' },
  { id: 'platano', nombre: 'Plátano tabasco (sin cáscara)', grupo: 'carbohidrato', estado: 'Fresco', kcal100: 89, prot100: 1.1, carb100: 22.8, gras100: 0.3, unidadCasera: 'pieza mediana', gramosPorUnidad: 115, factorCoccion: 1, notaCoccion: '1 pieza sin cáscara ≈ 115g' },
  { id: 'frutos_rojos', nombre: 'Fresas / Moras / Frutos rojos', grupo: 'carbohidrato', estado: 'Frescos', kcal100: 35, prot100: 0.7, carb100: 8.0, gras100: 0.3, unidadCasera: 'taza', gramosPorUnidad: 150, factorCoccion: 1, notaCoccion: '1 taza ≈ 150g' },
  { id: 'leche_light', nombre: 'Leche Descremada / Light', grupo: 'carbohidrato', estado: 'Líquido', kcal100: 35, prot100: 3.4, carb100: 5.0, gras100: 0.2, unidadCasera: 'taza / vaso (240 ml)', gramosPorUnidad: 240, factorCoccion: 1, notaCoccion: '1 vaso = 240 ml = 0.24 L' },

  // GRASAS SALUDABLES
  { id: 'aguacate', nombre: 'Aguacate Hass (pulpa)', grupo: 'grasa', estado: 'Fresco', kcal100: 160, prot100: 2.0, carb100: 8.5, gras100: 14.7, unidadCasera: 'pieza chica (pulpa)', gramosPorUnidad: 100, factorCoccion: 1, notaCoccion: '1/3 aguacate ≈ 35g • 1/2 ≈ 50g' },
  { id: 'aceite_oliva', nombre: 'Aceite de Oliva Extra Virgen / Coco', grupo: 'grasa', estado: 'Líquido', kcal100: 884, prot100: 0, carb100: 0, gras100: 100.0, unidadCasera: 'cucharadita (5 ml)', gramosPorUnidad: 5, factorCoccion: 1, notaCoccion: '1 cdita = 5 ml • 1 cda sopera = 14 ml' },
  { id: 'almendras', nombre: 'Almendras / Nueces naturales', grupo: 'grasa', estado: 'En seco', kcal100: 579, prot100: 21.2, carb100: 21.6, gras100: 49.9, unidadCasera: 'pieza (almendra)', gramosPorUnidad: 1.2, factorCoccion: 1, notaCoccion: '10 almendras ≈ 12g • 1/4 taza ≈ 35g' },
  { id: 'crema_cacahuate', nombre: 'Crema de Cacahuate natural', grupo: 'grasa', estado: 'Lista', kcal100: 588, prot100: 25.0, carb100: 20.0, gras100: 50.0, unidadCasera: 'cucharada sopera', gramosPorUnidad: 15, factorCoccion: 1, notaCoccion: '1 cda sopera rasa ≈ 15g' },

  // VERDURAS LIBRES / FIBRA
  { id: 'verduras_mix', nombre: 'Verduras verdes (Brócoli/Espinaca/Calabaza)', grupo: 'verdura', estado: 'Al vapor / Cruda', kcal100: 32, prot100: 2.4, carb100: 6.0, gras100: 0.3, unidadCasera: 'taza picada', gramosPorUnidad: 90, factorCoccion: 0.9, notaCoccion: '1 taza picada ≈ 90g' },
];

export function calcularEquivalencia(alimentoOrigen, gramosOrigen, alimentoDestino) {
  if (!alimentoOrigen || !alimentoDestino || !gramosOrigen) return 0;

  let macroOrigen100 = alimentoOrigen.kcal100;
  let macroDestino100 = alimentoDestino.kcal100;

  if (alimentoOrigen.grupo === 'proteina' && alimentoDestino.grupo === 'proteina') {
    macroOrigen100 = alimentoOrigen.prot100;
    macroDestino100 = alimentoDestino.prot100;
  } else if (alimentoOrigen.grupo === 'carbohidrato' && alimentoDestino.grupo === 'carbohidrato') {
    macroOrigen100 = alimentoOrigen.carb100;
    macroDestino100 = alimentoDestino.carb100;
  } else if (alimentoOrigen.grupo === 'grasa' && alimentoDestino.grupo === 'grasa') {
    macroOrigen100 = alimentoOrigen.gras100;
    macroDestino100 = alimentoDestino.gras100;
  }

  if (!macroDestino100 || macroDestino100 <= 0) return gramosOrigen;
  const gramosEquivalentes = (Number(gramosOrigen) * macroOrigen100) / macroDestino100;
  return Math.round(gramosEquivalentes);
}

/**
 * Formatea equivalencias prácticas (piezas, tazas, kilos, litros y rendimiento cocido/crudo)
 */
export function obtenerMedidasPracticas(alimento, gramos) {
  const gr = Number(gramos) || 0;
  if (!alimento || gr <= 0) return { casera: '', metrico: '', coccion: '' };

  // 1. Medida casera (piezas, tazas, cucharadas, scoops)
  const unidades = gr / (alimento.gramosPorUnidad || 100);
  const unidadesRedondeadas = unidades >= 10 ? Math.round(unidades) : Number(unidades.toFixed(1));
  const casera = `≈ ${unidadesRedondeadas} ${alimento.unidadCasera}${unidadesRedondeadas !== 1 ? 's' : ''}`;

  // 2. Conversión métrica (kg o litros si es líquido)
  let metrico = `${(gr / 1000).toFixed(3).replace(/\.?0+$/, '')} kg`;
  if (alimento.estado === 'Líquido') {
    metrico = `${gr} ml (${(gr / 1000).toFixed(2)} L)`;
  }

  // 3. Rendimiento Crudo <-> Cocido
  let coccion = '';
  if (alimento.estado === 'En crudo' && alimento.factorCoccion && alimento.factorCoccion !== 1) {
    coccion = `Ya cocido rinde ≈ ${Math.round(gr * alimento.factorCoccion)} g`;
  } else if (alimento.estado === 'Ya cocido' && alimento.factorCoccion && alimento.factorCoccion > 1) {
    coccion = `En crudo/seco equivale a ≈ ${Math.round(gr / alimento.factorCoccion)} g`;
  }

  return { casera, metrico, coccion };
}

export const PLAN_DIETA_INICIAL = {
  metaAguaVasos: 8,
  vasosTomadosHoy: 3,
  fechaAgua: '',
  suplementos: [
    { id: 'sup_1', nombre: 'Creatina Monohidratada (5g)', hora: 'Post-entreno', tomado: false },
    { id: 'sup_2', nombre: 'Omega 3 + Multivitamínico', hora: '09:00 AM (Con desayuno)', tomado: false },
  ],
  comidas: [
    {
      id: 'com_1',
      nombre: 'Desayuno',
      hora: '08:30 AM',
      nota: 'Pesar proteína en crudo antes de cocinar',
      preparacion: 'Asar la pechuga a la plancha con ajo en polvo, pimienta y limón (sin aceite). Calentar las tortillas en comal y servir con el aguacate en rebanadas.',
      alimentos: [
        { id: 'item_1', alimentoId: 'pollo_pechuga', gramos: 140 },
        { id: 'item_2', alimentoId: 'tortilla_maiz', gramos: 60 },
        { id: 'item_3', alimentoId: 'aguacate', gramos: 40 },
      ],
    },
    {
      id: 'com_2',
      nombre: 'Comida Principal',
      hora: '02:30 PM',
      nota: 'Arroz pesado ya cocido',
      preparacion: 'Sellar el filete de res a término medio con sal de mar. Medir 1 taza de arroz blanco ya cocido y acompañar con verduras al vapor.',
      alimentos: [
        { id: 'item_4', alimentoId: 'res_filete', gramos: 150 },
        { id: 'item_5', alimentoId: 'arroz_blanco', gramos: 160 },
        { id: 'item_6', alimentoId: 'verduras_mix', gramos: 120 },
      ],
    },
    {
      id: 'com_3',
      nombre: 'Snack / Pre-Entreno',
      hora: '05:30 PM',
      nota: 'Consumir 45 min antes de entrenar',
      preparacion: 'Rebanar el plátano y untar la cucharada de crema de cacahuate natural encima. Opcional: agregar canela en polvo.',
      alimentos: [
        { id: 'item_7', alimentoId: 'platano', gramos: 115 },
        { id: 'item_8', alimentoId: 'crema_cacahuate', gramos: 15 },
      ],
    },
    {
      id: 'com_4',
      nombre: 'Cena Ligera',
      hora: '09:00 PM',
      nota: 'Drenar bien el agua del atún',
      preparacion: 'Mezclar el atún drenado con pico de gallo y limón. Acompañar con papa cambray cocida al vapor o en airfryer.',
      alimentos: [
        { id: 'item_9', alimentoId: 'atun_agua', gramos: 120 },
        { id: 'item_10', alimentoId: 'papa_cocida', gramos: 150 },
      ],
    },
  ],
};
