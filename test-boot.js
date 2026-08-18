// Arranca app.js contra un DOM mínimo. El test estático solo miraba que los id
// existieran en el HTML; no detectaba un selector roto como $(".nav-btn") en
// lugar de $$(".nav-btn"), que revienta recién al abrir la app.
const fs = require("fs"), vm = require("vm");
const dir = require("path").dirname(__filename);

let fallos = 0;
const chk = (c, m) => { if (!c) { console.log("   ❌ " + m); fallos++; } };

// ---------- DOM de juguete ----------
const oyentesDoc = [];

class Clases {
  constructor(el) { this.el = el; this.set = new Set(); }
  add(...c) { c.forEach((x) => x && this.set.add(x)); }
  remove(...c) { c.forEach((x) => this.set.delete(x)); }
  contains(c) { return this.set.has(c); }
  toggle(c, forzar) {
    const v = forzar === undefined ? !this.set.has(c) : !!forzar;
    v ? this.set.add(c) : this.set.delete(c);
    return v;
  }
  get value() { return [...this.set].join(" "); }
}

class El {
  constructor(tag) {
    this.tagName = (tag || "div").toUpperCase();
    this.hijos = []; this.padre = null;
    this.classList = new Clases(this);
    this.dataset = {}; this.attrs = {};
    this._texto = ""; this.value = ""; this.oyentes = {};
    this.style = {};
  }
  get className() { return this.classList.value; }
  set className(v) { this.classList.set = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get classNameList() { return [...this.classList.set]; }
  append(...n) { n.forEach((x) => { if (x == null) return; x.padre = this; this.hijos.push(x); }); }
  prepend(...n) { n.forEach((x) => { x.padre = this; this.hijos.unshift(x); }); }
  remove() { if (this.padre) this.padre.hijos = this.padre.hijos.filter((h) => h !== this); }
  addEventListener(t, f) { (this.oyentes[t] = this.oyentes[t] || []).push(f); }
  removeEventListener() {}
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k]; }
  focus() {}
  get textContent() {
    return this.hijos.length ? this.hijos.map((h) => h.textContent).join("") : this._texto;
  }
  set textContent(v) { this._texto = String(v); this.hijos = []; }
  get placeholder() { return this.attrs.placeholder; }
  set placeholder(v) { this.attrs.placeholder = v; }
  get id() { return this.attrs.id; }
  set id(v) { this.attrs.id = v; }
  get src() { return this.attrs.src; }
  set src(v) { this.attrs.src = v; }
  get alt() { return this.attrs.alt; }
  set alt(v) { this.attrs.alt = v; }
  get loading() { return this.attrs.loading; }
  set loading(v) { this.attrs.loading = v; }
  get href() { return this.attrs.href; }
  set href(v) { this.attrs.href = v; }
  todos() { return this.hijos.flatMap((h) => [h, ...h.todos()]); }
  closest(sel) {
    let n = this;
    while (n) { if (coincideSel(n, sel)) return n; n = n.padre; }
    return null;
  }
  querySelector(s) { return this.querySelectorAll(s)[0] || null; }
  querySelectorAll(s) {
    const partes = s.split(/\s+/).filter(Boolean);
    let cands = this.todos();
    if (partes.length === 1) return cands.filter((n) => coincideSel(n, partes[0]));
    // solo hace falta soportar "#padre .hijo"
    const padres = cands.filter((n) => coincideSel(n, partes[0]));
    return padres.flatMap((p) => p.todos().filter((n) => coincideSel(n, partes[1])));
  }
  // dispara un click con burbujeo, como el navegador: sube por los padres y
  // termina en document, que es donde la app delega el cambio de idioma
  click() {
    const ev = { target: this, preventDefault() {}, stopPropagation() {} };
    let n = this;
    while (n) { (n.oyentes.click || []).forEach((f) => f.call(n, ev)); n = n.padre; }
    oyentesDoc.forEach((f) => f(ev));
  }
}

