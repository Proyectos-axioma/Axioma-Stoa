import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SITE_PROPIETARIO } from './consts';

// Helpers a prueba de fallos cuando Keystatic guarda strings vacíos o null en campos opcionales
const emptyStringToUndefined = (val: unknown) =>
	typeof val === 'string' && val.trim() === '' ? undefined : val;

const optionalString = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalUrl = z.preprocess(emptyStringToUndefined, z.string().url().optional());
const optionalDate = z.preprocess(
	(val) => (val === '' || val === null || val === undefined ? undefined : val),
	z.coerce.date().optional()
);
const cleanStringArray = z
	.array(z.string())
	.nullable()
	.optional()
	.transform((arr) => (arr ?? []).map((s) => s.trim()).filter(Boolean));

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
// LO OBLIGATORIO (Con respaldo a prueba de errores por si se edita manualmente o queda vacío)
			title: z.string().trim().min(1, 'El título es obligatorio').catch('Artículo sin título'),
			description: z.string().trim().min(1, 'La descripción es obligatoria').catch('Sin descripción disponible.'),
			pubDate: z.preprocess(
				(val) => (val === '' || val === null || val === undefined ? new Date() : val),
				z.coerce.date()
			),
// LO OPCIONAL (Soporta null, undefined o string vacío desde Keystatic sin romper el build)
// Fechas y Estado
			updatedDate: optionalDate,
			draft: z.boolean().nullable().optional().transform((val) => val ?? false), // Ocultar borradores al público
			destacado: z.boolean().nullable().optional().transform((val) => val ?? false), // Fijar en portada del blog
			tiempoLectura: z.number().nullable().optional(), // Tiempo estimado de lectura (minutos)

// Multimedia
			heroImage: z.preprocess(emptyStringToUndefined, image().nullable().optional()).transform((val) => val ?? undefined), // Imagen ancha de cabecera
			thumbnail: z.preprocess(emptyStringToUndefined, image().nullable().optional()).transform((val) => val ?? undefined), // Imagen cuadrada para la tarjeta (si no hay, usas heroImage)
			videoUrl: optionalUrl, // Por si quieren clavar un video de YouTube

// Taxonomía (Filtros)
			categoria: optionalString,
			categories: cleanStringArray,
			tags: cleanStringArray,

// Autoría (Por si el cliente pone a 3 personas distintas a escribir)
			author: z
				.string()
				.nullable()
				.optional()
				.transform((val) => (val && val.trim() !== '' ? val.trim() : SITE_PROPIETARIO)),
			authorRole: optionalString,
			authorImage: z.preprocess(emptyStringToUndefined, image().nullable().optional()).transform((val) => val ?? undefined),

// SEO
			seoTitle: optionalString,
			metaTitle: z.preprocess(emptyStringToUndefined, z.string().max(70).optional()), // Título optimizado solo para Google
			metaDescription: z.preprocess(emptyStringToUndefined, z.string().max(160).optional()),
			canonicalURL: optionalUrl, // Para evitar contenido duplicado

// Control de Interfaz
			showToc: z.boolean().nullable().optional().transform((val) => val ?? true), // ¿Mostrar tabla de contenidos?
			relatedPosts: cleanStringArray, // Slugs de otros posts para "Te podría interesar"
		}),
});

// Valores para los productos
const productos = defineCollection({
	loader: glob({ base: './src/content/productos', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			nombre: z.string().trim().min(1, 'El nombre del producto es obligatorio').catch('Producto sin nombre'),
			descripcion: z.string().trim().min(1, 'La descripción es obligatoria').catch('Sin descripción disponible.'),
			precio: z.coerce.number().min(0).catch(0),
			precioDescuento: z.number().min(0).nullable().optional(), // <-- Propiedad opcional (soporta vacío/null en Keystatic)
			categorias: z
				.array(z.string())
				.nullable()
				.optional()
				.transform((arr) => {
					const limpias = (arr ?? []).map((s) => s.trim()).filter(Boolean);
					return limpias.length > 0 ? limpias : ['General'];
				}),
			subcategorias: cleanStringArray,
			imagenPrincipal: z.preprocess(
				(val) => (typeof val === 'string' && val.trim() !== '' ? val : '../../assets/Placeholder.svg'),
				image()
			),
// Validamos que sea un arreglo de imágenes con un máximo de 5 (ignorando items vacíos si el usuario olvidó subir foto)
			imagenesSecundarias: z
				.preprocess(
					(val) => (Array.isArray(val) ? val.filter((item) => typeof item === 'string' && item.trim() !== '') : undefined),
					z.array(image()).max(5).optional()
				),
			disponibilidad: z.boolean().nullable().optional().transform((val) => val ?? true),
			destacado: z.boolean().nullable().optional().transform((val) => val ?? false),
		}),
});

// Exportamos ambas colecciones
export const collections = { blog, productos };