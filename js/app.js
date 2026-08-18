// ============ ASIANSECRET — lógica ============

const CLAVE_SEL = "asiansecret.seleccion";
const CLAVE_ALA = "asiansecret.alacena";
const CLAVE_IDIOMA = "asiansecret.idioma";
const CLAVE_TACHADOS = "asiansecret.tachados";
const CLAVE_PORCIONES = "asiansecret.porciones";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ---------- almacenamiento tolerante a fallos ----------
function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : porDefecto;
  } catch { return porDefecto; }
}
function guardar(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch { /* modo privado */ }
}

// ---------- estado ----------
let idioma = leer(CLAVE_IDIOMA, null) || (navigator.language || "es").slice(0, 2);
if (!IDIOMAS[idioma]) idioma = "es";

let seleccion = new Set(leer(CLAVE_SEL, []));
let alacena = new Set(leer(CLAVE_ALA, []));
let tachados = new Set(leer(CLAVE_TACHADOS, []));
// { idReceta: porciones }. Sólo guarda las que se cambiaron; el resto usa
// las porciones con las que la receta viene escrita.
let porciones = leer(CLAVE_PORCIONES, {}) || {};
let vista = "paises";
let tipo = "todo";        // todo · salado · dulce
let categoria = "todas";
let pais = "todos";
let busqueda = "";

// ---------- traducción ----------
function t(clave, vars) {
  let s = (IDIOMAS[idioma] && IDIOMAS[idioma][clave]) ||
          (IDIOMAS.es && IDIOMAS.es[clave]) || clave;
  if (vars) for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}
const num = (n) => Number(n).toLocaleString(idioma === "en" ? "en-US" : "es-AR");

function aplicarIdioma() {
  document.documentElement.lang = idioma;
  $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
  $$("[data-t-ph]").forEach((el) => { el.placeholder = t(el.dataset.tPh); });
  $$(".idioma-btn").forEach((b) => b.classList.toggle("activo", b.dataset.idioma === idioma));
  render();
}

document.addEventListener("click", (e) => {
  const b = e.target.closest(".idioma-btn");
  if (!b) return;
  idioma = b.dataset.idioma;
  guardar(CLAVE_IDIOMA, idioma);
  aplicarIdioma();
});

// ---------- utilidades ----------
function crear(tag, clase, texto) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
}

let avisoTimer;
function aviso(mensaje) {
  const el = $("#aviso");
  el.textContent = mensaje;
  el.classList.add("visible");
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove("visible"), 2400);
}

const esDulce = (rec) => rec.cat === "reposteria";

// Los pasos marcan con **asteriscos** lo que no hay que pasar por alto. Se
// arma con nodos del DOM y no con innerHTML: el texto viene de los archivos de
// idioma, pero igual no se inyecta HTML desde una cadena.
function conNegritas(texto, tag, clase) {
  const el = crear(tag || "span", clase);
  // Separador literal, no expresión regular: /**/ es un comentario de bloque en
  // JavaScript y se convierte en split() a secas, que devuelve el texto entero.
  String(texto).split("**").forEach((parte, i) => {
    if (!parte) return;
    el.append(i % 2 ? crear("strong", null, parte) : document.createTextNode(parte));
  });
  return el;
}