function coincideSel(n, sel) {
  if (!sel) return false;
  if (sel.startsWith("#")) return n.attrs.id === sel.slice(1);
  if (sel.startsWith(".")) return sel.slice(1).split(".").every((c) => n.classList.contains(c));
  return n.tagName === sel.toUpperCase();
}

// ---------- parser de HTML, lo justo ----------
function parsear(html) {
  const raiz = new El("body");
  const pila = [raiz];
  const solos = new Set(["img", "input", "br", "meta", "link", "hr"]);
  const re = /<(\/?)([a-zA-Z0-9-]+)((?:\s+[^>]*?)?)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const [, cierre, tag, attrs, autocierre, texto] = m;
    if (texto != null) {
      const t = texto.trim();
      if (t && pila.length > 1) pila[pila.length - 1]._texto += t;
      continue;
    }
    const nom = tag.toLowerCase();
    if (cierre) { if (pila.length > 1) pila.pop(); continue; }
    const el = new El(nom);
    for (const a of (attrs || "").matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
      const [, k, v] = a;
      if (k === "class") el.className = v;
      else if (k.startsWith("data-")) {
        const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        el.dataset[camel] = v;
      } else el.attrs[k] = v;
    }
    pila[pila.length - 1].append(el);
    if (!solos.has(nom) && !autocierre) pila.push(el);
  }
  return raiz;
}

// ---------- entorno ----------
const html = fs.readFileSync(`${dir}/index.html`, "utf8");
const body = parsear(html.slice(html.indexOf("<body")));

const almacen = {};
const document = {
  documentElement: { lang: "es", style: {}, classList: new Clases({}) },
  body,
  createElement: (t) => new El(t),
  createTextNode: (t) => { const e = new El("#text"); e._texto = t; return e; },
  querySelector: (s) => body.querySelector(s),
  querySelectorAll: (s) => body.querySelectorAll(s),
  addEventListener: (t, f) => { if (t === "click") oyentesDoc.push(f); },
  activeElement: null,
};

const ctx = {
  console, document,
  window: { scrollTo() {}, addEventListener() {}, print() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) },
  navigator: { language: "es", clipboard: { writeText: () => Promise.resolve() } },
  localStorage: {
    getItem: (k) => (k in almacen ? almacen[k] : null),
    setItem: (k, v) => { almacen[k] = String(v); },
    removeItem: (k) => { delete almacen[k]; },
  },
  setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: (f) => f(),
  IDIOMAS: {}, registerLang(c, d) { ctx.IDIOMAS[c] = d; },
  Element: El,
};
ctx.globalThis = ctx;
ctx.window.document = document;
vm.createContext(ctx);

// ---------- arranque ----------
try {
  ["language/es.js", "language/en.js", "js/data.js", "js/app.js"].forEach((f) =>
    vm.runInContext(fs.readFileSync(`${dir}/${f}`, "utf8"), ctx, { filename: f }));
} catch (e) {
  console.log("   ❌ la app explota al cargar: " + e.message);
  console.log(e.stack.split("\n").slice(0, 4).join("\n"));
  process.exit(1);
}

vm.runInContext(";globalThis.__datos={RECETAS};", ctx);
const { RECETAS } = ctx.__datos;
const ES = ctx.IDIOMAS.es;

// ---------- comprobaciones ----------
const q = (s) => body.querySelector(s);
const qa = (s) => body.querySelectorAll(s);

// 1) arranca en el selector de países, con las banderas ya dibujadas
chk(!q("#vista-paises").classList.contains("oculto"), "la vista de países debería verse al abrir");
chk(q("#vista-recetas").classList.contains("oculto"), "la vista de recetas debería estar oculta al abrir");

const cartas = qa(".pais-carta");
chk(cartas.length === 9, `se esperaban 9 banderas en la portada, hay ${cartas.length}`);
cartas.forEach((c) => {
  const img = c.querySelector("IMG");
  chk(img && img.src.startsWith("assets/banderas/"), `carta ${c.dataset.pais} sin imagen`);
  chk(fs.existsSync(`${dir}/${img.src}`), `no existe ${img && img.src}`);
  chk(c.querySelector(".pais-nombre").textContent.length > 2, `carta ${c.dataset.pais} sin nombre`);
});

