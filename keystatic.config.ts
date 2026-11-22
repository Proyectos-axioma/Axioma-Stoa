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