// Saca el id de YouTube de lo que haya en data.js: sirve el link completo
// pegado del navegador, el corto de youtu.be, el de /embed/ o el id pelado.
// Devuelve null si no reconoce nada, y ahí la receta va sin reproductor.
function idDeYouTube(valor) {
  if (!valor) return null;
  const v = String(valor).trim();
  if (/^[\w-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
// 김치 (gimchi) — el nombre en su escritura y cómo se pronuncia.
// Devuelve null si la receta todavía no lo tiene cargado.
function nombreNativo(rec, clase) {
  if (!rec.nat) return null;
  const el = crear("div", clase);
  el.append(crear("span", "nat", rec.nat));
  if (rec.fon) el.append(crear("span", "fon", " (" + rec.fon + ")"));
  return el;
}
const cantidad = (c, u) => num(c) + " " + t("u." + u);
const porcionesDe = (rec) => porciones[rec.id] || rec.por;

// ---------- navegación ----------
function irA(nombre) {
  vista = nombre;
  $$(".vista").forEach((v) => v.classList.toggle("oculto", v.id !== "vista-" + nombre));
  // El selector de países y la lista de recetas comparten el botón "Recetas".
  const enNav = nombre === "paises" ? "recetas" : nombre;
  $$(".nav-btn").forEach((b) => b.classList.toggle("activo", b.dataset.vista === enNav));
  $("#cabecera").classList.toggle("compacta", nombre !== "paises");
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}
$$(".nav-btn").forEach((b) => b.addEventListener("click", () => {
  // Tocar "Recetas" vuelve al selector de países, no a la última búsqueda.
  if (b.dataset.vista === "recetas") { pais = "todos"; irA("paises"); return; }
  irA(b.dataset.vista);
}));

$("#volver-paises").addEventListener("click", () => { pais = "todos"; irA("paises"); });

// ---------- filtros ----------
function construirChipsCategoria() {
  const cont = $("#chips-categoria");
  cont.textContent = "";
  const todas = crear("button", "chip" + (categoria === "todas" ? " activo" : ""));
  todas.dataset.cat = "todas";
  todas.textContent = t("cat.todas");
  cont.append(todas);

  CATEGORIAS.forEach((c) => {
    // Con el filtro "salado" no tiene sentido ofrecer repostería, y al revés.
    if (tipo === "salado" && c.id === "reposteria") return;
    if (tipo === "dulce" && c.id !== "reposteria") return;
    const b = crear("button", "chip" + (categoria === c.id ? " activo" : ""));
    b.dataset.cat = c.id;
    b.append(crear("span", null, c.icono), crear("span", null, t("cat." + c.id)));
    cont.append(b);
  });
}

$("#chips-categoria").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  categoria = b.dataset.cat;
  render();
});

$("#chips-tipo").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  tipo = b.dataset.tipo;
  categoria = "todas";
  $$("#chips-tipo .chip").forEach((c) => c.classList.toggle("activo", c === b));
  render();
});

$("#buscador").addEventListener("input", (e) => {
  busqueda = e.target.value.trim().toLowerCase();
  render();
});

// Busca por nombre, descripción, país e ingredientes: si tenés tofu en la
// heladera, escribís "tofu" y aparecen las recetas que lo usan.
function coincide(rec) {
  if (!busqueda) return true;
  const campos = [
    t("r." + rec.id + ".n"), t("r." + rec.id + ".d"), t("pais." + rec.pais),
    t("cat." + rec.cat), rec.nat || "", rec.fon || "",
    ...rec.ing.map((x) => t("i." + x.i)),
  ].join(" ").toLowerCase();
  return campos.includes(busqueda);
}

function recetasFiltradas() {
  return RECETAS.filter((r) => {
    if (tipo === "salado" && esDulce(r)) return false;
    if (tipo === "dulce" && !esDulce(r)) return false;
    if (categoria !== "todas" && r.cat !== categoria) return false;
    if (pais !== "todos" && r.pais !== pais) return false;
    return coincide(r);
  });
}

