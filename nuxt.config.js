import colors from 'vuetify/es5/util/colors';

export default {
    ssr: false,
    server: {
        host: '0'
    },
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        titleTemplate: '%s | Gestpart-o-matic',
        title: 'Gestpart-o-matic',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { hid: 'description', name: 'description', content: '' }
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: ['@/assets/style/main.scss'],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '~/plugins/vee-validate', // Contrôles de surface
        { src: '~/plugins/axios', mode: 'client' }, // Intercepteur des retours API pour éventuellement redirection vers la page de login
        { src: '~/plugins/refresh-token.client', mode: 'client' } // Rafraichissement périodique du JWT
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify'
    ],

    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: ['@nuxtjs/axios'],

    axios: {
        credentials: true,
        proxy: true
    },

    proxy: {
        '/api': {
            target: 'http://localhost:3001',
            pathRewrite: { '^/api/': '' },
            changeOrigin: true
        }
    },

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        customVariables: ['~/assets/style/variables.scss'],
        treeShake: true,
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: '#26a69a',
                    accent: '#14ffec'
                },
                dark: {
                    primary: '#0d7377',
                    accent: '#14ffec'
                }
            }
        }
    },

    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {
        transpile: ['vee-validate/dist/rules']
    }
};
