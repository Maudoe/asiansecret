# AsianSecret 🥢

**En línea:** https://maudoe.github.io/asiansecret/

App de recetas asiáticas. Elegís lo que tenés ganas de comer y te arma la lista de compras.

También abre local: doble clic en `index.html`. No necesita servidor ni instalación.

## Paleta

Tomada del logo con muestreo de píxeles, no a ojo:

| Uso | Color |
|---|---|
| Dorado | `#C9A961` (brillo `#E6CF81`) |
| Rojo | `#9A2F23` → `#B0342A` en la interfaz |
| Negro | `#0A0908` |
| Blanco cálido | `#FBF8EE` |
| Verde | `#4D8A63` (acento de lo fresco) |
| Azul tinta | `#1C3460` (base fría, no sale del logo) |

El fondo es `assets/fondo2.jpg` —disco rojo, anillo dorado y bambú— **a pantalla completa y
fija**: no se mueve con el scroll, así que el contenido pasa por delante de una escena quieta.
Con `cover` el disco se ubica solo, sin importar la proporción de la ventana.

Encima va el velo que la convierte en fondo y no en ilustración. Dos capas:

1. Un oscurecido que **baja hacia el pie**, donde se acumula el contenido
2. Un apagado del **centro**, que es donde cae el disco rojo y donde más molesta

Es el punto en el que la imagen se sigue leyendo entera y el texto encima no pelea. Se probaron
tres intensidades: más claro y los nombres de los países se pierden sobre el disco; más oscuro y
la imagen deja de verse.

> `html { overflow-x: clip; }` — los adornos de la cabecera se dibujan a propósito más grandes
> que su caja y arrastraban 8 px de scroll horizontal. El guardia va en `html`, que es quien
> tiene el scroll; en `body` no hace nada.

La tipografía de títulos es serif, para acompañar el "ASIAN" del logo.
### El velo global

Encima de **todo** —banderas, tarjetas, barra de navegación— va `.velo-global`, un `<div>` fijo
al final del `<body>`. Es la diferencia entre teñir el fondo y teñir la página: las tres capas
de arriba quedan *debajo* del contenido, así que las banderas seguían al 100 % de saturación y
se leían como imágenes pegadas encima. Con el velo entran en el mismo baño que el resto.

**Es azul tinta, no rojo.** Las fotos de comida son todas cálidas —chile, salsas oscuras, arroz
dorado— y sobre un velo cálido se aplastaban en una misma papilla naranja. Contra el azul saltan,
y el dorado gana muchísima presencia. El disco rojo del fondo vira a borgoña, no a violeta: con
un azul más saturado sí se ensucia, se probó.

Va en `z-index: 50`, por debajo del modal (100) y del aviso (200), que tienen que quedar
limpios. Con `pointer-events: none` para no comerse los clics.

Como apaga un poco todo, `--tenue` se levantó de `#9C9184` a `#A89C8E` para que el texto
secundario no pierda legibilidad.

La tipografía de títulos es serif, para acompañar el "ASIAN" del logo.

## Traducción

**Todo el texto visible vive en `language/`.** `js/data.js` no tiene una sola palabra traducible:
sólo identificadores, cantidades y números.

```js
registerLang("es", { "r.khao_soi.n": "Khao Soi", ... });
```

Para agregar un idioma: copiar `es.js`, traducir los valores, cambiar el código en
`registerLang("xx", …)`, sumar el `<script>` en `index.html` y un botón `data-idioma="xx"`.

> Son `.js` que envuelven un JSON en vez de `.json` puros porque el navegador bloquea leer `.json`
> locales al abrir con doble clic (CORS en `file://`). El contenido interno es JSON — se edita igual.

Hoy están **español e inglés**, con 829 claves cada uno y paridad verificada.

**La excepción:** el nombre en escritura original y su pronunciación viven en `js/data.js`,
como `nat` y `fon`, no en `language/`. 김치 es 김치 en todos los idiomas — meterlo en los
archivos de traducción significaría mantener 83 cadenas idénticas cada vez que se suma una
lengua. La romanización usa el estándar de cada una: pinyin con tonos, Revisada para el
coreano, Hepburn para el japonés, RTGS para el tailandés.

## Contenido

**83 recetas** de Tailandia, China, Japón, Corea, Vietnam, Malasia, Indonesia, Singapur y Hong Kong.

| Categoría | Recetas |
|---|---|
| 🍜 Fideos | 20 |
| 🍗 Pollo | 11 |
| 🥩 Carne | 7 |
| 🐖 Cerdo | 10 |
| 🦐 Mariscos | 6 |
| 🍚 Arroz | 7 |
| 🥬 Vegetariano | 6 |
| 🥣 Sopas | 9 |
| 🍡 Repostería | 7 |

Cada una con origen, tiempo, porciones, dificultad, ingredientes con cantidades y pasos numerados
— **439 pasos** en total, escritos con la técnica adentro (por qué se seca la proteína, por qué no
hay que hervir el miso, por qué el arroz frito se hace con arroz del día anterior).