// ---------- tarjetas ----------
function tarjeta(rec) {
  const cat = CATEGORIAS.find((c) => c.id === rec.cat);
  const el = crear("button", "tarjeta" + (seleccion.has(rec.id) ? " elegida" : ""));
  el.dataset.receta = rec.id;
  el.dataset.cat = rec.cat;

  // La foto ocupa toda la tarjeta; el texto va encima, sobre un degradado.
  // Mientras no haya foto queda el mosaico con el ícono de la categoría.
  const foto = crear("div", "tarjeta-foto");
  const img = document.createElement("img");
  img.src = "assets/platos/" + rec.id + ".jpg";
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => { img.remove(); foto.classList.add("sin-foto"); });
  foto.append(img, crear("span", "tarjeta-icono", cat ? cat.icono : "🍜"));

  const velo = crear("div", "tarjeta-velo");
  const minuto = crear("span", "tarjeta-tiempo", rec.min + " " + t("receta.min"));
  const marca = crear("span", "marca-elegida", "✓");

  const cuerpo = crear("div", "tarjeta-cuerpo");
  cuerpo.append(crear("div", "tarjeta-nombre", t("r." + rec.id + ".n")));
  const nat = nombreNativo(rec, "tarjeta-nativo");
  if (nat) cuerpo.append(nat);

  const meta = crear("div", "tarjeta-meta");
  // Sólo se muestra si difiere de las porciones con las que viene escrita.
  if (porciones[rec.id] && porciones[rec.id] !== rec.por) {
    meta.append(crear("span", "tarjeta-porciones", t("receta.porciones", { n: porciones[rec.id] })));
  }
  const paisEl = crear("span", "pais");
  const bandera = document.createElement("img");
  bandera.className = "bandera-mini";
  bandera.src = "assets/banderas/" + rec.pais + ".jpg";
  bandera.alt = "";
  bandera.loading = "lazy";
  bandera.addEventListener("error", () => bandera.remove());
  paisEl.append(bandera, crear("span", null, t("pais." + rec.pais)));
  meta.append(paisEl);

  const dif = crear("span", "puntos-dif");
  for (let i = 1; i <= 3; i++) dif.append(crear("span", "punto" + (i <= rec.dif ? " on" : "")));
  meta.append(dif);
  cuerpo.append(meta);

  // Distintivo para ver de un vistazo cuáles tienen video.
  if (idDeYouTube(rec.video)) {
    const sello = crear("span", "tarjeta-video", "▶");
    sello.title = t("receta.verVideo");
    el.append(sello);
  }

  el.append(foto, velo, minuto, marca, cuerpo);
  return el;
}

// ---------- modal ----------
// Se redibuja sola cada vez que cambian las porciones, así que vive aparte
// del armado del modal.
// Recibe el <ul> porque al armar el modal todavía no está en el documento y
// $("#ing-lista") devolvería null. Al cambiar las porciones sí se puede buscar.
function pintarIngredientes(rec, ul) {
  ul = ul || $("#ing-lista");
  if (!ul) return;
  ul.textContent = "";
  ingredientesPara(rec, porcionesDe(rec)).forEach(({ i, c, u }) => {
    const li = crear("li");
    const nombre = crear("span");
    nombre.append(document.createTextNode(t("i." + i) + " "));
    if (INGREDIENTES[i] && INGREDIENTES[i].alacena) nombre.append(crear("span", "estrella", "★"));
    li.append(nombre, crear("span", "c", cantidad(c, u)));
    ul.append(li);
  });
}

let recetaAbierta = null;
let ultimoFoco = null;

