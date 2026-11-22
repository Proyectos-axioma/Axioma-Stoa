import { config, fields, collection } from '@keystatic/core';
import { GITHUB_REPO, SITE_PROPIETARIO } from './src/consts';
const isProd = import.meta.env.PROD;

export default config({
// Aqui cambiale dependiendo de tu usuario y la repo, si no, no te deja accerder, revisa consts.ts
    storage: isProd 
    ? {
        kind: 'github',
        repo: GITHUB_REPO, 
      }
    : {
        kind: 'local',
      },
    collections: {
// --- COLECCIÓN DE PRODUCTOS ---
        productos: collection({
            label: 'Productos',
            slugField: 'nombre', // El nombre del archivo se generará a partir del nombre del producto
            path: 'src/content/productos/*',
            format: { contentField: 'content' }, // Separa el frontmatter del contenido Markdown
            schema: {
                nombre: fields.slug({
                    name: {
                        label: 'Nombre del Producto *',
                        validation: { isRequired: true, length: { min: 1 } }
                    }
                }),
                descripcion: fields.text({
                    label: 'Descripción corta *',
                    multiline: true,
                    validation: { isRequired: true, length: { min: 1 } }
                }),
                precio: fields.number({
                    label: 'Precio original ($) *',
                    validation: { isRequired: true, min: 0 }
                }),
                precioDescuento: fields.number({
                    label: 'Precio de oferta (Opcional - Dejar vacío si no aplica)',
                    validation: { min: 0 }
                }),
                categorias: fields.array(
                    fields.text({
                        label: 'Categoría *',
                        validation: { isRequired: true, length: { min: 1 } }
                    }),
                    {
                        label: 'Categorías (Mínimo 1) *',
                        itemLabel: props => props.value || 'Categoría sin nombre',
                        validation: { length: { min: 1 } }
                    }
                ),
                subcategorias: fields.array(
                    fields.text({
                        label: 'Subcategoría',
                        validation: { isRequired: true, length: { min: 1 } }
                    }),
                    {
                        label: 'Subcategorías (Opcional)',
                        itemLabel: props => props.value || 'Subcategoría sin nombre'
                    }
                ),
// Keystatic guardará las imágenes directamente en tu carpeta de assets
                imagenPrincipal: fields.image({
                    label: 'Imagen Principal *',
                    directory: 'src/assets/productos',
                    publicPath: '../../assets/productos/',
                    validation: { isRequired: true }
                }),
                imagenesSecundarias: fields.array(
                    fields.image({
                        label: 'Imagen',
                        directory: 'src/assets/productos',
                        publicPath: '../../assets/productos/',
                        validation: { isRequired: true }
                    }),
                    {
                        label: 'Galería Secundaria (Opcional - Máximo 5 fotos)',
                        validation: { length: { max: 5 } }
                    }
                ),
                disponibilidad: fields.checkbox({ label: '¿Hay stock disponible?', defaultValue: true }),
                destacado: fields.checkbox({ label: '¿Mostrar en el Hero de la portada?', defaultValue: false }),
        // Este es el campo grande de texto donde el cliente puede escribir el detalle usando negritas, listas, etc.
                content: fields.mdx({
                    label: 'Detalles completos del producto',
                    options: {
                        image: {
                            directory: 'src/assets/productos',
                            publicPath: '../../assets/productos/'
                        }
                    }
                }),
            },
        }),
// --- COLECCIÓN DEL BLOG ---
        blog: collection({
            label: 'Blog',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({
                    name: {
                        label: 'Título del artículo *',
                        validation: { isRequired: true, length: { min: 1 } }
                    }
                }),
                seoTitle: fields.text({ label: 'Título SEO (Opcional - para Google)' }),
                description: fields.text({
                    label: 'Resumen (Descripción para tarjetas) *',
                    multiline: true,
                    validation: { isRequired: true, length: { min: 1 } }
                }),
                pubDate: fields.date({
                    label: 'Fecha de publicación *',
                    defaultValue: { kind: 'today' },
                    validation: { isRequired: true }
                }),

                updatedDate: fields.date({ label: 'Fecha de actualización (Opcional)' }),
                heroImage: fields.image({
                    label: 'Imagen de Portada (Opcional)',
                    directory: 'src/assets/blog',
                    publicPath: '../../assets/blog/'
                }),
            
                author: fields.text({
                    label: 'Autor',
                    defaultValue: SITE_PROPIETARIO
                }),
                categoria: fields.text({ label: 'Categoría (Opcional)' }),
            
                tags: fields.array(
                    fields.text({
                        label: 'Etiqueta',
                        validation: { isRequired: true, length: { min: 1 } }
                    }),
                    {
                        label: 'Etiquetas (Opcional)',
                        itemLabel: props => props.value || 'Etiqueta sin nombre'
                    }
                ),
            
                draft: fields.checkbox({ label: 'Borrador (Ocultar al público)', defaultValue: false }),
                destacado: fields.checkbox({ label: '¿Fijar en portada del blog?', defaultValue: false }),
                tiempoLectura: fields.number({
                    label: 'Tiempo estimado de lectura en minutos (Opcional)',
                    validation: { min: 1 }
                }),

                content: fields.mdx({
                    label: 'Contenido del artículo',
                    options: {
                        image: {
                            directory: 'src/assets/blog',
                            publicPath: '../../assets/blog/'
                        }
                    }
                }),
            },
        }),
    },
});