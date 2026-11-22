# 🏛️ Axioma Stoa — Plantilla Web & Blog para Astro

**Axioma Stoa** es una plantilla moderna, rápida y personalizable con **Blog integrado**, contacto directo vía **WhatsApp** y panel de administración **Keystatic CMS**, construida con **Astro**, **Tailwind CSS v4** y **DaisyUI v5**.

Desarrollada por **[Proyectos Axioma](https://github.com/Proyectos-axioma/Axioma-Stoa)** bajo licencia **MIT**.

---

## ✨ Características Principales

- 📝 **Blog Completo con SEO y RSS:** Soporte para carrusel Hero de artículos destacados (`HeroDestacados`), exploración táctil y filtrado dinámico por categorías y etiquetas (`CarruselCategorias`), carrusel de publicaciones recientes (`ArticulosRecientes`), borradores (`draft`), tiempo de lectura, imágenes OpenGraph dinámicas, Sitemap y canal RSS (`/rss.xml`).
- 💬 **Contacto Directo por WhatsApp:** Formulario de contacto que genera mensajes prellenados listos para enviar a tu número de WhatsApp.
- 🖥️ **Panel Administrable (Keystatic CMS):** Creación y edición visual de artículos del blog en formato `.mdx` desde `/keystatic` (en modo local durante el desarrollo o conectado a GitHub en producción).
- 🌗 **Modo Claro / Oscuro sin Parpadeos:** Sistema de temas con DaisyUI v5 (`lofi` y `black` por defecto) con persistencia en `localStorage` y detección del tema del sistema.

---

## 🚀 Comandos del Proyecto

> **Requisitos previos:** Node.js v22.23.4+

Ejecuta los siguientes comandos desde la raíz del proyecto:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala las dependencias del proyecto |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:4321` (con Keystatic activo en `/keystatic`) |
| `npm run build` | Compila el sitio para producción en `./dist/` |
| `npm run preview` | Previsualiza localmente la versión compilada |

---

## 🎨 Guía de Personalización

### 1. Datos Generales del Sitio (`src/consts.ts`)
El primer paso para adaptar la plantilla es editar el archivo [`src/consts.ts`](./src/consts.ts):

```ts
export const SITE_TITLE = 'Axioma Stoa';
export const SITE_DESCRIPTION = 'Descripción de tu sitio web para buscadores (SEO)';
export const SITE_PROPIETARIO = 'Proyectos Axioma'; // Autor por defecto en el blog
export const SITE_CONTACTO = '525500000000'; // Número de WhatsApp
export const SITE_CORREO = 'hola@tuempresa.com';
export const GITHUB_REPO = 'Proyectos-axioma/Axioma-Stoa'; // usuario/repositorio para Keystatic
export const SITE_URL = 'https://tusitio.com'; // Dominio final de producción
export const Facebook = 'https://facebook.com/tu-usuario';
export const X = 'https://x.com/tu-usuario';
export const Instagram = 'https://instagram.com/tu-usuario';
```

### 2. Páginas Institucionales
Personaliza los textos legales y de presentación directamente en:
- **Inicio:** [`src/pages/index.astro`](./src/pages/index.astro) *(integra los carruseles de artículos destacados, exploración por categorías/etiquetas y publicaciones recientes).*
- **Sobre Nosotros:** [`src/pages/nosotros.astro`](./src/pages/nosotros.astro) *(reemplaza los textos de ejemplo entre corchetes `[...]` y agrega la foto del autor o equipo editorial).*
- **Contacto:** [`src/pages/contacto.astro`](./src/pages/contacto.astro) *(actualiza la redacción o ubicación en la columna izquierda).*
- **Términos y Condiciones:** [`src/pages/terminos.astro`](./src/pages/terminos.astro) *(ajusta las políticas editoriales y de propiedad intelectual entre corchetes `[...]` según tu país y proyecto).*

### 3. Gestión de Artículos del Blog
Puedes administrar el contenido de dos formas:
1. **Desde el navegador (Recomendado):** Corre `npm run dev` y entra a `http://localhost:4321/keystatic` para crear, editar o borrar artículos visualmente.
2. **Directamente en archivos `.mdx`:** Edita o agrega archivos en `src/content/blog/`.

---

## ⚠️ Puntos de Cuidado Importantes

Antes de modificar la estructura interna de la plantilla, ten mucho cuidado con los siguientes puntos para no romper funcionalidades:

### 1. Cambiar los Temas de DaisyUI (Claro / Oscuro)
Si deseas cambiar los temas `lofi` (claro) y `black` (oscuro) por otros temas de DaisyUI, **debes actualizarlos en 3 lugares al mismo tiempo**:
1. [`src/styles/global.css`](./src/styles/global.css) (en el bloque `@plugin "daisyui"`).
2. [`src/components/Header.astro`](./src/components/Header.astro) (constantes `TEMA_CLARO` y `TEMA_OSCURO` del script).
3. [`src/components/BaseHead.astro`](./src/components/BaseHead.astro) (constantes `TEMA_CLARO` y `TEMA_OSCURO` del script anti-parpadeo en el `<head>`).

> **Nota:** Si solo los cambias en `global.css` y olvidas actualizar los scripts, el botón de cambio de tema dejará de aplicar los colores correctamente.

### 2. Formato del Número de Teléfono (`SITE_CONTACTO`)
En [`src/consts.ts`](./src/consts.ts), la constante `SITE_CONTACTO` debe contener **únicamente números, incluyendo el código de país, sin el signo `+`, sin espacios ni guiones** (por ejemplo: `'525512345678'` para México).
- Este formato es indispensable para que la API de WhatsApp (`https://wa.me/...`) funcione sin errores.
- Si tu número no es de 12 dígitos (código de país de 2 dígitos + 10 dígitos locales), revisa la función `formatearTelefono()` en [`src/pages/contacto.astro`](./src/pages/contacto.astro) para ajustar la expresión regular visual.

### 3. Sincronización entre Keystatic y Astro Content Collections
Si agregas, renombras o eliminas algún campo del blog:
- Debes reflejar el cambio tanto en [`keystatic.config.ts`](./keystatic.config.ts) (para el panel de administración) como en [`src/content.config.ts`](./src/content.config.ts) (validación con Zod en Astro).
- **Si agregas un campo en Keystatic pero no lo declaras en `src/content.config.ts`**, Astro lo ignorará y devolverá `undefined` al renderizar tus páginas.
- Todos los archivos de contenido utilizan extensión **`.mdx`**. No cambies la extensión de salida a `.md` ni uses `fields.document` (`.mdoc`) en `keystatic.config.ts`, o Keystatic dejará de listar los artículos existentes.

### 4. Despliegue Estático vs. Despliegue con Keystatic en Producción (Netlify / Vercel)
Por defecto, en [`astro.config.mjs`](./astro.config.mjs), la integración `keystatic()` solo se carga en **modo desarrollo (`npm run dev`)**. Esto permite compilar el sitio como 100% estático (`npm run build`) para subirlo a **GitHub Pages** o cualquier hosting estático sin errores.

Si deseas que el panel `/keystatic` esté disponible en producción (por ejemplo, en **Netlify**) conectado a GitHub:
1. Instala el adaptador correspondiente: `npx astro add netlify` (o `@astrojs/vercel`).
2. En [`astro.config.mjs`](./astro.config.mjs), agrega `adapter: netlify()` y deja `keystatic()` fijo dentro del arreglo `integrations` (quitando la condición `isDev`).
3. Actualiza `GITHUB_REPO` y `SITE_URL` en [`src/consts.ts`](./src/consts.ts).
4. Entra a `/keystatic` en tu dominio desplegado para crear y conectar tu **GitHub App**, y configura en tu panel de Netlify las variables de entorno que te solicitará Keystatic:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

---

## 📄 Licencia y Atribución (MIT)

Este proyecto se distribuye bajo la **Licencia MIT**. Eres libre de usar, copiar, modificar y distribuir esta plantilla para proyectos personales o comerciales.

### 🔗 Sobre el icono de GitHub en el Footer
En [`src/components/Footer.astro`](./src/components/Footer.astro), el icono de GitHub en el pie de página apunta por defecto a `https://github.com/Proyectos-axioma/Axioma-Stoa` como firma del autor original. 

Dependiendo de cómo gestiones el código de tu sitio, tienes dos opciones:

**1. Si tu repositorio es público y quieres que el icono apunte a tu propio código:**
Puedes cambiar libremente ese enlace en [`src/components/Footer.astro`](./src/components/Footer.astro) importando `GITHUB_REPO` desde `../consts`:

```astro
---
import { Facebook, SITE_TITLE, X, Instagram, GITHUB_REPO } from '../consts';
---
<!-- ... -->
<a href={`https://github.com/${GITHUB_REPO}`}>
    <Icon class="w-6 h-6 stroke-2" name="tabler:brand-github"/>
</a>
```

*Sugerencia:* Agradeceríamos mucho mantener el crédito y enlace a **[Proyectos Axioma](https://github.com/Proyectos-axioma/Axioma-Stoa)** dentro del archivo `README.md` de tu repositorio, aunque bajo la licencia MIT es completamente opcional.

**2. Si decides cerrar el código (repositorio privado) y quitar el icono del Footer:**
Si por motivos comerciales tu repositorio es privado y prefieres remover el icono de GitHub de la barra de redes sociales del pie de página, puedes hacerlo sin problema.

*Sugerencia:* Si lo deseas, puedes reubicar el crédito y enlace al repositorio original (`https://github.com/Proyectos-axioma/Axioma-Stoa`) en un lugar discreto del sitio (como un *"Desarrollado con Axioma Stoa"* en el Footer, en *Sobre Nosotros* o en *Términos y Condiciones*). Como indica la licencia MIT, esto no es obligatorio.

---

## 🙌 Créditos, Transparencia y Agradecimientos

- Creado y mantenido por **[Proyectos Axioma](https://github.com/Proyectos-axioma/Axioma-Stoa)**.
- Construido inicialmente a partir de la plantilla oficial **[Astro Starter Kit: Blog](https://github.com/withastro/astro/tree/main/examples/blog)** (bajo licencia MIT) y modificado para incluir integración con WhatsApp, Keystatic CMS, Tailwind CSS v4 y DaisyUI v5.
- El diseño original de la plantilla base de Astro estuvo inspirado en **[Bear Blog](https://github.com/HermanMartinus/bearblog/)** de [Herman Martinus](https://herman.bearblog.dev).
- 🤖 **Nota sobre el uso de IA:** Durante el desarrollo de esta plantilla se utilizó Inteligencia Artificial (Gemini Pro y Argon) para la creación de algunos componentes y revisar el código.