function abrirModal(id) {
  const rec = RECETAS.find((r) => r.id === id);
  if (!rec) return;
  recetaAbierta = rec;
  ultimoFoco = document.activeElement;

  const cat = CATEGORIAS.find((c) => c.id === rec.cat);
  const cont = $("#modal-contenido");
  cont.textContent = "";

  // Dos columnas: la foto entera de un lado, la receta del otro. En pantallas
  // angostas el CSS las apila.
  const doble = crear("div", "modal-doble");
  doble.dataset.cat = rec.cat;

  // ---------------- lado de la foto ----------------
  const ladoFoto = crear("div", "modal-lado-foto");
  const fotoModal = document.createElement("img");
  fotoModal.src = "assets/platos/" + rec.id + ".jpg";
  fotoModal.alt = t("r." + rec.id + ".n");
  fotoModal.addEventListener("error", () => {
    fotoModal.remove();
    ladoFoto.classList.add("sin-foto");
  });
  ladoFoto.append(fotoModal, crear("span", "modal-icono", cat ? cat.icono : "🍜"));
  ladoFoto.append(crear("div", "modal-foto-velo"));

  // El nombre va sobre la foto, como en una carta de restaurante.
  const rotulo = crear("div", "modal-rotulo");
  const h2 = crear("h2", "modal-titulo", t("r." + rec.id + ".n"));
  h2.id = "modal-titulo";
  rotulo.append(h2);
  const natModal = nombreNativo(rec, "modal-nativo");
  if (natModal) rotulo.append(natModal);
  ladoFoto.append(rotulo);

  // Si la receta tiene video, un botón de play sobre la foto. El iframe se
  // crea recién al tocarlo: cargarlo de entrada le suma medio mega y una
  // conexión a YouTube a cada receta que abrís, la mires o no.
  const idVideo = idDeYouTube(rec.video);
  if (idVideo) {
    const play = crear("button", "modal-play");
    play.setAttribute("aria-label", t("receta.verVideo"));
    play.append(crear("span", "modal-play-icono", "▶"), crear("span", "modal-play-texto", t("receta.verVideo")));
    play.addEventListener("click", () => {
      const marco = crear("div", "modal-video");
      const ifr = document.createElement("iframe");
      ifr.src = "https://www.youtube-nocookie.com/embed/" + idVideo + "?autoplay=1&rel=0&modestbranding=1";
      ifr.title = t("r." + rec.id + ".n");
      ifr.setAttribute("allow", "accelerometer; autoplay; encrypted-media; picture-in-picture");
      ifr.setAttribute("allowfullscreen", "");
      ifr.setAttribute("frameborder", "0");
      marco.append(ifr);
      ladoFoto.classList.add("con-video");
      ladoFoto.append(marco);
    });
    ladoFoto.append(play);
  }

  doble.append(ladoFoto);

  // ---------------- lado de la receta ----------------
  const ladoTexto = crear("div", "modal-lado-texto");
  ladoTexto.id = "modal-lado-texto";

  const intro = crear("div", "modal-seccion anim");
  intro.append(conNegritas(t("r." + rec.id + ".d"), "p", "modal-desc"));

  const datos = crear("div", "modal-datos");
  const dato = (etiqueta, valor) => {
    const d = crear("span", "dato");
    d.append(document.createTextNode(etiqueta + " "), crear("strong", null, valor));
    return d;
  };
  const origen = dato(t("receta.origen"), t("pais." + rec.pais));
  const banderaModal = document.createElement("img");
  banderaModal.className = "bandera-modal";
  banderaModal.src = "assets/banderas/" + rec.pais + ".jpg";
  banderaModal.alt = "";
  banderaModal.addEventListener("error", () => banderaModal.remove());
  origen.prepend(banderaModal);
  datos.append(origen);
  datos.append(dato("⏱", rec.min + " " + t("receta.min")));

  // Las porciones son lo único de la ficha que se puede tocar: al cambiarlas
  // se recalculan los ingredientes acá y en la lista de compras.
  const selPor = crear("label", "dato dato-porciones");
  selPor.append(document.createTextNode("🍽 "));
  const sel = document.createElement("select");
  sel.className = "sel-porciones";
  sel.id = "sel-porciones";
  sel.setAttribute("aria-label", t("receta.porcionesAjustar"));
  opcionesPorciones(rec.por).forEach((n) => {
    const op = document.createElement("option");
    op.value = String(n);
    op.textContent = t("receta.porciones", { n });
    if (n === porcionesDe(rec)) op.selected = true;
    sel.append(op);
  });
  sel.addEventListener("change", () => {
    const n = Number(sel.value);
    if (n === rec.por) delete porciones[rec.id];
    else porciones[rec.id] = n;
    guardar(CLAVE_PORCIONES, porciones);
    pintarIngredientes(rec);
    render();
  });
  selPor.append(sel);
  datos.append(selPor);

  datos.append(dato(t("receta.dificultad"), t("receta.dif" + rec.dif)));
  intro.append(datos);
  ladoTexto.append(intro);

  // --- ingredientes ---
  const secIng = crear("div", "modal-seccion anim");
  secIng.append(crear("h3", null, t("receta.ingredientes")));
  const ul = crear("ul", "ing-lista");
  ul.id = "ing-lista";
  secIng.append(ul);
  secIng.append(crear("p", "sub", t("receta.alacenaNota")));
  ladoTexto.append(secIng);
  pintarIngredientes(rec, ul);

  // --- pasos ---
  const secPasos = crear("div", "modal-seccion anim");
  secPasos.append(crear("h3", null, t("receta.pasos")));
  const ol = crear("ol", "pasos");
  for (let p = 1; p <= rec.pasos; p++) {
    ol.append(conNegritas(t("r." + rec.id + ".p" + p), "li"));
  }
  secPasos.append(ol);
  ladoTexto.append(secPasos);

  // --- acción ---
  const acc = crear("div", "modal-seccion anim");
  const btn = crear("button", "btn btn-ancho " + (seleccion.has(rec.id) ? "btn-linea" : "btn-oro"));
  btn.id = "btn-toggle";
  btn.textContent = seleccion.has(rec.id) ? t("receta.quitar") : t("receta.agregar");
  acc.append(btn);
  ladoTexto.append(acc);

  doble.append(ladoTexto);
  cont.append(doble);

  $("#modal-fondo").classList.add("abierto");
  document.body.style.overflow = "hidden";
  // Sólo scrollea la columna de texto; la foto se queda quieta.
  ladoTexto.scrollTop = 0;
  $("#modal").scrollTop = 0;
  setTimeout(() => $("#modal-cerrar").focus(), 60);
}

