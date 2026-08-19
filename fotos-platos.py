# Recorta y optimiza fotos de platos al formato de la tarjeta.
#
#   python fotos-platos.py "C:\Users\ASUS\Downloads\japon"
#
# Deja los .jpg listos en assets/platos/ y avisa cuáles quedaron sin asociar.
#
# El archivo se asocia a la receta por PREFIJO del nombre, no por igualdad, así
# que no importa si trae fechas, guiones bajos o caracteres raros al final.
# Si un archivo no matchea, se lista al terminar y se agrega su prefijo abajo.
#
# El recorte va a lo alto completo y centrado: en estas fotos el plato está
# siempre en el medio del cuadro, así que perder los costados es mejor que
# perder el plato.
from PIL import Image
import os, sys, unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(AQUI, 'assets', 'platos')
ANCHO, ALTO = 900, 1125          # 4:5, la proporción de la tarjeta
CALIDAD = 84

PREFIJOS = {
    # ---------------- China ----------------
    'char_siu': 'char_siu',
    'chongqing': 'chongqing_noodles',
    'dan_dan': 'dan_dan',
    'garlic_chili_shrimp': 'camarones_ajo_chile',
    'hot_and_sour': 'sopa_agripicante',
    'hui_guo_rou': 'twice_cooked_pork',
    'twice_cooked': 'twice_cooked_pork',
    'kung_pao': 'kung_pao',
    'mapo_tofu': 'mapo_tofu',
    'mongolian': 'mongolian_beef',
    'wonton': 'wonton_soup',
    'yangzhou': 'arroz_yangzhou',

    # ---------------- Corea ----------------
    'bibimbap': 'bibimbap',
    'bossam': 'bossam',
    'bulgogi': 'bulgogi',
    'dakgalbi': 'dakgalbi',
    'fresh_kimchi': 'kimchi',
    'kimchi_jjigae': 'kimchi_jjigae',
    'kimchi_stew': 'kimchi_jjigae',
    'kimchi': 'kimchi',              # va después de los kimchi_* más largos
    'galbi': 'galbi',
    'gamjatang': 'gamjatang',
    'haemul_pajeon': 'haemul_pajeon',
    'pajeon': 'haemul_pajeon',
    'hotteok': 'hotteok',
    'jajangmyeon': 'jajangmyeon',
    'japchae': 'japchae',
    'kimbap': 'kimbap',
    'gimbap': 'kimbap',
    'kongguksu': 'kongguksu',
    'mandu': 'mandu',
    'samgyeopsal': 'samgyeopsal',
    'samgyetang': 'samgyetang',
    'sundubu': 'sundubu_jjigae',
    'tteokbokki': 'tteokbokki',
    'yangnyeom': 'yangnyeom_chicken',

    # ---------------- Japón ----------------
    'dorayaki': 'dorayaki',
    'gyudon': 'gyudon',
    'hiyashi': 'hiyashi_chuka',
    'karaage': 'karaage',
    'katsu_curry': 'katsu_curry',
    'katsudon': 'katsudon',
    'matcha': 'matcha_cookies',
    'miso_ramen': 'miso_ramen',
    'miso_shiru': 'miso_shiru',
    'miso_soup': 'miso_shiru',
    'mochi': 'mochi',
    'okonomiyaki': 'okonomiyaki',
    'salmon_teriyaki': 'salmon_teriyaki',
    'chicken_teriyaki': 'pollo_teriyaki',
    'pollo_teriyaki': 'pollo_teriyaki',
    'shio_ramen': 'shio_ramen',
    'shoyu_ramen': 'shoyu_ramen',
    'takoyaki': 'takoyaki',
    'tantanmen': 'tantanmen',
    'tonkatsu': 'tonkatsu',
    'tonkotsu': 'tonkotsu_ramen',
    'tsukemen': 'tsukemen',
    'yakisoba': 'yakisoba',

    # ---------------- Tailandia ----------------
    'banana_roti': 'banana_roti',
    'roti': 'banana_roti',
    'boat_noodles': 'boat_noodles',
    'gaeng_keow': 'gaeng_keow_wan',
    'green_curry_veg': 'curry_verde_verduras',
    'green_curry': 'gaeng_keow_wan',
    'gai_pad_krapow': 'gai_pad_krapow',
    'pad_krapow': 'gai_pad_krapow',
    'gai_tod': 'gai_tod',
    'gai_yang': 'gai_yang',
    'khao_man_gai': 'khao_man_gai',
    'khao_niao': 'khao_niao',
    'sticky_rice_plain': 'khao_niao',
    'khao_pad': 'khao_pad',
    'khao_soi': 'khao_soi',
    'larb': 'larb_moo',
    'mango_sticky': 'mango_sticky_rice',
    'massaman': 'massaman',
    'nam_tok': 'nam_tok',
    'pad_kee_mao': 'pad_kee_mao',
    'pad_pak_boong': 'pad_pak_boong',
    'pad_see_ew': 'pad_see_ew',
    'pad_thai': 'pad_thai',
    'panang': 'panang',
    'som_tam': 'som_tam',
    'tom_kha': 'tom_kha_gai',
    'tom_saap': 'tom_saap',
    'tom_yum': 'tom_yum_goong',

    # ---------------- resto ----------------
    'chili_crab': 'chili_crab',
    'egg_tart': 'egg_tarts',
    'hainanese': 'hainanese_chicken',
    'laksa': 'laksa',
    'nasi_goreng': 'nasi_goreng',
    'pho_bo': 'pho_bo',
    'pho': 'pho_bo',
    'rendang': 'rendang',
}

