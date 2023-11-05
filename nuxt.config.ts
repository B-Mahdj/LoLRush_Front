// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
export default defineNuxtConfig({
    app: {
        pageTransition: {name: 'page', mode: 'out-in'}
    },
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        ['@nuxtjs/google-fonts', {
            families: {
                Roboto: true,
                Inter: [400, 700],
                'Josefin+Sans': true,
                Lato: [100, 300],
                Raleway: {
                    wght: [100, 400],
                    ital: [100]
                },
            }
        }]
    ],
})