function cerrarModal() {
  $("#modal-fondo").classList.remove("abierto");
  document.body.style.overflow = "";
  recetaAbierta = null;
  if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
}

$("#modal-cerrar").addEventListener("click", cerrarModal);
// Cerrar tocando fuera, pero no al soltar el mouse dentro y arrastrar afuera.
$("#modal-fondo").addEventListener("mousedown", (e) => {
  if (e.target === $("#modal-fondo")) cerrarModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && recetaAbierta) cerrarModal();
  // El foco queda atrapado dentro del modal mientras está abierto.
  if (e.key === "Tab" && recetaAbierta) {
    const focos = $("#modal").querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }
});

$("#modal-contenido").addEventListener("click", (e) => {
  if (!e.target.closest("#btn-toggle") || !recetaAbierta) return;
  alternar(recetaAbierta.id);
  const dentro = seleccion.has(recetaAbierta.id);
  const btn = $("#btn-toggle");
  btn.textContent = dentro ? t("receta.quitar") : t("receta.agregar");
  btn.className = "btn btn-ancho " + (dentro ? "btn-linea" : "btn-oro");
});

function alternar(id) {
  if (seleccion.has(id)) {
    seleccion.delete(id);
    aviso(t("receta.quitar"));
  } else {
    seleccion.add(id);
    aviso(t("receta.enSeleccion") + " ✓");
  }
  guardar(CLAVE_SEL, [...seleccion]);
  render();
}

// Abrir receta desde cualquier grilla.
document.addEventListener("click", (e) => {
  const tj = e.target.closest(".tarjeta");
  if (tj) abrirModal(tj.dataset.receta);
});

// ---------- selector de países ----------
// Es la pantalla de entrada: solo banderas. Al elegir una se entra a sus recetas.
function renderPaises() {
  const g = $("#grilla-paises");
  g.textContent = "";

  PAISES.forEach((cod) => {
    const n = RECETAS.filter((r) => r.pais === cod).length;
    if (!n) return;

    const el = crear("button", "pais-carta");
    el.dataset.pais = cod;

    const marco = crear("div", "pais-marco");
    const img = document.createElement("img");
    img.src = "assets/banderas/" + cod + ".jpg";
    img.alt = t("pais." + cod);
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    marco.append(img);

    const pie = crear("div", "pais-pie");
    pie.append(crear("div", "pais-nombre", t("pais." + cod)));

    el.append(marco, pie);
    g.append(el);
  });
}

