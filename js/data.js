// ============ ASIANSECRET — datos ============
// Acá NO hay texto visible: sólo identificadores y números. Todo lo que se
// lee en pantalla vive en language/*.js, para poder traducir sin tocar esto.
// video: enlace de YouTube de la receta, opcional. Acepta el link entero
// pegado del navegador o solo el id — la app extrae lo que necesita. La
// receta que no lo tenga simplemente no muestra el reproductor.
//   { id: "mapo_tofu", video: "https://youtu.be/AbCdEfGhIjK", ... }
//
// nat / fon: nombre en escritura original y pronunciación. Van acá y no en
// language/ porque 김치 es 김치 en todos los idiomas; duplicarlo por idioma
// sería mantener 83 cadenas idénticas cada vez que se suma una traducción.

// Secciones de la lista de compras.
const SECCIONES = ["proteina", "verdura", "seco", "salsa", "especia", "fresco", "reposteria"];

// Ingredientes: sección para agrupar la compra y si es de alacena (se tiene
// siempre en casa, no hace falta comprarlo cada vez).
const INGREDIENTES = {
  // --- proteínas ---
  pollo_pechuga:    { sec: "proteina" },
  pollo_muslo:      { sec: "proteina" },
  pollo_entero:     { sec: "proteina" },
  carne_vacuna:     { sec: "proteina" },
  carne_picada:     { sec: "proteina" },
  cerdo_panceta:    { sec: "proteina" },
  cerdo_lomo:       { sec: "proteina" },
  cerdo_picado:     { sec: "proteina" },
  kimchi_fermentado:{ sec: "verdura" },
  camaron:          { sec: "proteina" },
  cangrejo:         { sec: "proteina" },
  salmon:           { sec: "proteina" },
  tofu_firme:       { sec: "proteina" },
  tofu_sedoso:      { sec: "proteina" },
  huevo:            { sec: "proteina" },

  // --- verduras y frescos ---
  cebolla:          { sec: "verdura" },
  cebolla_verde:    { sec: "verdura" },
  ajo:              { sec: "verdura", alacena: true },
  jengibre:         { sec: "verdura", alacena: true },
  chile_fresco:     { sec: "verdura" },
  zanahoria:        { sec: "verdura" },
  pimiento:         { sec: "verdura" },
  brotes_soja:      { sec: "verdura" },
  pakboong:         { sec: "verdura" },
  repollo:          { sec: "verdura" },
  champinones:      { sec: "verdura" },
  hongos_shiitake:  { sec: "verdura" },
  pepino:           { sec: "verdura" },
  tomate:           { sec: "verdura" },
  espinaca:         { sec: "verdura" },
  brocoli:          { sec: "verdura" },
  choclo_grano:     { sec: "verdura" },
  bok_choy:         { sec: "verdura" },
  berenjena_thai:   { sec: "verdura" },
  cilantro:         { sec: "fresco" },
  albahaca_thai:    { sec: "fresco" },
  menta:            { sec: "fresco" },
  lima:             { sec: "fresco" },
  limoncillo:       { sec: "fresco" },
  galanga:          { sec: "fresco" },
  hoja_lima:        { sec: "fresco" },
  mango:            { sec: "fresco" },
  banana:           { sec: "fresco" },

  // --- secos ---
  fideos_arroz:     { sec: "seco" },
  fideos_trigo:     { sec: "seco" },
  fideos_huevo:     { sec: "seco" },
  fideos_vidrio:    { sec: "seco" },
  fideos_ramen:     { sec: "seco" },
  arroz_jazmin:     { sec: "seco", alacena: true },
  arroz_glutinoso:  { sec: "seco" },
  arroz_corto:      { sec: "seco" },
  harina:           { sec: "seco", alacena: true },
  maicena:          { sec: "seco", alacena: true },
  harina_arroz:     { sec: "seco" },
  panko:            { sec: "seco" },
  mani:             { sec: "seco" },
  sesamo_semillas:  { sec: "seco", alacena: true },
  alga_nori:        { sec: "seco" },
  wonton_tapas:     { sec: "seco" },

  // --- salsas y condimentos ---
  salsa_soja:       { sec: "salsa", alacena: true },
  salsa_soja_oscura:{ sec: "salsa", alacena: true },
  salsa_pescado:    { sec: "salsa", alacena: true },
  salsa_ostras:     { sec: "salsa", alacena: true },
  salsa_hoisin:     { sec: "salsa", alacena: true },
  aceite_sesamo:    { sec: "salsa", alacena: true },
  aceite_neutro:    { sec: "salsa", alacena: true },
  vinagre_arroz:    { sec: "salsa", alacena: true },
  vino_shaoxing:    { sec: "salsa", alacena: true },
  mirin:            { sec: "salsa", alacena: true },
  sriracha:         { sec: "salsa", alacena: true },
  pasta_miso:       { sec: "salsa", alacena: true },
  pasta_curry_rojo: { sec: "salsa", alacena: true },
  pasta_curry_verde:{ sec: "salsa", alacena: true },
  pasta_gochujang:  { sec: "salsa", alacena: true },
  leche_coco:       { sec: "salsa", alacena: true },
  tamarindo:        { sec: "salsa" },
  aceite_chile:     { sec: "salsa", alacena: true },
  caldo_pollo:      { sec: "salsa", alacena: true },

  // --- especias ---
  sal:              { sec: "especia", alacena: true },
  pimienta_negra:   { sec: "especia", alacena: true },
  azucar:           { sec: "especia", alacena: true },
  azucar_palma:     { sec: "especia", alacena: true },
  chile_seco:       { sec: "especia", alacena: true },
  cinco_especias:   { sec: "especia", alacena: true },
  pimienta_sichuan: { sec: "especia", alacena: true },
  curry_polvo:      { sec: "especia", alacena: true },
  comino:           { sec: "especia", alacena: true },
  cardamomo:        { sec: "especia" },
  anis_estrellado:  { sec: "especia" },
  canela:           { sec: "especia", alacena: true },
  cúrcuma:          { sec: "especia", alacena: true },

  pasta_curry_massaman: { sec: "salsa", alacena: true },
  pasta_curry_panang:   { sec: "salsa", alacena: true },
  salsa_soja_dulce:     { sec: "salsa", alacena: true },
  papa:                 { sec: "verdura" },
  papaya_verde:         { sec: "verdura" },
  porotos_largos:       { sec: "verdura" },
  lechuga:              { sec: "verdura" },
  cerdo_costilla:       { sec: "proteina" },
  arroz_tostado:        { sec: "seco" },

  cerdo_huesos:         { sec: "proteina" },
  pulpo:                { sec: "proteina" },
  jamon:                { sec: "proteina" },
  menma:                { sec: "verdura" },
  manzana:              { sec: "fresco" },
  jengibre_encurtido:   { sec: "fresco" },
  alga_kombu:           { sec: "seco", alacena: true },
  katsuobushi:          { sec: "seco" },
  polvo_hornear:        { sec: "seco", alacena: true },
  pasta_sesamo:         { sec: "salsa", alacena: true },
  salsa_okonomiyaki:    { sec: "salsa" },
  mayonesa_japonesa:    { sec: "salsa" },

  eomuk:                { sec: "proteina" },
  calamar:              { sec: "proteina" },
  costilla_vacuna:      { sec: "proteina" },
  col_china:            { sec: "verdura" },
  rabano_daikon:        { sec: "verdura" },
  danmuji:              { sec: "verdura" },
  camote:               { sec: "verdura" },
  calabacin:            { sec: "verdura" },
  pera_nashi:           { sec: "fresco" },
  hojas_sesamo:         { sec: "fresco" },
  azufaifa:             { sec: "fresco" },
  ginseng:              { sec: "fresco" },
  tteok:                { sec: "seco" },
  anchoas_secas:        { sec: "seco", alacena: true },
  porotos_soja:         { sec: "seco" },
  nueces:               { sec: "seco" },
  levadura:             { sec: "seco", alacena: true },
  gochugaru:            { sec: "especia", alacena: true },
  semillas_perilla:     { sec: "especia" },
  azucar_moreno:        { sec: "especia", alacena: true },
  ssamjang:             { sec: "salsa", alacena: true },
  chunjang:             { sec: "salsa" },

  // --- repostería ---
  leche:            { sec: "reposteria" },
  manteca:          { sec: "reposteria" },
  crema:            { sec: "reposteria" },
  azucar_impalpable:{ sec: "reposteria" },
  matcha:           { sec: "reposteria" },
  pasta_judia_roja: { sec: "reposteria" },
  harina_glutinosa: { sec: "reposteria" },
  levadura:         { sec: "reposteria" },
  vainilla:         { sec: "reposteria" },
};