// El orden es el pedido a mano, no alfabético ni por cantidad de recetas.
const ORDEN = ["cn", "kr", "jp", "th", "vn", "hk", "my", "sg", "id"];
chk(JSON.stringify(cartas.map((c) => c.dataset.pais)) === JSON.stringify(ORDEN),
  "la portada no respeta el orden: " + cartas.map((c) => c.dataset.pais).join(","));
chk(!q(".pais-conteo"), "las tarjetas no deberían mostrar la cantidad de recetas");

// 2) al hacer clic en una bandera se entra a las recetas de ese país
const corea = cartas.find((c) => c.dataset.pais === "kr");
chk(!!corea, "falta la carta de Corea");
corea.click();
chk(!q("#vista-recetas").classList.contains("oculto"), "el clic en la bandera no abrió las recetas");
chk(q("#vista-paises").classList.contains("oculto"), "la portada debería ocultarse al elegir país");

const tarjetas = qa("#grilla .tarjeta");
chk(tarjetas.length === 20, `Corea debería mostrar 20 recetas, muestra ${tarjetas.length}`);
const nombres = tarjetas.map((t) => t.querySelector(".tarjeta-nombre").textContent);
["Kimchi", "Bibimbap", "Samgyetang", "Hotteok"].forEach((n) =>
  chk(nombres.includes(n), `falta ${n} entre las recetas coreanas`));

// 3) el botón "Recetas" de la nav sigue activo, y sólo ese
const activos = qa(".nav-btn").filter((b) => b.classList.contains("activo"));
chk(activos.length === 1 && activos[0].dataset.vista === "recetas",
  `nav mal marcada: ${activos.map((b) => b.dataset.vista).join(",") || "ninguna"}`);

// 4) volver limpia el filtro
q("#volver-paises").click();
chk(!q("#vista-paises").classList.contains("oculto"), "volver no regresó a la portada");
q("#grilla-paises").querySelectorAll(".pais-carta").find((c) => c.dataset.pais === "jp").click();
chk(qa("#grilla .tarjeta").length === 21, "el filtro no se reinició al cambiar de país");

// 5) el hero muestra la bandera y el nombre del país en el que estás
chk(q("#pais-hero-img").src === "assets/banderas/jp.jpg",
  `el hero no muestra la bandera de Japón: ${q("#pais-hero-img").src}`);
chk(q("#pais-hero-nombre").textContent === "Japón",
  `el hero dice "${q("#pais-hero-nombre").textContent}"`);
chk(!q("#pais-hero").classList.contains("sin-pais"), "el hero debería estar activo con un país elegido");

// 6) cada plato lleva su nombre original y la pronunciación
const conNativo = qa("#grilla .tarjeta").filter((t) => t.querySelector(".tarjeta-nativo"));
chk(conNativo.length === qa("#grilla .tarjeta").length,
  `${qa("#grilla .tarjeta").length - conNativo.length} recetas japonesas sin nombre original`);
const ramen = conNativo.find((t) => t.querySelector(".tarjeta-nombre").textContent === "Tonkotsu Ramen");
chk(ramen && ramen.querySelector(".nat").textContent === "豚骨ラーメン", "el kanji del tonkotsu no aparece");
chk(ramen && ramen.querySelector(".fon").textContent === " (tonkotsu rāmen)", "falta la pronunciación");

// 7) la tarjeta apunta a su foto y cae en el ícono si no está
const foto = qa("#grilla .tarjeta")[0].querySelector(".tarjeta-foto");
chk(!!foto, "la tarjeta no tiene contenedor de foto");
chk(foto.classList.contains("sin-foto") || foto.querySelector("IMG"),
  "sin foto la tarjeta debería marcarse como sin-foto");

// 8) el modal: dos columnas, la receta entera y las negritas resueltas.
// Se abre una receta que sí use ** en sus pasos, para que la comprobación
// del énfasis tenga algo que verificar.
const conEnfasis = RECETAS.find((r) =>
  Array.from({ length: r.pasos }, (_, i) => ES[`r.${r.id}.p${i + 1}`])
    .some((p) => p && p.includes("**")));