$("#grilla-paises").addEventListener("click", (e) => {
  const c = e.target.closest(".pais-carta");
  if (!c) return;
  pais = c.dataset.pais;
  tipo = "todo";
  categoria = "todas";
  busqueda = "";
  $("#buscador").value = "";
  $$("#chips-tipo .chip").forEach((b) => b.classList.toggle("activo", b.dataset.tipo === "todo"));
  irA("recetas");
});
// ---------- cabecera del país elegido ----------
function pintarHeroPais() {
  const hero = $("#pais-hero");
  const hay = pais !== "todos";
  hero.classList.toggle("sin-pais", !hay);
  if (!hay) {
    $("#pais-hero-nombre").textContent = t("filtro.todos_paises");
    $("#pais-hero-sub").textContent = "";
    return;
  }
  const img = $("#pais-hero-img");
  img.src = "assets/banderas/" + pais + ".jpg";
  $("#pais-hero-nombre").textContent = t("pais." + pais);
  const n = RECETAS.filter((r) => r.pais === pais).length;
  $("#pais-hero-sub").textContent = t("filtro.resultados", { n });
}

// ---------- render ----------
function renderRecetas() {
  pintarHeroPais();
  construirChipsCategoria();
  const lista = recetasFiltradas();
  // El hero ya dice cuántas tiene el país; el conteo solo aparece si un filtro
  // lo cambia, para no repetir el mismo número dos veces.
  const total = pais === "todos" ? RECETAS.length : RECETAS.filter((r) => r.pais === pais).length;
  $("#conteo").textContent = lista.length === total ? "" : t("filtro.resultados", { n: lista.length });

  const g = $("#grilla");
  g.textContent = "";
  lista.forEach((r) => g.append(tarjeta(r)));
  $("#sin-resultados").classList.toggle("oculto", lista.length > 0);
}

function renderSeleccion() {
  const elegidas = RECETAS.filter((r) => seleccion.has(r.id));
  const g = $("#grilla-seleccion");
  g.textContent = "";
  elegidas.forEach((r) => g.append(tarjeta(r)));

  const hay = elegidas.length > 0;
  $("#seleccion-vacia").classList.toggle("oculto", hay);
  $("#seleccion-acciones").classList.toggle("oculto", !hay);

  const compras = listaDeCompras([...seleccion], false, porciones);
  const nIng = Object.values(compras).reduce((a, l) => a + l.length, 0);
  $("#seleccion-sub").textContent = hay
    ? t("seleccion.intro", { n: elegidas.length, ing: nIng })
    : "";
}

function renderCompras() {
  const incluirAlacena = $("#chk-alacena").checked;
  const grupos = listaDeCompras([...seleccion], incluirAlacena, porciones);
  const cont = $("#compras-lista");
  cont.textContent = "";

  const hay = seleccion.size > 0;
  $("#compras-vacia").classList.toggle("oculto", hay);
  $("#compras-acciones").classList.toggle("oculto", !hay);
  $("#compras-sub").textContent = hay ? t("compras.intro", { n: seleccion.size }) : "";

  if (!hay) return;

  SECCIONES.forEach((sec) => {
    const items = grupos[sec];
    if (!items || !items.length) return;
    const bloque = crear("div", "bloque");
    bloque.append(crear("div", "bloque-titulo", t("sec." + sec)));

    const ul = crear("ul", "lista");
    items.forEach((item) => {
      const clave = item.id + "|" + item.u;
      const li = crear("li" , tachados.has(clave) ? "hecha" : "");

      const casilla = crear("button", "casilla" + (tachados.has(clave) ? " marcada" : ""));
      casilla.dataset.clave = clave;
      casilla.setAttribute("aria-label", t("i." + item.id));

      const nombre = crear("div", "nombre");
      nombre.append(crear("div", null, t("i." + item.id)));
      if (item.recetas.length > 1) {
        nombre.append(crear("div", "para", t("compras.paraRecetas", { n: item.recetas.length })));
      }

      li.append(casilla, nombre, crear("span", "cant", cantidad(item.c, item.u)));
      ul.append(li);
    });
    bloque.append(ul);
    cont.append(bloque);
  });

  if (!incluirAlacena) {
    const nota = crear("p", "sub", t("compras.alacenaNota"));
    cont.append(nota);
  }
}

