// Valida datos, traducciones y cableado de AsianSecret.
const fs = require("fs"), vm = require("vm");
const dir = require("path").dirname(__filename);

const ctx = { console, IDIOMAS: {}, registerLang(c, d) { ctx.IDIOMAS[c] = d; } };
ctx.globalThis = ctx; vm.createContext(ctx);
["es", "en"].forEach((l) => vm.runInContext(fs.readFileSync(`${dir}/language/${l}.js`, "utf8"), ctx));
vm.runInContext(fs.readFileSync(`${dir}/js/data.js`, "utf8") +
  ";globalThis.__d={RECETAS,INGREDIENTES,CATEGORIAS,SECCIONES,PAISES,listaDeCompras,itemsAlacena};", ctx);
const { RECETAS, INGREDIENTES, CATEGORIAS, SECCIONES, PAISES, listaDeCompras, itemsAlacena } = ctx.__d;
const ES = ctx.IDIOMAS.es, EN = ctx.IDIOMAS.en;

let fallos = 0;
const chk = (c, m) => { if (!c) { console.log("   ❌ " + m); fallos++; } };

// ---- paridad de claves entre idiomas ----
const kEs = Object.keys(ES), kEn = Object.keys(EN);
kEs.filter((k) => !kEn.includes(k)).forEach((k) => chk(false, `falta en EN: ${k}`));
kEn.filter((k) => !kEs.includes(k)).forEach((k) => chk(false, `sobra en EN: ${k}`));
kEs.forEach((k) => {
  const ph = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  if (EN[k] && ph(ES[k]) !== ph(EN[k])) chk(false, `placeholders distintos en ${k}`);
});

// ---- cada receta completa en ambos idiomas ----
RECETAS.forEach((r) => {
  ["es", "en"].forEach((l) => {
    const D = ctx.IDIOMAS[l];
    chk(D["r." + r.id + ".n"], `falta nombre de ${r.id} en ${l}`);
    chk(D["r." + r.id + ".d"], `falta descripción de ${r.id} en ${l}`);
    for (let p = 1; p <= r.pasos; p++) {
      chk(D["r." + r.id + ".p" + p], `falta paso ${p} de ${r.id} en ${l}`);
    }
    // no debe haber pasos de más sin declarar
    chk(!D["r." + r.id + ".p" + (r.pasos + 1)], `${r.id} tiene un paso ${r.pasos + 1} sin declarar en pasos`);
  });
  chk(CATEGORIAS.some((c) => c.id === r.cat), `${r.id}: categoría desconocida ${r.cat}`);
  chk(ES["pais." + r.pais], `${r.id}: país sin traducir ${r.pais}`);
  // khao_niao es arroz y sal: no tiene sentido inflarlo para pasar el umbral.
  const MINIMO = r.id === "khao_niao" ? 2 : 4;
  chk(r.ing.length >= MINIMO, `${r.id}: sólo ${r.ing.length} ingredientes`);
  chk(r.min > 0 && r.por > 0 && r.dif >= 1 && r.dif <= 3, `${r.id}: metadatos fuera de rango`);
  r.ing.forEach(({ i, c, u }) => {
    chk(INGREDIENTES[i], `${r.id}: ingrediente inexistente "${i}"`);
    chk(c > 0, `${r.id}/${i}: cantidad inválida`);
    ["es", "en"].forEach((l) => {
      chk(ctx.IDIOMAS[l]["i." + i], `falta i.${i} en ${l}`);
      chk(ctx.IDIOMAS[l]["u." + u], `falta u.${u} en ${l}`);
    });
  });
});

// ---- ingredientes sin usar y secciones válidas ----
const usados = new Set(RECETAS.flatMap((r) => r.ing.map((x) => x.i)));
Object.entries(INGREDIENTES).forEach(([id, v]) => {
  chk(SECCIONES.includes(v.sec), `${id}: sección desconocida ${v.sec}`);
  ["es", "en"].forEach((l) => chk(ctx.IDIOMAS[l]["i." + id], `falta i.${id} en ${l}`));
});
const sinUsar = Object.keys(INGREDIENTES).filter((i) => !usados.has(i) && !INGREDIENTES[i].alacena);
if (sinUsar.length) console.log("   ⚠ ingredientes sin usar en ninguna receta:", sinUsar.join(", "));

// ---- categorías traducidas ----
CATEGORIAS.forEach((c) => ["es", "en"].forEach((l) =>
  chk(ctx.IDIOMAS[l]["cat." + c.id], `falta cat.${c.id} en ${l}`)));
SECCIONES.forEach((s) => ["es", "en"].forEach((l) =>
  chk(ctx.IDIOMAS[l]["sec." + s], `falta sec.${s} en ${l}`)));

