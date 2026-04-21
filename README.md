# ZIGURAT · Ediciones Oníricas

**Sitio web estático para la editorial independiente Zigurat Ediciones Oníricas (Buenos Aires, Argentina).**

Un sitio de una sola página (`index.html`) con estética oscura y tipografía de lujo, pensado como vitrina del catálogo editorial de Marcos Martínez.

---

## Descripción

Zigurat Ediciones Oníricas es un proyecto editorial independiente en el cruce entre filosofía, ocultismo y exploración de la conciencia. El sitio funciona como catálogo interactivo y canal de contacto directo con el autor.

> *"No publicamos para el mercado. Publicamos para quienes están dispuestos a mirarse en los espejos que otros evitan."*

---

## Estructura de archivos

```
zigurat/
├── index.html                  # Aplicación completa (HTML + CSS + JS inline)
├── server.py                   # Servidor de desarrollo local
└── assets/
    ├── icons/
    │   ├── logo blanco-22.png  # Logo horizontal (navbar)
    │   └── ZEO SIN FONDO-12.png # Símbolo (hero)
    └── colections/
        ├── Colección Dorada.png
        ├── Colección Azul 1.png … Colección Azul 4.png
        ├── Colección Verde 1.png … Colección Verde 6.png
        └── Colección Violeta 1.png … Colección Violeta 9.png
```

> **Importante:** la carpeta `assets/` no está incluida en el repositorio. Las imágenes deben colocarse manualmente siguiendo la estructura de rutas indicada arriba.

---

## Cómo usar

### Opción A — Servidor local (recomendada)

Requiere Python 3.

```bash
python server.py
```

El script inicia un servidor en `http://localhost:8080` y abre el navegador automáticamente.

### Opción B — Abrir directamente

Basta con hacer doble clic en `index.html` o abrirlo desde el navegador. No requiere build ni dependencias.

### Opción C — Deploy estático

El sitio es 100% estático. Se puede subir directamente a cualquier hosting de archivos estáticos: GitHub Pages, Netlify, Vercel, Hostinger, etc. Solo hay que asegurarse de incluir la carpeta `assets/`.

---

## Secciones del sitio

| Sección | ID | Descripción |
|---|---|---|
| Hero | `#inicio` | Portada animada con manifiesto y CTAs |
| Manifiesto | `#manifiesto` | Tres pilares filosóficos de la editorial |
| Catálogo | `#catalogo` | Grilla de libros con filtros por colección |
| Colecciones | `#colecciones` | Descripción del sistema de grados |
| Editorial | `#sobre` | Sobre Zigurat y sobre el autor |
| Adquirir | `#comprar` | Contacto directo + suscripción a novedades |

---

## Catálogo publicado

### 🟡 Colección Dorada — Grado Sabiduría (Ensayos)
- *Siete Ensayos Esotéricos*

### 🔵 Colección Azul — Grado Reflexión (Microrelatos)
- *Relatos del Zigurat I — IV* (4 volúmenes)

### 🟢 Colección Verde — Grado Umbral (Fábulas)
- *Fábulas Oníricas I — VI* (6 volúmenes)

### 🟣 Colección Violeta — Grado Iniciación (Ficciones)
- *Ficciones Esotéricas I — IX* (9 volúmenes)

**Total: 20 títulos.** Todos de autoría de Marcos Martínez.

---

## Funcionalidades técnicas

- **Cursor personalizado** — punto dorado + anillo animado que reacciona a elementos interactivos.
- **Navbar adaptativa** — transparente en el hero, con fondo y blur al hacer scroll.
- **Animaciones de entrada** — elementos con clase `.reveal` aparecen al entrar en el viewport via `IntersectionObserver`.
- **Filtros de catálogo** — los botones filtran las tarjetas por colección (azul / verde / violeta / dorada / todos).
- **Modal de detalle** — cada tarjeta abre un modal con título, colección, autor y descripción completa. Se cierra con botón, clic en overlay o tecla `Escape`.
- **Formulario de suscripción** — validación básica de email, sin backend. El suscriptor queda logueado en consola; la integración con un servicio externo (Mailchimp, etc.) está señalada con un comentario `// Aquí conectar con tu backend`.
- **Textura de grano** — overlay SVG generativo sobre toda la pantalla para estética analógica.
- **Diseño responsive** — breakpoint en `768px` que colapsa el menú, la grilla de colecciones y los botones del hero.

---

## Diseño y tipografías

El sistema visual usa variables CSS definidas en `:root`:

| Variable | Color | Uso |
|---|---|---|
| `--gold` / `--gold-light` | `#C9A84C` / `#E8C97A` | Acento principal |
| `--onyx` / `--onyx-mid` | `#080808` / `#111111` | Fondos |
| `--cream` / `--cream-muted` | `#F0EAD8` / `#9A9080` | Textos |
| `--emerald` / `--sapphire` / `--violet` | varios | Colecciones |

Tipografías cargadas desde Google Fonts:
- **Cinzel** — títulos y logos
- **Cormorant Garamond** — cuerpo de texto y manifiestos
- **Montserrat** — etiquetas, nav y botones

---

## Contacto / Adquisición

Los libros se adquieren directamente con el autor, sin intermediarios:

- **WhatsApp:** [+54 9 11 5106-2286](https://wa.me/5491151062286)
- **Email:** contacto@ziguratediciones.com

---

## Notas para desarrollo futuro

- El formulario de suscripción a novedades (`subscribeEmail()`) no tiene backend. Para activarlo, conectar con Mailchimp, ConvertKit u otro servicio de email marketing.
- Las imágenes de portada están referenciadas como archivos locales. Para producción se recomienda optimizarlas (WebP, compresión) y servir desde un CDN.
- El menú hamburguesa en mobile no está implementado (`.nav-links` se oculta con `display:none`). Si se quiere navegación mobile completa, habría que agregar ese componente.
- No hay analytics integrado. Se puede agregar Google Analytics o Plausible con un snippet en el `<head>`.