$("#compras-lista").addEventListener("click", (e) => {
  const c = e.target.closest(".casilla");
  if (!c) return;
  const clave = c.dataset.clave;
  if (tachados.has(clave)) tachados.delete(clave); else tachados.add(clave);
  guardar(CLAVE_TACHADOS, [...tachados]);
  renderCompras();
});

$("#chk-alacena").addEventListener("change", renderCompras);

function renderAlacena() {
  const items = itemsAlacena();
  const cont = $("#alacena-lista");
  cont.textContent = "";

  const porSeccion = {};
  items.forEach((it) => (porSeccion[it.sec] = porSeccion[it.sec] || []).push(it));

  SECCIONES.forEach((sec) => {
    const lista = porSeccion[sec];
    if (!lista) return;
    const bloque = crear("div", "bloque");
    bloque.append(crear("div", "bloque-titulo", t("sec." + sec)));
    const ul = crear("ul", "lista");
    lista.forEach((it) => {
      const li = crear("li", alacena.has(it.id) ? "hecha" : "");
      const casilla = crear("button", "casilla" + (alacena.has(it.id) ? " marcada" : ""));
      casilla.dataset.alacena = it.id;
      casilla.setAttribute("aria-label", t("i." + it.id));
      li.append(casilla, crear("div", "nombre", t("i." + it.id)));
      ul.append(li);
    });
    bloque.append(ul);
    cont.append(bloque);
  });

  const tengo = items.filter((i) => alacena.has(i.id)).length;
  const pct = items.length ? Math.round((tengo / items.length) * 100) : 0;
  $("#progreso-barra").style.width = pct + "%";
  $("#progreso-texto").textContent = pct === 100
    ? t("alacena.completa")
    : t("alacena.progreso", { n: tengo, total: items.length });
}

$("#alacena-lista").addEventListener("click", (e) => {
  const c = e.target.closest(".casilla");
  if (!c) return;
  const id = c.dataset.alacena;
  if (alacena.has(id)) alacena.delete(id); else alacena.add(id);
  guardar(CLAVE_ALA, [...alacena]);
  renderAlacena();
});

function render() {
  const n = seleccion.size;
  const globo = $("#globo-sel");
  globo.textContent = n;
  globo.classList.toggle("oculto", n === 0);

  if (vista === "paises") renderPaises();
  if (vista === "recetas") renderRecetas();
  if (vista === "seleccion") renderSeleccion();
  if (vista === "compras") renderCompras();
  if (vista === "alacena") renderAlacena();
  // La grilla de recetas se mantiene al día aunque no esté visible.
  if (vista !== "recetas") renderRecetas();
  if (vista !== "paises") renderPaises();
}

// ---------- acciones sueltas ----------
$("#btn-ir-compras").addEventListener("click", () => irA("compras"));

$("#btn-limpiar").addEventListener("click", () => {
  seleccion.clear();
  tachados.clear();
  guardar(CLAVE_SEL, []);
  guardar(CLAVE_TACHADOS, []);
  render();
});

$("#btn-copiar").addEventListener("click", () => {
  const grupos = listaDeCompras([...seleccion], $("#chk-alacena").checked);
  const lineas = [t("compras.titulo").toUpperCase(), ""];
  SECCIONES.forEach((sec) => {
    const items = grupos[sec];
    if (!items || !items.length) return;
    lineas.push("— " + t("sec." + sec).toUpperCase());
    items.forEach((i) => lineas.push("  · " + t("i." + i.id) + " — " + cantidad(i.c, i.u)));
    lineas.push("");
  });
  const texto = lineas.join("\n");
  const listo = () => aviso(t("compras.copiado"));
  if (navigator.clipboard) { navigator.clipboard.writeText(texto).then(listo, listo); return; }
  const ta = crear("textarea");
  ta.value = texto;
  document.body.append(ta);
  ta.select();
  try { document.execCommand("copy"); } catch { /* sin permiso */ }
  ta.remove();
  listo();
});

// ---------- arranque ----------
aplicarIdioma();