// ---- lista de compras ----
const elegidas = ["khao_soi", "pad_thai", "bulgogi"];
const sinAlacena = listaDeCompras(elegidas, false);
const conAlacena = listaDeCompras(elegidas, true);
const contar = (g) => Object.values(g).reduce((a, l) => a + l.length, 0);
chk(contar(conAlacena) > contar(sinAlacena), "incluir alacena debería sumar ítems");
// las cantidades se suman cuando coincide la unidad
const soja = (conAlacena.salsa || []).find((x) => x.id === "salsa_soja");
chk(soja && soja.recetas.length >= 1, "no se agrupó la salsa de soja");
Object.values(sinAlacena).flat().forEach((it) => {
  chk(!INGREDIENTES[it.id].alacena, `${it.id} es de alacena y no debería estar en la compra`);
  chk(it.c > 0, `${it.id}: cantidad acumulada inválida`);
});

// ---- alacena ----
const ala = itemsAlacena();
chk(ala.length >= 15, `alacena con sólo ${ala.length} ítems`);
["sal", "pimienta_negra", "salsa_soja", "salsa_pescado"].forEach((i) =>
  chk(ala.some((x) => x.id === i), `falta ${i} en la alacena`));

// ---- países y banderas ----
// Todo país con recetas tiene que estar en PAISES y tener su bandera en disco,
// porque el chip se construye a partir de esa lista.
const paisesUsados = [...new Set(RECETAS.map((r) => r.pais))];
paisesUsados.forEach((p) => {
  chk(PAISES.includes(p), `${p} tiene recetas pero no está en PAISES`);
  chk(fs.existsSync(`${dir}/assets/banderas/${p}.jpg`), `falta assets/banderas/${p}.jpg`);
});
PAISES.forEach((p) => {
  chk(ES["pais." + p], `falta pais.${p} en es`);
  if (!paisesUsados.includes(p)) console.log(`   ⚠ ${p} está en PAISES pero no tiene recetas`);
});

// ---- html y css ----
const html = fs.readFileSync(`${dir}/index.html`, "utf8");
const css = fs.readFileSync(`${dir}/css/style.css`, "utf8");
const app = fs.readFileSync(`${dir}/js/app.js`, "utf8");

[...html.matchAll(/data-t="([^"]+)"/g)].map((m) => m[1]).forEach((k) =>
  chk(ES[k], `data-t huérfano: ${k}`));
[...html.matchAll(/data-t-ph="([^"]+)"/g)].map((m) => m[1]).forEach((k) =>
  chk(ES[k], `data-t-ph huérfano: ${k}`));
// Estos se crean dentro del modal, así que no están en el HTML estático.
const DINAMICOS = ["btn-toggle", "ing-lista", "sel-porciones", "modal-lado-texto"];
[...new Set([...app.matchAll(/\$\("#([\w-]+)"\)/g)].map((m) => m[1]))]
  .filter((id) => !DINAMICOS.includes(id))
  .forEach((id) => chk(html.includes(`id="${id}"`), `id faltante en HTML: ${id}`));
chk(app.includes('btn.id = "btn-toggle"'), "btn-toggle debería crearse en el modal");
[...new Set([...app.matchAll(/\bt\("([\w.]+)"\s*[,)]/g)].map((m) => m[1]))].forEach((k) =>
  chk(ES[k], `t() sin clave: ${k}`));

chk(!/--verde-claro:\s*#6db\s/.test(css), "quedó el typo en --verde-claro");
chk(fs.existsSync(`${dir}/assets/logo.png`), "falta assets/logo.png");
chk(fs.existsSync(`${dir}/assets/fondo2.jpg`), "falta assets/fondo2.jpg");
// El fondo se referencia desde el CSS, así que se comprueba que apunte al que existe.
chk(css.includes("assets/fondo2.jpg"), "el CSS no usa fondo2.jpg");
chk(html.includes("assets/logo.png"), "el HTML no usa el logo PNG");
chk(!html.includes("logo.jpg"), "quedó una referencia al logo JPG");

// ---- resumen ----
console.log(`Recetas: ${RECETAS.length}`);
CATEGORIAS.forEach((c) => {
  const n = RECETAS.filter((r) => r.cat === c.id).length;
  console.log(`   ${c.icono} ${ES["cat." + c.id].padEnd(14)} ${n}`);
});
console.log(`Ingredientes: ${Object.keys(INGREDIENTES).length} · de alacena: ${ala.length}`);
console.log(`Pasos totales: ${RECETAS.reduce((a, r) => a + r.pasos, 0)}`);
console.log(`Claves de idioma: ${kEs.length} × 2 idiomas`);

console.log(fallos === 0 ? "\n✅ ASIANSECRET OK" : `\n❌ ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