// Categorías por las que se navega.
// Orden de aparición del selector de banderas. El archivo vive en
// assets/banderas/<id>.jpg — si falta, la bandera se oculta sola.
const PAISES = ['cn','kr','jp','th','vn','hk','my','sg','id'];

const CATEGORIAS = [
  { id: "fideos",     icono: "🍜" },
  { id: "pollo",      icono: "🍗" },
  { id: "carne",      icono: "🥩" },
  { id: "cerdo",      icono: "🐖" },
  { id: "mariscos",   icono: "🦐" },
  { id: "arroz",      icono: "🍚" },
  { id: "vegetariano",icono: "🥬" },
  { id: "sopas",      icono: "🥣" },
  { id: "reposteria", icono: "🍡" },
];

// i = id de ingrediente · c = cantidad · u = clave de unidad (u.g, u.ml, u.unidad…)
const r = (i, c, u) => ({ i, c, u });

// dif: 1 fácil · 2 media · 3 difícil   ·   min: minutos totales   ·   por: porciones
const RECETAS = [
  // ---------------- FIDEOS ----------------
  { id: "khao_soi", nat: "ข้าวซอย", fon: "khâo soi", cat: "fideos", pais: "th", dif: 2, min: 45, por: 4, pasos: 6, ing: [
    r("pollo_muslo", 600, "g"), r("fideos_huevo", 400, "g"), r("leche_coco", 800, "ml"),
    r("pasta_curry_rojo", 3, "cda"), r("curry_polvo", 1, "cda"), r("cúrcuma", 1, "cdta"),
    r("salsa_pescado", 3, "cda"), r("azucar_palma", 1, "cda"), r("cebolla_verde", 3, "unidad"),
    r("lima", 2, "unidad"), r("cilantro", 1, "puñado"), r("aceite_neutro", 2, "cda"),
  ]},
  { id: "chongqing_noodles", nat: "重庆小面", fon: "chóngqìng xiǎomiàn", cat: "fideos", pais: "cn", dif: 2, min: 30, por: 2, pasos: 9, ing: [
    r("fideos_trigo", 250, "g"), r("cerdo_picado", 200, "g"), r("aceite_chile", 3, "cda"),
    r("pimienta_sichuan", 1, "cdta"), r("salsa_soja", 2, "cda"), r("vinagre_arroz", 1, "cda"),
    r("ajo", 4, "diente"), r("cebolla_verde", 2, "unidad"), r("mani", 40, "g"),
    r("sesamo_semillas", 1, "cda"), r("azucar", 1, "cdta"),
  ]},
  { id: "pad_thai", nat: "ผัดไทย", fon: "phàt thai", cat: "fideos", pais: "th", dif: 2, min: 30, por: 2, pasos: 6, ing: [
    r("fideos_arroz", 200, "g"), r("camaron", 250, "g"), r("huevo", 2, "unidad"),
    r("tamarindo", 3, "cda"), r("salsa_pescado", 2, "cda"), r("azucar_palma", 2, "cda"),
    r("brotes_soja", 150, "g"), r("cebolla_verde", 3, "unidad"), r("mani", 50, "g"),
    r("lima", 1, "unidad"), r("aceite_neutro", 3, "cda"),
  ]},
  { id: "dan_dan", nat: "担担面", fon: "dàndàn miàn", cat: "fideos", pais: "cn", dif: 2, min: 35, por: 2, pasos: 9, ing: [
    r("fideos_trigo", 250, "g"), r("cerdo_picado", 250, "g"), r("pasta_gochujang", 1, "cda"),
    r("aceite_chile", 3, "cda"), r("pimienta_sichuan", 1, "cdta"), r("salsa_soja", 3, "cda"),
    r("vino_shaoxing", 1, "cda"), r("ajo", 3, "diente"), r("cebolla_verde", 2, "unidad"),
    r("mani", 30, "g"), r("caldo_pollo", 200, "ml"),
  ]},
  { id: "pho_bo", nat: "Phở bò", fon: "fuh baw", cat: "fideos", pais: "vn", dif: 3, min: 180, por: 4, pasos: 7, ing: [
    r("carne_vacuna", 500, "g"), r("fideos_arroz", 400, "g"), r("cebolla", 2, "unidad"),
    r("jengibre", 60, "g"), r("anis_estrellado", 4, "unidad"), r("canela", 1, "unidad"),
    r("cardamomo", 3, "unidad"), r("salsa_pescado", 4, "cda"), r("brotes_soja", 200, "g"),
    r("albahaca_thai", 1, "puñado"), r("lima", 2, "unidad"), r("menta", 1, "puñado"),
  ]},
  { id: "yakisoba", nat: "焼きそば", fon: "yakisoba", cat: "fideos", pais: "jp", dif: 1, min: 25, por: 2, pasos: 4, ing: [
    r("fideos_ramen", 300, "g"), r("cerdo_panceta", 200, "g"), r("repollo", 200, "g"),
    r("zanahoria", 1, "unidad"), r("cebolla", 1, "unidad"), r("salsa_ostras", 2, "cda"),
    r("salsa_soja", 2, "cda"), r("salsa_hoisin", 1, "cda"), r("aceite_neutro", 2, "cda"),
  ]},
  { id: "japchae", nat: "잡채", fon: "japchae", cat: "fideos", pais: "kr", dif: 2, min: 40, por: 4, pasos: 6, ing: [
    r("fideos_vidrio", 250, "g"), r("carne_vacuna", 200, "g"), r("espinaca", 200, "g"),
    r("zanahoria", 1, "unidad"), r("cebolla", 1, "unidad"), r("hongos_shiitake", 100, "g"),
    r("salsa_soja", 4, "cda"), r("aceite_sesamo", 2, "cda"), r("azucar", 2, "cda"),
    r("sesamo_semillas", 1, "cda"), r("ajo", 3, "diente"),
  ]},
  { id: "laksa", nat: "Laksa", fon: "lak-sa", cat: "fideos", pais: "my", dif: 3, min: 50, por: 4, pasos: 6, ing: [
    r("fideos_arroz", 300, "g"), r("camaron", 300, "g"), r("tofu_firme", 200, "g"),
    r("leche_coco", 600, "ml"), r("pasta_curry_rojo", 3, "cda"), r("limoncillo", 2, "unidad"),
    r("salsa_pescado", 2, "cda"), r("brotes_soja", 150, "g"), r("huevo", 2, "unidad"),
    r("lima", 1, "unidad"), r("cilantro", 1, "puñado"),
  ]},

  // ---------------- POLLO ----------------
  { id: "pollo_teriyaki", nat: "鶏の照り焼き", fon: "tori no teriyaki", cat: "pollo", pais: "jp", dif: 1, min: 25, por: 2, pasos: 4, ing: [
    r("pollo_muslo", 500, "g"), r("salsa_soja", 4, "cda"), r("mirin", 4, "cda"),
    r("azucar", 2, "cda"), r("jengibre", 20, "g"), r("aceite_neutro", 1, "cda"),
    r("sesamo_semillas", 1, "cda"), r("cebolla_verde", 2, "unidad"), r("arroz_jazmin", 300, "g"),
  ]},
  { id: "gai_pad_krapow", nat: "ไก่ผัดกะเพรา", fon: "kài phàt kaphrao", cat: "pollo", pais: "th", dif: 1, min: 20, por: 2, pasos: 4, ing: [
    r("pollo_muslo", 400, "g"), r("albahaca_thai", 2, "puñado"), r("ajo", 5, "diente"),
    r("chile_fresco", 4, "unidad"), r("salsa_pescado", 2, "cda"), r("salsa_ostras", 1, "cda"),
    r("salsa_soja_oscura", 1, "cdta"), r("azucar", 1, "cdta"), r("huevo", 2, "unidad"),
    r("arroz_jazmin", 300, "g"), r("aceite_neutro", 3, "cda"),
  ]},
  { id: "kung_pao", nat: "宫保鸡丁", fon: "gōngbǎo jīdīng", cat: "pollo", pais: "cn", dif: 2, min: 30, por: 2, pasos: 9, ing: [
    r("pollo_pechuga", 400, "g"), r("mani", 80, "g"), r("chile_seco", 8, "unidad"),
    r("pimienta_sichuan", 1, "cdta"), r("salsa_soja", 3, "cda"), r("vinagre_arroz", 2, "cda"),
    r("vino_shaoxing", 2, "cda"), r("azucar", 1, "cda"), r("maicena", 1, "cda"),
    r("ajo", 3, "diente"), r("cebolla_verde", 3, "unidad"),
  ]},
  { id: "karaage", nat: "唐揚げ", fon: "karaage", cat: "pollo", pais: "jp", dif: 2, min: 40, por: 4, pasos: 5, ing: [
    r("pollo_muslo", 700, "g"), r("salsa_soja", 3, "cda"), r("vino_shaoxing", 2, "cda"),
    r("jengibre", 30, "g"), r("ajo", 3, "diente"), r("maicena", 100, "g"),
    r("aceite_neutro", 500, "ml"), r("lima", 1, "unidad"),
  ]},
  { id: "hainanese_chicken", nat: "海南雞飯", fon: "hǎinán jīfàn", cat: "pollo", pais: "sg", dif: 3, min: 75, por: 4, pasos: 7, ing: [
    r("pollo_entero", 1500, "g"), r("arroz_jazmin", 400, "g"), r("jengibre", 80, "g"),
    r("ajo", 6, "diente"), r("cebolla_verde", 4, "unidad"), r("aceite_sesamo", 2, "cda"),
    r("salsa_soja", 3, "cda"), r("pepino", 1, "unidad"), r("sriracha", 3, "cda"),
    r("caldo_pollo", 500, "ml"),
  ]},
  { id: "dakgalbi", nat: "닭갈비", fon: "dakgalbi", cat: "pollo", pais: "kr", dif: 2, min: 35, por: 3, pasos: 5, ing: [
    r("pollo_muslo", 600, "g"), r("pasta_gochujang", 3, "cda"), r("salsa_soja", 2, "cda"),
    r("azucar", 1, "cda"), r("ajo", 4, "diente"), r("repollo", 250, "g"),
    r("zanahoria", 1, "unidad"), r("cebolla", 1, "unidad"), r("aceite_sesamo", 1, "cda"),
    r("sesamo_semillas", 1, "cda"), r("camote", 200, "g"), r("tteok", 200, "g"),
  ]},

  // ---------------- CARNE ----------------
  { id: "bulgogi", nat: "불고기", fon: "bulgogi", cat: "carne", pais: "kr", dif: 1, min: 40, por: 4, pasos: 5, ing: [
    r("carne_vacuna", 700, "g"), r("salsa_soja", 5, "cda"), r("azucar", 2, "cda"),
    r("aceite_sesamo", 2, "cda"), r("ajo", 5, "diente"), r("jengibre", 20, "g"),
    r("cebolla", 1, "unidad"), r("cebolla_verde", 3, "unidad"), r("sesamo_semillas", 1, "cda"),
    r("arroz_jazmin", 400, "g"),
  ]},
  { id: "mongolian_beef", nat: "蒙古牛肉", fon: "ménggǔ niúròu", cat: "carne", pais: "cn", dif: 2, min: 30, por: 3, pasos: 9, ing: [
    r("carne_vacuna", 500, "g"), r("maicena", 3, "cda"), r("salsa_soja", 4, "cda"),
    r("salsa_soja_oscura", 1, "cda"), r("azucar", 3, "cda"), r("ajo", 4, "diente"),
    r("jengibre", 25, "g"), r("cebolla_verde", 4, "unidad"), r("aceite_neutro", 4, "cda"),
  ]},
  { id: "rendang", nat: "Rendang", fon: "ren-dang", cat: "carne", pais: "id", dif: 3, min: 180, por: 6, pasos: 6, ing: [
    r("carne_vacuna", 1000, "g"), r("leche_coco", 800, "ml"), r("pasta_curry_rojo", 4, "cda"),
    r("limoncillo", 2, "unidad"), r("galanga", 40, "g"), r("hoja_lima", 4, "unidad"),
    r("cinco_especias", 1, "cdta"), r("azucar_palma", 2, "cda"), r("sal", 2, "cdta"),
    r("chile_seco", 6, "unidad"),
  ]},
  { id: "gyudon", nat: "牛丼", fon: "gyūdon", cat: "carne", pais: "jp", dif: 1, min: 25, por: 2, pasos: 4, ing: [
    r("carne_vacuna", 400, "g"), r("cebolla", 1, "unidad"), r("salsa_soja", 4, "cda"),
    r("mirin", 3, "cda"), r("azucar", 1, "cda"), r("caldo_pollo", 200, "ml"),
    r("huevo", 2, "unidad"), r("arroz_corto", 300, "g"), r("cebolla_verde", 2, "unidad"),
  ]},

  // ---------------- CERDO ----------------
  { id: "char_siu", nat: "叉烧", fon: "chāshāo", cat: "cerdo", pais: "cn", dif: 2, min: 90, por: 4, pasos: 9, ing: [
    r("cerdo_lomo", 800, "g"), r("salsa_hoisin", 4, "cda"), r("salsa_soja", 3, "cda"),
    r("miel", 3, "cda"), r("vino_shaoxing", 2, "cda"), r("cinco_especias", 1, "cdta"),
    r("ajo", 4, "diente"), r("aceite_sesamo", 1, "cda"),
  ]},
  { id: "tonkatsu", nat: "とんかつ", fon: "tonkatsu", cat: "cerdo", pais: "jp", dif: 2, min: 35, por: 2, pasos: 5, ing: [
    r("cerdo_lomo", 400, "g"), r("panko", 150, "g"), r("harina", 60, "g"),
    r("huevo", 2, "unidad"), r("aceite_neutro", 500, "ml"), r("repollo", 200, "g"),
    r("salsa_hoisin", 2, "cda"), r("arroz_corto", 300, "g"),
  ]},
  { id: "twice_cooked_pork", nat: "回锅肉", fon: "huíguō ròu", cat: "cerdo", pais: "cn", dif: 2, min: 45, por: 3, pasos: 9, ing: [
    r("cerdo_panceta", 500, "g"), r("pimiento", 2, "unidad"), r("cebolla_verde", 3, "unidad"),
    r("pasta_gochujang", 2, "cda"), r("salsa_soja", 2, "cda"), r("vino_shaoxing", 2, "cda"),
    r("ajo", 4, "diente"), r("jengibre", 20, "g"), r("azucar", 1, "cdta"),
  ]},

  // ---------------- MARISCOS ----------------
  { id: "tom_yum_goong", nat: "ต้มยำกุ้ง", fon: "tôm yam kûng", cat: "mariscos", pais: "th", dif: 2, min: 30, por: 4, pasos: 5, ing: [
    r("camaron", 500, "g"), r("limoncillo", 3, "unidad"), r("galanga", 40, "g"),
    r("hoja_lima", 6, "unidad"), r("champinones", 200, "g"), r("chile_fresco", 5, "unidad"),
    r("salsa_pescado", 4, "cda"), r("lima", 3, "unidad"), r("cilantro", 1, "puñado"),
    r("pasta_curry_rojo", 1, "cda"), r("caldo_pollo", 1000, "ml"),
  ]},
  { id: "chili_crab", nat: "辣椒螃蟹", fon: "làjiāo pángxiè", cat: "mariscos", pais: "sg", dif: 3, min: 45, por: 3, pasos: 6, ing: [
    r("cangrejo", 1200, "g"), r("tomate", 3, "unidad"), r("sriracha", 4, "cda"),
    r("salsa_soja", 2, "cda"), r("azucar", 2, "cda"), r("huevo", 2, "unidad"),
    r("ajo", 6, "diente"), r("jengibre", 30, "g"), r("maicena", 2, "cda"),
    r("cilantro", 1, "puñado"),
  ]},
  { id: "camarones_ajo_chile", nat: "蒜蓉辣椒虾", fon: "suànróng làjiāo xiā", cat: "mariscos", pais: "cn", dif: 1, min: 20, por: 2, pasos: 8, ing: [
    r("camaron", 400, "g"), r("ajo", 8, "diente"), r("chile_fresco", 3, "unidad"),
    r("salsa_soja", 2, "cda"), r("vino_shaoxing", 1, "cda"), r("aceite_sesamo", 1, "cdta"),
    r("cebolla_verde", 2, "unidad"), r("aceite_neutro", 3, "cda"),
  ]},

  { id: "salmon_teriyaki", nat: "鮭の照り焼き", fon: "sake no teriyaki", cat: "mariscos", pais: "jp", dif: 1, min: 20, por: 2, pasos: 4, ing: [
    r("salmon", 400, "g"), r("salsa_soja", 3, "cda"), r("mirin", 3, "cda"),
    r("azucar", 1, "cda"), r("jengibre", 15, "g"), r("sesamo_semillas", 1, "cda"),
    r("cebolla_verde", 2, "unidad"), r("arroz_corto", 300, "g"),
  ]},

  // ---------------- ARROZ ----------------
  { id: "arroz_yangzhou", nat: "扬州炒饭", fon: "yángzhōu chǎofàn", cat: "arroz", pais: "cn", dif: 1, min: 25, por: 3, pasos: 9, ing: [
    r("arroz_jazmin", 400, "g"), r("camaron", 200, "g"), r("huevo", 3, "unidad"),
    r("cerdo_lomo", 150, "g"), r("cebolla_verde", 3, "unidad"), r("salsa_soja", 3, "cda"),
    r("aceite_sesamo", 1, "cdta"), r("aceite_neutro", 3, "cda"), r("sal", 1, "cdta"),
  ]},
  { id: "bibimbap", nat: "비빔밥", fon: "bibimbap", cat: "arroz", pais: "kr", dif: 2, min: 45, por: 2, pasos: 6, ing: [
    r("arroz_corto", 300, "g"), r("carne_picada", 250, "g"), r("espinaca", 150, "g"),
    r("zanahoria", 1, "unidad"), r("champinones", 150, "g"), r("brotes_soja", 150, "g"),
    r("huevo", 2, "unidad"), r("pasta_gochujang", 3, "cda"), r("aceite_sesamo", 2, "cda"),
    r("sesamo_semillas", 1, "cda"), r("salsa_soja", 2, "cda"),
  ]},
  { id: "nasi_goreng", nat: "Nasi goreng", fon: "na-si go-reng", cat: "arroz", pais: "id", dif: 1, min: 25, por: 2, pasos: 5, ing: [
    r("arroz_jazmin", 350, "g"), r("pollo_muslo", 250, "g"), r("huevo", 2, "unidad"),
    r("salsa_soja_oscura", 2, "cda"), r("pasta_gochujang", 1, "cda"), r("ajo", 4, "diente"),
    r("cebolla", 1, "unidad"), r("pepino", 1, "unidad"), r("aceite_neutro", 3, "cda"),
  ]},
  { id: "katsudon", nat: "カツ丼", fon: "katsudon", cat: "arroz", pais: "jp", dif: 2, min: 40, por: 2, pasos: 6, ing: [
    r("cerdo_lomo", 350, "g"), r("panko", 120, "g"), r("harina", 50, "g"),
    r("huevo", 4, "unidad"), r("cebolla", 1, "unidad"), r("salsa_soja", 3, "cda"),
    r("mirin", 3, "cda"), r("caldo_pollo", 250, "ml"), r("arroz_corto", 300, "g"),
    r("aceite_neutro", 400, "ml"),
  ]},

  // ---------------- VEGETARIANO ----------------
  { id: "mapo_tofu", nat: "麻婆豆腐", fon: "mápó dòufu", cat: "vegetariano", pais: "cn", dif: 2, min: 25, por: 3, pasos: 10, ing: [
    r("tofu_sedoso", 500, "g"), r("hongos_shiitake", 150, "g"), r("pasta_gochujang", 2, "cda"),
    r("pimienta_sichuan", 1, "cdta"), r("salsa_soja", 2, "cda"), r("ajo", 4, "diente"),
    r("jengibre", 20, "g"), r("cebolla_verde", 3, "unidad"), r("maicena", 1, "cda"),
    r("caldo_pollo", 250, "ml"), r("aceite_chile", 2, "cda"),
  ]},
  { id: "curry_verde_verduras", nat: "แกงเขียวหวานผัก", fon: "kaeng khǐao wǎan phàk", cat: "vegetariano", pais: "th", dif: 1, min: 30, por: 4, pasos: 5, ing: [
    r("tofu_firme", 400, "g"), r("pasta_curry_verde", 3, "cda"), r("leche_coco", 800, "ml"),
    r("brocoli", 250, "g"), r("pimiento", 2, "unidad"), r("albahaca_thai", 1, "puñado"),
    r("salsa_pescado", 2, "cda"), r("azucar_palma", 1, "cda"), r("hoja_lima", 4, "unidad"),
    r("arroz_jazmin", 400, "g"),
  ]},
  { id: "pad_pak_boong", nat: "ผัดผักบุ้ง", fon: "phàt phàk bûng", cat: "vegetariano", pais: "th", dif: 1, min: 12, por: 2, pasos: 3, ing: [
    r("pakboong", 400, "g"), r("ajo", 5, "diente"), r("chile_fresco", 3, "unidad"),
    r("salsa_ostras", 2, "cda"), r("salsa_soja", 1, "cda"), r("azucar", 1, "cdta"),
    r("aceite_neutro", 2, "cda"),
  ]},

  // ---------------- SOPAS ----------------
  { id: "miso_shiru", nat: "味噌汁", fon: "misoshiru", cat: "sopas", pais: "jp", dif: 1, min: 15, por: 4, pasos: 4, ing: [
    r("pasta_miso", 4, "cda"), r("tofu_sedoso", 200, "g"), r("alga_nori", 10, "g"),
    r("cebolla_verde", 2, "unidad"), r("caldo_pollo", 1000, "ml"),
  ]},
  { id: "tom_kha_gai", nat: "ต้มข่าไก่", fon: "tôm khàa kài", cat: "sopas", pais: "th", dif: 2, min: 30, por: 4, pasos: 5, ing: [
    r("pollo_muslo", 400, "g"), r("leche_coco", 800, "ml"), r("galanga", 50, "g"),
    r("limoncillo", 3, "unidad"), r("hoja_lima", 6, "unidad"), r("champinones", 200, "g"),
    r("salsa_pescado", 3, "cda"), r("lima", 2, "unidad"), r("chile_fresco", 3, "unidad"),
    r("cilantro", 1, "puñado"),
  ]},
  { id: "wonton_soup", nat: "馄饨汤", fon: "húntun tāng", cat: "sopas", pais: "cn", dif: 3, min: 60, por: 4, pasos: 10, ing: [
    r("wonton_tapas", 300, "g"), r("cerdo_picado", 300, "g"), r("camaron", 150, "g"),
    r("jengibre", 20, "g"), r("cebolla_verde", 3, "unidad"), r("salsa_soja", 2, "cda"),
    r("aceite_sesamo", 1, "cda"), r("caldo_pollo", 1200, "ml"), r("espinaca", 100, "g"),
  ]},
  { id: "sopa_agripicante", nat: "酸辣汤", fon: "suānlà tāng", cat: "sopas", pais: "cn", dif: 2, min: 30, por: 4, pasos: 9, ing: [
    r("tofu_firme", 200, "g"), r("hongos_shiitake", 150, "g"), r("huevo", 2, "unidad"),
    r("vinagre_arroz", 4, "cda"), r("pimienta_negra", 1, "cdta"), r("salsa_soja", 3, "cda"),
    r("maicena", 3, "cda"), r("caldo_pollo", 1200, "ml"), r("aceite_chile", 1, "cda"),
    r("zanahoria", 1, "unidad"),
  ]},

  // ---------------- REPOSTERÍA ----------------
  { id: "mango_sticky_rice", nat: "ข้าวเหนียวมะม่วง", fon: "khâo nǐao mamûang", cat: "reposteria", pais: "th", dif: 1, min: 45, por: 4, pasos: 5, ing: [
    r("arroz_glutinoso", 300, "g"), r("leche_coco", 400, "ml"), r("azucar_palma", 80, "g"),
    r("sal", 1, "cdta"), r("mango", 2, "unidad"), r("sesamo_semillas", 1, "cda"),
  ]},
  { id: "mochi", nat: "餅", fon: "mochi", cat: "reposteria", pais: "jp", dif: 2, min: 50, por: 8, pasos: 5, ing: [
    r("harina_glutinosa", 200, "g"), r("azucar", 100, "g"), r("pasta_judia_roja", 200, "g"),
    r("maicena", 60, "g"), r("vainilla", 1, "cdta"),
  ]},
  { id: "dorayaki", nat: "どら焼き", fon: "dorayaki", cat: "reposteria", pais: "jp", dif: 2, min: 40, por: 6, pasos: 5, ing: [
    r("harina", 200, "g"), r("huevo", 3, "unidad"), r("azucar", 100, "g"),
    r("miel", 2, "cda"), r("levadura", 1, "cdta"), r("pasta_judia_roja", 250, "g"),
    r("leche", 60, "ml"),
  ]},
  { id: "egg_tarts", nat: "蛋撻", fon: "daan6 taat1", cat: "reposteria", pais: "hk", dif: 3, min: 70, por: 8, pasos: 6, ing: [
    r("harina", 250, "g"), r("manteca", 150, "g"), r("huevo", 4, "unidad"),
    r("azucar", 100, "g"), r("leche", 200, "ml"), r("crema", 100, "ml"),
    r("vainilla", 1, "cdta"),
  ]},
  { id: "matcha_cookies", nat: "抹茶クッキー", fon: "matcha kukkī", cat: "reposteria", pais: "jp", dif: 1, min: 35, por: 12, pasos: 4, ing: [
    r("harina", 250, "g"), r("manteca", 150, "g"), r("azucar_impalpable", 90, "g"),
    r("matcha", 2, "cda"), r("huevo", 1, "unidad"), r("sal", 1, "cdta"),
  ]},
  { id: "banana_roti", nat: "โรตีกล้วย", fon: "rotii klûai", cat: "reposteria", pais: "th", dif: 2, min: 30, por: 4, pasos: 5, ing: [
    r("harina", 250, "g"), r("huevo", 2, "unidad"), r("banana", 3, "unidad"),
    r("manteca", 60, "g"), r("leche", 100, "ml"), r("azucar", 3, "cda"),
    r("leche_coco", 100, "ml"),
  ]},
  // ---------------- TAILANDIA ----------------
  { id: "gaeng_keow_wan", nat: "แกงเขียวหวาน", fon: "kaeng khǐao wǎan", cat: "pollo", pais: "th", dif: 2, min: 35, por: 4, pasos: 5, ing: [
    r("pollo_muslo", 500, "g"), r("pasta_curry_verde", 3, "cda"), r("leche_coco", 800, "ml"),
    r("berenjena_thai", 200, "g"), r("albahaca_thai", 2, "puñado"), r("hoja_lima", 5, "unidad"),
    r("salsa_pescado", 3, "cda"), r("azucar_palma", 1, "cda"), r("chile_fresco", 3, "unidad"),
    r("arroz_jazmin", 400, "g"),
  ]},
  { id: "gai_yang", nat: "ไก่ย่าง", fon: "kài yâang", cat: "pollo", pais: "th", dif: 2, min: 50, por: 4, pasos: 5, ing: [
    r("pollo_entero", 1200, "g"), r("cilantro", 1, "puñado"), r("ajo", 8, "diente"),
    r("pimienta_negra", 1, "cda"), r("salsa_pescado", 4, "cda"), r("salsa_ostras", 2, "cda"),
    r("azucar_palma", 2, "cda"), r("leche_coco", 100, "ml"), r("arroz_glutinoso", 400, "g"),
  ]},
  { id: "gai_tod", nat: "ไก่ทอด", fon: "kài thôot", cat: "pollo", pais: "th", dif: 2, min: 45, por: 4, pasos: 5, ing: [
    r("pollo_muslo", 800, "g"), r("harina_arroz", 150, "g"), r("maicena", 50, "g"),
    r("salsa_pescado", 3, "cda"), r("ajo", 6, "diente"), r("pimienta_negra", 1, "cdta"),
    r("aceite_neutro", 600, "ml"), r("cilantro", 1, "puñado"),
  ]},
  { id: "khao_man_gai", nat: "ข้าวมันไก่", fon: "khâo man kài", cat: "pollo", pais: "th", dif: 2, min: 65, por: 4, pasos: 6, ing: [
    r("pollo_entero", 1300, "g"), r("arroz_jazmin", 400, "g"), r("jengibre", 60, "g"),
    r("ajo", 6, "diente"), r("pasta_gochujang", 2, "cda"), r("salsa_soja_dulce", 3, "cda"),
    r("vinagre_arroz", 2, "cda"), r("pepino", 1, "unidad"), r("cilantro", 1, "puñado"),
  ]},
  { id: "massaman", nat: "แกงมัสมั่น", fon: "kaeng matsamàn", cat: "carne", pais: "th", dif: 2, min: 95, por: 4, pasos: 6, ing: [
    r("carne_vacuna", 800, "g"), r("pasta_curry_massaman", 4, "cda"), r("leche_coco", 800, "ml"),
    r("papa", 500, "g"), r("cebolla", 2, "unidad"), r("mani", 80, "g"),
    r("canela", 1, "unidad"), r("cardamomo", 3, "unidad"), r("tamarindo", 2, "cda"),
    r("azucar_palma", 2, "cda"), r("salsa_pescado", 3, "cda"),
  ]},
  { id: "panang", nat: "พะแนง", fon: "phanaeng", cat: "carne", pais: "th", dif: 2, min: 40, por: 4, pasos: 5, ing: [
    r("carne_vacuna", 600, "g"), r("pasta_curry_panang", 4, "cda"), r("leche_coco", 600, "ml"),
    r("hoja_lima", 6, "unidad"), r("albahaca_thai", 1, "puñado"), r("mani", 40, "g"),
    r("salsa_pescado", 3, "cda"), r("azucar_palma", 2, "cda"), r("arroz_jazmin", 400, "g"),
  ]},
  { id: "nam_tok", nat: "น้ำตกหมู", fon: "nám tòk mǔu", cat: "cerdo", pais: "th", dif: 2, min: 35, por: 3, pasos: 5, ing: [
    r("cerdo_lomo", 500, "g"), r("arroz_tostado", 2, "cda"), r("chile_seco", 2, "cdta"),
    r("lima", 3, "unidad"), r("salsa_pescado", 3, "cda"), r("cebolla_verde", 3, "unidad"),
    r("menta", 1, "puñado"), r("cilantro", 1, "puñado"), r("lechuga", 100, "g"),
  ]},
  { id: "larb_moo", nat: "ลาบหมู", fon: "lâap mǔu", cat: "cerdo", pais: "th", dif: 1, min: 25, por: 3, pasos: 5, ing: [
    r("cerdo_picado", 500, "g"), r("arroz_tostado", 2, "cda"), r("chile_seco", 2, "cdta"),
    r("lima", 3, "unidad"), r("salsa_pescado", 3, "cda"), r("cebolla_verde", 3, "unidad"),
    r("menta", 1, "puñado"), r("cilantro", 1, "puñado"), r("arroz_glutinoso", 300, "g"),
  ]},
  { id: "pad_see_ew", nat: "ผัดซีอิ๊ว", fon: "phàt sii íu", cat: "fideos", pais: "th", dif: 2, min: 25, por: 2, pasos: 5, ing: [
    r("fideos_arroz", 400, "g"), r("cerdo_lomo", 250, "g"), r("huevo", 2, "unidad"),
    r("brocoli", 200, "g"), r("salsa_soja_oscura", 2, "cda"), r("salsa_soja_dulce", 2, "cda"),
    r("salsa_ostras", 2, "cda"), r("ajo", 4, "diente"), r("aceite_neutro", 3, "cda"),
  ]},
  { id: "pad_kee_mao", nat: "ผัดขี้เมา", fon: "phàt khîi mao", cat: "fideos", pais: "th", dif: 2, min: 25, por: 2, pasos: 5, ing: [
    r("fideos_arroz", 400, "g"), r("pollo_muslo", 300, "g"), r("albahaca_thai", 2, "puñado"),
    r("chile_fresco", 5, "unidad"), r("ajo", 6, "diente"), r("salsa_ostras", 2, "cda"),
    r("salsa_soja_oscura", 1, "cda"), r("salsa_pescado", 1, "cda"), r("pimiento", 1, "unidad"),
    r("aceite_neutro", 3, "cda"),
  ]},
  { id: "boat_noodles", nat: "ก๋วยเตี๋ยวเรือ", fon: "kǔai tǐao ruea", cat: "fideos", pais: "th", dif: 3, min: 95, por: 4, pasos: 6, ing: [
    r("carne_vacuna", 600, "g"), r("fideos_arroz", 400, "g"), r("caldo_pollo", 1500, "ml"),
    r("anis_estrellado", 3, "unidad"), r("canela", 1, "unidad"), r("salsa_soja_oscura", 3, "cda"),
    r("vinagre_arroz", 2, "cda"), r("azucar_palma", 1, "cda"), r("brotes_soja", 150, "g"),
    r("cilantro", 1, "puñado"), r("chile_seco", 1, "cdta"),
  ]},
  { id: "khao_pad", nat: "ข้าวผัด", fon: "khâo phàt", cat: "arroz", pais: "th", dif: 1, min: 20, por: 2, pasos: 5, ing: [
    r("arroz_jazmin", 400, "g"), r("pollo_muslo", 250, "g"), r("huevo", 2, "unidad"),
    r("cebolla", 1, "unidad"), r("cebolla_verde", 2, "unidad"), r("salsa_pescado", 2, "cda"),
    r("salsa_soja", 1, "cda"), r("tomate", 1, "unidad"), r("lima", 1, "unidad"),
    r("aceite_neutro", 3, "cda"),
  ]},
  { id: "khao_niao", nat: "ข้าวเหนียว", fon: "khâo nǐao", cat: "arroz", pais: "th", dif: 1, min: 40, por: 4, pasos: 4, ing: [
    r("arroz_glutinoso", 500, "g"), r("sal", 1, "cdta"),
  ]},
  { id: "som_tam", nat: "ส้มตำ", fon: "sôm tam", cat: "vegetariano", pais: "th", dif: 1, min: 20, por: 2, pasos: 5, ing: [
    r("papaya_verde", 400, "g"), r("porotos_largos", 80, "g"), r("tomate", 2, "unidad"),
    r("mani", 50, "g"), r("chile_fresco", 4, "unidad"), r("ajo", 3, "diente"),
    r("lima", 3, "unidad"), r("salsa_pescado", 3, "cda"), r("azucar_palma", 2, "cda"),
  ]},
  { id: "tom_saap", nat: "ต้มแซ่บ", fon: "tôm sâep", cat: "sopas", pais: "th", dif: 2, min: 50, por: 4, pasos: 5, ing: [
    r("cerdo_costilla", 800, "g"), r("limoncillo", 3, "unidad"), r("galanga", 40, "g"),
    r("hoja_lima", 6, "unidad"), r("chile_seco", 2, "cdta"), r("lima", 3, "unidad"),
    r("salsa_pescado", 4, "cda"), r("cebolla_verde", 3, "unidad"), r("cilantro", 1, "puñado"),
    r("arroz_tostado", 1, "cda"),
  ]},
  // ---------------- RAMEN Y CLÁSICOS JAPONESES ----------------
  { id: "tonkotsu_ramen", nat: "豚骨ラーメン", fon: "tonkotsu rāmen", cat: "fideos", pais: "jp", dif: 3, min: 480, por: 4, pasos: 7, ing: [
    r("cerdo_huesos", 2000, "g"), r("cerdo_panceta", 600, "g"), r("fideos_ramen", 400, "g"),
    r("huevo", 4, "unidad"), r("cebolla_verde", 4, "unidad"), r("menma", 100, "g"),
    r("alga_nori", 4, "unidad"), r("salsa_soja", 100, "ml"), r("mirin", 3, "cda"),
    r("ajo", 6, "diente"), r("jengibre", 40, "g"),
  ]},
  { id: "shoyu_ramen", nat: "醤油ラーメン", fon: "shōyu rāmen", cat: "fideos", pais: "jp", dif: 2, min: 90, por: 4, pasos: 6, ing: [
    r("caldo_pollo", 1600, "ml"), r("alga_kombu", 20, "g"), r("katsuobushi", 20, "g"),
    r("fideos_ramen", 400, "g"), r("cerdo_panceta", 400, "g"), r("salsa_soja", 120, "ml"),
    r("mirin", 3, "cda"), r("huevo", 4, "unidad"), r("cebolla_verde", 3, "unidad"),
    r("menma", 80, "g"), r("alga_nori", 4, "unidad"),
  ]},
  { id: "miso_ramen", nat: "味噌ラーメン", fon: "miso rāmen", cat: "fideos", pais: "jp", dif: 2, min: 75, por: 4, pasos: 6, ing: [
    r("caldo_pollo", 1400, "ml"), r("pasta_miso", 120, "g"), r("cerdo_picado", 250, "g"),
    r("fideos_ramen", 400, "g"), r("brotes_soja", 200, "g"), r("choclo_grano", 150, "g"),
    r("ajo", 5, "diente"), r("jengibre", 30, "g"), r("aceite_sesamo", 2, "cda"),
    r("huevo", 4, "unidad"), r("cebolla_verde", 3, "unidad"),
  ]},
  { id: "shio_ramen", nat: "塩ラーメン", fon: "shio rāmen", cat: "fideos", pais: "jp", dif: 2, min: 80, por: 4, pasos: 6, ing: [
    r("caldo_pollo", 1600, "ml"), r("alga_kombu", 25, "g"), r("sal", 3, "cda"),
    r("fideos_ramen", 400, "g"), r("pollo_pechuga", 400, "g"), r("huevo", 4, "unidad"),
    r("cebolla_verde", 3, "unidad"), r("alga_nori", 4, "unidad"), r("aceite_sesamo", 1, "cda"),
  ]},
  { id: "tantanmen", nat: "担々麺", fon: "tantanmen", cat: "fideos", pais: "jp", dif: 2, min: 45, por: 2, pasos: 6, ing: [
    r("fideos_ramen", 250, "g"), r("cerdo_picado", 300, "g"), r("pasta_sesamo", 4, "cda"),
    r("leche_coco", 200, "ml"), r("caldo_pollo", 600, "ml"), r("pasta_miso", 2, "cda"),
    r("aceite_chile", 3, "cda"), r("pimienta_sichuan", 1, "cdta"), r("ajo", 4, "diente"),
    r("cebolla_verde", 3, "unidad"), r("bok_choy", 200, "g"),
  ]},
  { id: "tsukemen", nat: "つけ麺", fon: "tsukemen", cat: "fideos", pais: "jp", dif: 3, min: 120, por: 2, pasos: 6, ing: [
    r("fideos_ramen", 300, "g"), r("cerdo_huesos", 1000, "g"), r("cerdo_panceta", 300, "g"),
    r("katsuobushi", 25, "g"), r("salsa_soja", 80, "ml"), r("mirin", 3, "cda"),
    r("vinagre_arroz", 1, "cda"), r("azucar", 1, "cda"), r("cebolla_verde", 3, "unidad"),
    r("menma", 80, "g"), r("lima", 1, "unidad"),
  ]},
  { id: "hiyashi_chuka", nat: "冷やし中華", fon: "hiyashi chūka", cat: "fideos", pais: "jp", dif: 1, min: 30, por: 2, pasos: 5, ing: [
    r("fideos_ramen", 250, "g"), r("jamon", 120, "g"), r("huevo", 2, "unidad"),
    r("pepino", 1, "unidad"), r("tomate", 1, "unidad"), r("salsa_soja", 4, "cda"),
    r("vinagre_arroz", 4, "cda"), r("azucar", 2, "cda"), r("aceite_sesamo", 2, "cdta"),
    r("jengibre_encurtido", 30, "g"),
  ]},
  { id: "katsu_curry", nat: "カツカレー", fon: "katsu karē", cat: "cerdo", pais: "jp", dif: 2, min: 60, por: 4, pasos: 6, ing: [
    r("cerdo_lomo", 600, "g"), r("panko", 150, "g"), r("harina", 80, "g"),
    r("huevo", 2, "unidad"), r("curry_polvo", 3, "cda"), r("cebolla", 2, "unidad"),
    r("zanahoria", 2, "unidad"), r("papa", 400, "g"), r("manzana", 1, "unidad"),
    r("caldo_pollo", 800, "ml"), r("aceite_neutro", 500, "ml"), r("arroz_corto", 400, "g"),
  ]},
  { id: "okonomiyaki", nat: "お好み焼き", fon: "okonomiyaki", cat: "cerdo", pais: "jp", dif: 2, min: 40, por: 2, pasos: 6, ing: [
    r("repollo", 400, "g"), r("harina", 150, "g"), r("huevo", 3, "unidad"),
    r("caldo_pollo", 120, "ml"), r("polvo_hornear", 1, "cdta"), r("cerdo_panceta", 150, "g"),
    r("salsa_okonomiyaki", 4, "cda"), r("mayonesa_japonesa", 3, "cda"), r("katsuobushi", 10, "g"),
    r("alga_nori", 1, "unidad"), r("cebolla_verde", 2, "unidad"),
  ]},
  { id: "takoyaki", nat: "たこ焼き", fon: "takoyaki", cat: "mariscos", pais: "jp", dif: 3, min: 45, por: 4, pasos: 6, ing: [
    r("pulpo", 300, "g"), r("harina", 200, "g"), r("huevo", 2, "unidad"),
    r("caldo_pollo", 600, "ml"), r("cebolla_verde", 3, "unidad"), r("jengibre_encurtido", 40, "g"),
    r("salsa_okonomiyaki", 4, "cda"), r("mayonesa_japonesa", 3, "cda"), r("katsuobushi", 10, "g"),
    r("aceite_neutro", 3, "cda"),
  ]},
  // ---------------- COREA ----------------
  { id: "kimchi", nat: "김치", fon: "gimchi", cat: "vegetariano", pais: "kr", dif: 2, min: 300, por: 12, pasos: 7, ing: [
    r("col_china", 2000, "g"), r("sal", 200, "g"), r("gochugaru", 100, "g"),
    r("ajo", 12, "diente"), r("jengibre", 40, "g"), r("salsa_pescado", 80, "ml"),
    r("rabano_daikon", 300, "g"), r("cebolla_verde", 6, "unidad"), r("azucar", 1, "cda"),
    r("harina_arroz", 2, "cda"),
  ]},
  { id: "tteokbokki", nat: "떡볶이", fon: "tteokbokki", cat: "vegetariano", pais: "kr", dif: 1, min: 25, por: 3, pasos: 5, ing: [
    r("tteok", 500, "g"), r("pasta_gochujang", 3, "cda"), r("gochugaru", 1, "cda"),
    r("eomuk", 150, "g"), r("huevo", 3, "unidad"), r("anchoas_secas", 20, "g"),
    r("alga_kombu", 10, "g"), r("azucar", 2, "cda"), r("cebolla_verde", 3, "unidad"),
  ]},
  { id: "kimbap", nat: "김밥", fon: "gimbap", cat: "arroz", pais: "kr", dif: 2, min: 45, por: 4, pasos: 6, ing: [
    r("arroz_corto", 400, "g"), r("alga_nori", 6, "unidad"), r("zanahoria", 2, "unidad"),
    r("espinaca", 200, "g"), r("pepino", 1, "unidad"), r("danmuji", 120, "g"),
    r("huevo", 3, "unidad"), r("carne_vacuna", 200, "g"), r("aceite_sesamo", 3, "cda"),
    r("sesamo_semillas", 2, "cda"),
  ]},
  { id: "yangnyeom_chicken", nat: "양념치킨", fon: "yangnyeom chikin", cat: "pollo", pais: "kr", dif: 2, min: 50, por: 4, pasos: 6, ing: [
    r("pollo_muslo", 900, "g"), r("maicena", 150, "g"), r("pasta_gochujang", 4, "cda"),
    r("miel", 3, "cda"), r("salsa_soja", 2, "cda"), r("vinagre_arroz", 1, "cda"),
    r("ajo", 6, "diente"), r("sesamo_semillas", 2, "cda"), r("aceite_neutro", 800, "ml"),
    r("jengibre", 20, "g"),
  ]},
  { id: "samgyeopsal", nat: "삼겹살", fon: "samgyeopsal", cat: "cerdo", pais: "kr", dif: 1, min: 30, por: 4, pasos: 5, ing: [
    r("cerdo_panceta", 900, "g"), r("lechuga", 300, "g"), r("hojas_sesamo", 60, "g"),
    r("ssamjang", 6, "cda"), r("ajo", 10, "diente"), r("aceite_sesamo", 2, "cda"),
    r("sal", 1, "cdta"), r("cebolla_verde", 4, "unidad"), r("arroz_corto", 400, "g"),
  ]},
  { id: "kimchi_jjigae", nat: "김치찌개", fon: "gimchi jjigae", cat: "sopas", pais: "kr", dif: 1, min: 40, por: 4, pasos: 5, ing: [
    r("kimchi_fermentado", 400, "g"), r("cerdo_panceta", 300, "g"), r("tofu_firme", 300, "g"),
    r("gochugaru", 1, "cda"), r("anchoas_secas", 20, "g"), r("alga_kombu", 10, "g"),
    r("cebolla_verde", 3, "unidad"), r("ajo", 4, "diente"), r("aceite_sesamo", 1, "cda"),
  ]},
  { id: "sundubu_jjigae", nat: "순두부찌개", fon: "sundubu jjigae", cat: "sopas", pais: "kr", dif: 2, min: 30, por: 2, pasos: 5, ing: [
    r("tofu_sedoso", 500, "g"), r("gochugaru", 2, "cda"), r("cerdo_picado", 150, "g"),
    r("camaron", 150, "g"), r("huevo", 2, "unidad"), r("anchoas_secas", 20, "g"),
    r("alga_kombu", 10, "g"), r("ajo", 4, "diente"), r("cebolla_verde", 2, "unidad"),
    r("aceite_sesamo", 2, "cda"),
  ]},
  { id: "jajangmyeon", nat: "자장면", fon: "jajangmyeon", cat: "fideos", pais: "kr", dif: 2, min: 45, por: 3, pasos: 6, ing: [
    r("fideos_trigo", 400, "g"), r("chunjang", 5, "cda"), r("cerdo_lomo", 300, "g"),
    r("cebolla", 3, "unidad"), r("calabacin", 1, "unidad"), r("papa", 200, "g"),
    r("maicena", 2, "cda"), r("azucar", 1, "cda"), r("aceite_neutro", 5, "cda"),
    r("pepino", 1, "unidad"),
  ]},
  { id: "haemul_pajeon", nat: "해물파전", fon: "haemul pajeon", cat: "mariscos", pais: "kr", dif: 2, min: 30, por: 3, pasos: 5, ing: [
    r("cebolla_verde", 12, "unidad"), r("calamar", 200, "g"), r("camaron", 200, "g"),
    r("harina", 200, "g"), r("harina_arroz", 60, "g"), r("huevo", 2, "unidad"),
    r("aceite_neutro", 6, "cda"), r("salsa_soja", 4, "cda"), r("vinagre_arroz", 2, "cda"),
    r("gochugaru", 1, "cdta"),
  ]},
  { id: "samgyetang", nat: "삼계탕", fon: "samgyetang", cat: "sopas", pais: "kr", dif: 2, min: 90, por: 2, pasos: 5, ing: [
    r("pollo_entero", 1000, "g"), r("arroz_glutinoso", 150, "g"), r("ginseng", 2, "unidad"),
    r("azufaifa", 6, "unidad"), r("ajo", 10, "diente"), r("cebolla_verde", 3, "unidad"),
    r("sal", 2, "cdta"), r("pimienta_negra", 1, "cdta"),
  ]},
  { id: "galbi", nat: "갈비", fon: "galbi", cat: "carne", pais: "kr", dif: 2, min: 60, por: 4, pasos: 5, ing: [
    r("costilla_vacuna", 1200, "g"), r("salsa_soja", 150, "ml"), r("pera_nashi", 1, "unidad"),
    r("cebolla", 1, "unidad"), r("ajo", 8, "diente"), r("azucar_moreno", 4, "cda"),
    r("aceite_sesamo", 3, "cda"), r("cebolla_verde", 3, "unidad"), r("sesamo_semillas", 2, "cda"),
    r("pimienta_negra", 1, "cdta"),
  ]},
  { id: "gamjatang", nat: "감자탕", fon: "gamjatang", cat: "sopas", pais: "kr", dif: 2, min: 120, por: 4, pasos: 6, ing: [
    r("cerdo_huesos", 1500, "g"), r("papa", 800, "g"), r("hojas_sesamo", 60, "g"),
    r("semillas_perilla", 4, "cda"), r("gochugaru", 3, "cda"), r("pasta_miso", 2, "cda"),
    r("ajo", 10, "diente"), r("jengibre", 30, "g"), r("cebolla_verde", 4, "unidad"),
    r("brotes_soja", 200, "g"),
  ]},
  { id: "mandu", nat: "만두", fon: "mandu", cat: "cerdo", pais: "kr", dif: 3, min: 70, por: 5, pasos: 6, ing: [
    r("wonton_tapas", 400, "g"), r("cerdo_picado", 350, "g"), r("tofu_firme", 200, "g"),
    r("fideos_vidrio", 60, "g"), r("kimchi_fermentado", 200, "g"), r("cebolla_verde", 4, "unidad"),
    r("ajo", 4, "diente"), r("aceite_sesamo", 2, "cda"), r("salsa_soja", 3, "cda"),
    r("vinagre_arroz", 2, "cda"),
  ]},
  { id: "bossam", nat: "보쌈", fon: "bossam", cat: "cerdo", pais: "kr", dif: 2, min: 105, por: 5, pasos: 5, ing: [
    r("cerdo_panceta", 1200, "g"), r("pasta_miso", 3, "cda"), r("jengibre", 50, "g"),
    r("ajo", 8, "diente"), r("cebolla", 1, "unidad"), r("rabano_daikon", 500, "g"),
    r("gochugaru", 3, "cda"), r("lechuga", 300, "g"), r("ssamjang", 5, "cda"),
    r("azucar", 2, "cda"),
  ]},
  { id: "kongguksu", nat: "콩국수", fon: "kongguksu", cat: "fideos", pais: "kr", dif: 2, min: 45, por: 2, pasos: 5, ing: [
    r("porotos_soja", 250, "g"), r("fideos_trigo", 250, "g"), r("sesamo_semillas", 3, "cda"),
    r("pepino", 1, "unidad"), r("tomate", 1, "unidad"), r("sal", 1, "cdta"),
  ]},
  { id: "hotteok", nat: "호떡", fon: "hotteok", cat: "reposteria", pais: "kr", dif: 2, min: 100, por: 8, pasos: 6, ing: [
    r("harina", 300, "g"), r("arroz_glutinoso", 50, "g"), r("levadura", 7, "g"),
    r("azucar", 2, "cda"), r("azucar_moreno", 120, "g"), r("canela", 2, "cdta"),
    r("nueces", 80, "g"), r("sal", 1, "cdta"), r("aceite_neutro", 4, "cda"),
  ]},
];