chk(!!conEnfasis, "ninguna receta usa ** para destacar");

if (conEnfasis) {
  const tarjeta = qa("#grilla .tarjeta").find((t) => t.dataset.receta === conEnfasis.id)
    || (q("#volver-paises").click(), qa("#grilla .tarjeta").find((t) => t.dataset.receta === conEnfasis.id));
  chk(!!tarjeta, `no encontré la tarjeta de ${conEnfasis.id}`);
  if (tarjeta) {
    tarjeta.click();
    chk(q("#modal-fondo").classList.contains("abierto"), "el clic en la tarjeta no abrió el modal");
    chk(!!q(".modal-lado-foto") && !!q(".modal-lado-texto"), "el modal no armó las dos columnas");
    chk(!!q(".modal-titulo"), "el modal no tiene título");

    const pasosLi = qa(".pasos li");
    chk(pasosLi.length === conEnfasis.pasos,
      `el modal listó ${pasosLi.length} pasos y la receta tiene ${conEnfasis.pasos}`);

    // Los ** de énfasis tienen que llegar como <strong>, nunca como texto.
    // split(/**/) es un comentario de bloque y se vuelve split() a secas: pasa
    // el chequeo de sintaxis y deja los asteriscos a la vista del usuario.
    chk(!pasosLi.map((li) => li.textContent).join(" ").includes("**"),
      "quedaron asteriscos sin convertir en los pasos");
    chk(pasosLi.some((li) => li.querySelector("STRONG")),
      "ningún paso resolvió el énfasis en <strong>");
  }
}

// 9) el video: el extractor acepta las formas en que se pega un link
const yt = ctx.idDeYouTube;
chk(typeof yt === "function", "falta idDeYouTube");
if (typeof yt === "function") {
  [
    ["dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s", "dQw4w9WgXcQ"],
    ["https://youtu.be/dQw4w9WgXcQ?si=xyz", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
    ["", null], [undefined, null], ["cualquier cosa", null],
  ].forEach(([entra, sale]) => {
    chk(yt(entra) === sale, `idDeYouTube(${JSON.stringify(entra)}) dio ${JSON.stringify(yt(entra))}`);
  });
}

// y la interfaz aparece sólo cuando la receta tiene video cargado
chk(!q(".modal-play"), "sin video cargado no debería haber botón de play");
chk(!q(".tarjeta-video"), "sin video cargado no debería haber sello en las tarjetas");

RECETAS[0].video = "https://youtu.be/dQw4w9WgXcQ";
q("#modal-cerrar").click();
ctx.render();
chk(!!q(".tarjeta-video"), "con video cargado falta el sello en la tarjeta");
qa("#grilla .tarjeta").find((t) => t.dataset.receta === RECETAS[0].id).click();
const play = q(".modal-play");
chk(!!play, "con video cargado falta el botón de play en el modal");
if (play) {
  // El iframe se crea recién al tocar: cargarlo de entrada sumaría una
  // conexión a YouTube en cada receta que abrís, la mires o no.
  chk(!q(".modal-video"), "el iframe no debería existir antes del clic");
  play.click();
  const ifr = q(".modal-video IFRAME");
  chk(!!ifr, "el clic en play no creó el reproductor");
  chk(ifr && ifr.src.includes("youtube-nocookie.com/embed/dQw4w9WgXcQ"),
    `el iframe apunta a ${ifr && ifr.src}`);
}
delete RECETAS[0].video;
q("#modal-cerrar").click();

// 10) cambiar de idioma no rompe nada
const btnEn = qa(".idioma-btn").find((b) => b.dataset.idioma === "en");
btnEn.click();
chk(qa(".pais-carta").length === 9 || qa("#grilla .tarjeta").length > 0, "el cambio de idioma vació la vista");
chk(document.documentElement.lang === "en", "no se aplicó el idioma en <html lang>");

console.log(fallos === 0 ? "✅ ARRANQUE OK" : `❌ ${fallos} fallos de arranque`);
process.exit(fallos ? 1 : 0);