# Se prueban de más largo a más corto: así 'kimchi_jjigae' gana sobre 'kimchi'.
ORDEN = sorted(PREFIJOS.items(), key=lambda kv: -len(kv[0]))


def normalizar(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()


def recortar(im):
    w, h = im.size
    ancho_recorte = round(h * ANCHO / ALTO)
    if ancho_recorte <= w:                       # horizontal: se recorta a los costados
        izq = (w - ancho_recorte) // 2
        im = im.crop((izq, 0, izq + ancho_recorte, h))
    else:                                        # vertical: se recorta arriba y abajo
        alto_recorte = round(w * ALTO / ANCHO)
        arriba = (h - alto_recorte) // 3         # a un tercio: deja más aire arriba que mantel abajo
        im = im.crop((0, arriba, w, arriba + alto_recorte))
    return im.resize((ANCHO, ALTO), Image.LANCZOS)


def main():
    if len(sys.argv) < 2 or not os.path.isdir(sys.argv[1]):
        print('uso: python fotos-platos.py <carpeta con las fotos>')
        return 1

    src = sys.argv[1]
    os.makedirs(DST, exist_ok=True)
    hechas, sin_mapear, total = [], [], 0

    for archivo in sorted(os.listdir(src)):
        if not archivo.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            continue
        nombre = normalizar(archivo)
        # Primero por prefijo, que es lo mas seguro. Si no hay, se busca el
        # prefijo en cualquier parte del nombre: archivos como
        # "Fresh_tantanmen_..." o "Galletas_de_Matcha_..." llevan la palabra
        # adentro y no al principio. Se prueba de mas largo a mas corto para
        # que "miso_ramen" gane sobre "miso_shiru".
        receta = next((r for p, r in ORDEN if nombre.startswith(p)), None)
        como = "prefijo"
        if not receta:
            receta = next((r for p, r in ORDEN if p in nombre), None)
            como = "contenido"
        if not receta:
            sin_mapear.append(archivo)
            continue

        im = recortar(Image.open(os.path.join(src, archivo)).convert('RGB'))
        salida = os.path.join(DST, receta + '.jpg')
        im.save(salida, 'JPEG', quality=CALIDAD, optimize=True)
        kb = round(os.path.getsize(salida) / 1024)
        total += kb
        hechas.append(receta)
        print(f'  {receta + ".jpg":26} {kb} KB{"" if como == "prefijo" else "   (por contenido)"}')

    if sin_mapear:
        print('\n  sin asociar — agregar su prefijo a PREFIJOS:')
        for f in sin_mapear:
            print('   ', f)

    print(f'\n{len(hechas)} fotos procesadas · {total} KB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
