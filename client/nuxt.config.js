import colors from 'vuetify/es5/util/colors'

export default {
  head: {
    titleTemplate: '%s - client',
    title: 'client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth-next',
  ],

  axios: {
    baseURL: process.env.API_URL,
  },

  auth: {
    localStorage: true,
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken',
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: `${process.env.API_URL}/admin/login`,
            method: 'post',
          },
          refresh: {
            url: `${process.env.API_URL}/admin/refresh-token`,
            method: 'post',
          },
          logout: true,
          user: {
            url: `${process.env.API_URL}/admin/get-admin`,
            method: 'get',
          },
        },
      },
    },
  },

  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken1,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  build: {},
}