## Cómo funciona

**Recetas** — elegís país en la portada y caés en su lista, con la bandera de cabecera. Ahí filtrás
por salado o repostería y por categoría, y hay un buscador que mira también dentro de los
ingredientes y del nombre original: escribís "tofu" y aparecen las recetas que lo usan; escribís
"라면" o "ramen" y también.

**Mi selección** — entrás a una receta, la agregás, y queda guardada en el navegador.

**Compras** — junta los ingredientes de todo lo que elegiste, **suma las cantidades** cuando el
ingrediente y la unidad coinciden, y los agrupa por sector del súper. Cada ítem se puede tachar, y
hay un botón para copiar la lista entera al portapapeles.

Lo de alacena viene **oculto por defecto**: no tiene sentido comprar salsa de soja cada vez. Un
interruptor lo muestra igual.

**Alacena** — los 46 ingredientes que hay que tener sí o sí, agrupados por sector, con casillas y
una barra de progreso. Con esa base se puede cocinar casi cualquier receta comprando sólo el fresco
del día.

## Portada: elegir país

**Lo primero que se ve al abrir son las banderas, en grande y nada más.** Se elige un país y
recién ahí aparecen sus recetas, con un `← Todos los países` arriba para volver. El botón
`Recetas` de la barra también vuelve a la portada y limpia el filtro.

El orden es el de `PAISES` en `js/data.js` — 🇨🇳 China, 🇰🇷 Corea, 🇯🇵 Japón, 🇹🇭 Tailandia,
🇻🇳 Vietnam, 🇭🇰 Hong Kong, 🇲🇾 Malasia, 🇸🇬 Singapur, 🇮🇩 Indonesia — puesto a mano, no
alfabético ni por cantidad de recetas. **Sólo aparecen los países que tienen recetas**: una
bandera que filtra a cero no le sirve a nadie. Si falta el archivo de una imagen, la tarjeta
sigue funcionando con el nombre solo.

Las tarjetas muestran únicamente la bandera y el nombre. Sin conteo de recetas.

Al pasar el mouse la bandera sube 6 px, escala un 6 % dentro de su marco y le cruza un barrido
dorado — el mismo gesto que ya tenían las tarjetas de receta.

Al entrar, la bandera se convierte en la cabecera de la sección: banner ancho con el nombre del
país y cuántas recetas tiene. Su velo se aclaró bastante — el velo global ya oscurece por encima,
así que este sumaba dos veces y la bandera casi no se veía. Reaprovecha la imagen que ya está en vez de pedir otra, y le da
identidad a cada país sin sumar peso. La bandera se repite chiquita en cada tarjeta y en el modal.

El logo se achica y el lema desaparece cuando salís de la portada, para que la comida empiece
más arriba.

Las imágenes van a 640 px de ancho (~38 KB cada una, 348 KB las nueve); los originales pesaban
14 MB entre todos. Ya traen su propio marco dorado, así que la tarjeta no le suma otro borde.

### La barra y el logo

La barra de navegación **se sale del contenedor** para tocar los dos bordes de la pantalla:
antes el fondo y la línea de abajo cortaban a la mitad del ancho y quedaban colgando.

```css
margin-inline: calc(50% - 50vw);
padding: 10px calc(50vw - 50%);   /* devuelve el contenido a su lugar */
```

Sin `transform`, que rompería el `position: sticky`.

El logo lleva su resplandor en `filter: drop-shadow`, no en un fondo detrás. La diferencia es
que `drop-shadow` sigue **el recorte del PNG y no su caja**, así que la luz sale del contorno
real del logo. Van cuatro capas: un halo blanco pegado al borde, dos dorados cada vez más
abiertos, y una sombra oscura abajo que lo despega del fondo.

> Se probó con un latido lento y se descartó: animar `drop-shadow` con 90 px de desenfoque es
> repintar la pantalla entera a 60 fps para siempre, en una app que queda abierta mientras
> cocinás. El resplandor quieto se lee igual.

## Las tarjetas

Cada plato es una foto vertical (4:5) con el texto encima. Las fotos van en `assets/platos/`
con el nombre del id de la receta — `bibimbap.jpg`, `khao_soi.jpg`. Están todas listadas en
`assets/platos/LEEME.txt`, con su nombre y su escritura original al lado.

**Van 11 de 83** — China completa. `LEEME.txt` marca con `[x]` las que ya están.

**La que falta no rompe nada**: la tarjeta cae en un mosaico teñido según la categoría, con su
ícono. Las fotos se pueden ir agregando de a una.

Si vienen horizontales no importa: se recortan a lo alto completo y se centran. Lo que sí importa
es que el plato no quede pegado al borde de abajo, porque ahí va el nombre sobre el degradado.

Sobre la foto van tres capas de degradado, y las tres hacen falta:

1. Negro de abajo hacia arriba, para que el nombre se lea sobre cualquier foto
2. Rojo tenue en el pie, que ata la tarjeta a la paleta
3. Un toque de dorado arriba, donde va la etiqueta del tiempo