// La miel se usa en varias recetas pero faltaba en la tabla.
INGREDIENTES.miel = { sec: "salsa", alacena: true };

// Ingredientes de alacena: lo que conviene tener siempre.
function itemsAlacena() {
  return Object.entries(INGREDIENTES)
    .filter(([, v]) => v.alacena)
    .map(([id, v]) => ({ id, sec: v.sec }));
}

// Lista de compras a partir de las recetas elegidas.
// Agrupa por sección y suma cantidades cuando la unidad coincide.
function listaDeCompras(ids, incluirAlacena) {
  const acc = {};
  ids.forEach((rid) => {
    const receta = RECETAS.find((x) => x.id === rid);
    if (!receta) return;
    receta.ing.forEach(({ i, c, u }) => {
      const info = INGREDIENTES[i];
      if (!info) return;
      if (info.alacena && !incluirAlacena) return;
      const clave = i + "|" + u;
      acc[clave] = acc[clave] || { id: i, u, c: 0, sec: info.sec, recetas: [] };
      acc[clave].c += c;
      if (!acc[clave].recetas.includes(rid)) acc[clave].recetas.push(rid);
    });
  });
  const porSeccion = {};
  Object.values(acc).forEach((item) => {
    (porSeccion[item.sec] = porSeccion[item.sec] || []).push(item);
  });
  SECCIONES.forEach((s) => {
    if (porSeccion[s]) porSeccion[s].sort((a, b) => b.recetas.length - a.recetas.length);
  });
  return porSeccion;
}