La segunda y la tercera son las que hacen que ochenta fotos sacadas por gente distinta, con
luces distintas, se vean de la misma app. Sin ellas la grilla es un collage.

El nombre del plato va en su escritura original con la pronunciación entre paréntesis:
**Bibimbap** · 비빔밥 (bibimbap) · **Khao Soi** · ข้าวซอย (khâo soi). Así se pide sin depender de
cómo se haya traducido.

El modal repite la foto a lo ancho, fundida contra el fondo, con el mismo velo parejo encima:
sin eso una foto muy clara blanquea el modal entero y el dorado deja de leerse.

## El modal

Dos columnas: **la foto entera de un lado, la receta completa del otro**. La foto no scrollea —
el plato se ve mientras leés—, y la columna de texto lleva descripción, datos, ingredientes y
todos los pasos. Antes la foto era una banda de 16:7 arriba de todo y se veía la mitad del plato.

El nombre va sobre la foto, con su escritura original debajo, como en una carta de restaurante.

```css
grid-template-rows: minmax(0, 1fr);   /* y min-height: 0 en las dos columnas */
```

Ese par es lo que hace que funcione. Sin él la columna de texto crece con su contenido, empuja la
fila más allá del tope del modal, y el nombre sobre la foto queda recortado afuera — el modal lo
clipea y no se ve por ningún lado.

Por debajo de 880 px se apilan: foto arriba en 4:3, receta abajo. Si la receta no tiene foto, la
columna izquierda queda como panel teñido según la categoría, con su ícono.

El resto de la pieza:

- Fondo con desenfoque de 16 px y saturación aumentada
- Entrada con curva de resorte `cubic-bezier(.16, 1, .3, 1)`: sube, escala y se asienta
- Contenido en cascada, con 60 ms de diferencia entre secciones
- **Marco dorado de dos hilos**: el borde en oro claro y, por fuera, un anillo oscuro que lo
  separa del fondo desenfocado. Sin ese segundo hilo el dorado se funde con lo que haya detrás
- Pasos numerados con círculo dorado y una línea que los une, como un recorrido
- Cierra con Escape, con clic afuera o con el botón, que gira 90° al pasar el mouse
- El foco queda atrapado adentro mientras está abierto y vuelve a su lugar al cerrar
- Bloquea el scroll del fondo

Todo respeta `prefers-reduced-motion` para quien pidió menos movimiento en su sistema.

## Estructura

```
index.html          estructura, portada de países y modal
css/style.css       paleta, componentes y animaciones
js/data.js          recetas e ingredientes (sin texto visible)
js/app.js           filtros, selección, compras y alacena
language/es.js      todos los textos en español
language/en.js      todos los textos en inglés
assets/logo.png     logo (fuente de la paleta)
assets/fondo2.jpg   imagen de fondo (disco rojo, anillo dorado, bambú)
assets/fondo.jpg    textura anterior, ya sin uso
assets/banderas/    9 banderas, una por país (<código>.jpg)
assets/platos/      fotos de los platos (<id receta>.jpg) + LEEME.txt
```

## Videos

Cada receta puede tener su video de YouTube. Se agrega en `js/data.js`, en la receta que sea:

```js
{ id: "mapo_tofu", video: "https://youtu.be/AbCdEfGhIjK", nat: "麻婆豆腐", ... }
```

Sirve el link entero pegado del navegador, el corto de `youtu.be`, el de `/embed/`, el de
`/shorts/` o el id pelado — la app extrae lo que necesita. La receta que no lo tenga
simplemente no muestra el reproductor.

En el modal aparece un botón de play sobre la foto; al tocarlo el video la reemplaza y la foto
queda de fondo desenfocada, porque la columna es alta y el video es 16:9: con negro plano
quedaban dos bandas muertas arriba y abajo.

**El iframe se crea recién al hacer clic.** Cargarlo de entrada le sumaría medio mega y una
conexión a YouTube a cada receta que abrís, la mires o no. Se usa `youtube-nocookie.com`.

Las tarjetas con video llevan un ▶ chiquito en la esquina, para verlas de un vistazo en la grilla.

## Tests

```
node test-asian.js   datos, traducciones y cableado
node test-boot.js    arranca la app contra un DOM de juguete
```

`test-asian.js` revisa que cada receta esté completa en los dos idiomas, que no haya
ingredientes inventados, que las cantidades sumen y que todo `data-t` del HTML tenga su clave.

`test-boot.js` va más allá: ejecuta `app.js` de verdad, hace clic en una bandera, abre un modal,
reproduce un video y comprueba que todo aparezca donde tiene que aparecer. Existe porque el test estático miraba que los `id` estuvieran
en el HTML, pero no detectaba un selector roto — `$(".nav-btn")` en lugar de `$(".nav-btn")` —
que revienta recién al abrir la app en el navegador.

## Pendiente

- Ajuste de porciones: recalcular las cantidades según cuántos comen
- Tailandés como tercer idioma
