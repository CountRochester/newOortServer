
// const colors = require('vuetify/es5/util/colors').default
// const ru = require('vuetify/es5/locale/ru').default
// const keys = require('./server/keys')

import vueColors from 'vuetify/es5/util/colors.js'
import ru from 'vuetify/es5/locale/ru.js'
import keys from './server/keys/index.js'

const colors = vueColors.default

export default {
  mode: 'universal', // 'spa',
  telemetry: false,
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: './fonts/@mdi/font/css/materialdesignicons.css' },
      { rel: 'stylesheet', href: './fonts/roboto-fontface/css/roboto/roboto-fontface.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],

  env: {
    STATIC_DIR: process.env.STATIC_DIR || './static',
    UPLOAD_STORAGE: process.env.UPLOAD_STORAGE || '/file-storage/upload',
    EXT_INC_FILE_STORAGE: process.env.EXT_INC_FILE_STORAGE || '/file-storage/ext-inc',
    EXT_OUT_FILE_STORAGE: process.env.EXT_OUT_FILE_STORAGE || '/file-storage/ext-out',
    INT_INC_FILE_STORAGE: process.env.INT_INC_FILE_STORAGE || '/file-storage/int-inc',
    INT_OUT_FILE_STORAGE: process.env.INT_OUT_FILE_STORAGE || '/file-storage/int-out',
    INTERNAL_FILE_STORAGE: process.env.INTERNAL_FILE_STORAGE || '/file-storage/int',
    AVATAR_STORAGE: process.env.AVATAR_STORAGE || '/file-storage/avatars'
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // { src: './plugins/docs.js', mode: 'client' }
    // './plugins/docs.client.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/toast',
    '@nuxtjs/vuetify',
    '@nuxtjs/apollo'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // 'nuxt-webfontloader',
    '@nuxtjs/apollo'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  toast: {
    position: 'top-right',
    duration: 5000,
    theme: 'toasted-primary',
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  },
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    // defaultAssets: {
    //   font: true
    //   // icons: 'md'
    // },
    icons: {
      iconfont: 'mdi'
    },
    lang: {
      locales: { ru },
      current: 'ru'
    },
    theme: {
      dark: true,
      themes: {
        light: {
          primary: colors.lightBlue.base,
          secondary: colors.purple.base,
          accent: colors.blueGrey.base,
          error: colors.red.base,
          warning: colors.deepOrange.base,
          info: colors.yellow.base,
          success: colors.green.base
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  apollo: {
    tokenName: 'apollo-token', // optional, default: apollo-token
    cookieAttributes: {
      /**
        * Define when the cookie will be removed. Value can be a Number
        * which will be interpreted as days from time of creation or a
        * Date instance. If omitted, the cookie becomes a session cookie.
        */
      expires: 7, // optional, default: 7 (days)

      /**
        * Define the path where the cookie is available. Defaults to '/'
        */
      path: '/', // optional
      /**
        * Define the domain where the cookie is available. Defaults to
        * the domain of the page where the cookie was created.
        */
      // domain: '/', // optional

      /**
        * A Boolean indicating if the cookie transmission requires a
        * secure protocol (https). Defaults to false.
        */
      secure: false
    },
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    authenticationType: 'Basic', // optional, default: 'Bearer'
    // (Optional) Default 'apollo' definition
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    },
    // optional
    // watchLoading: '~/plugins/apollo-watch-loading-handler.js',
    // optional
    // errorHandler: '~/plugins/apollo-error-handler.js',
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: `http://${keys.APOLLO_HOST || '192.168.40.63'}:${keys.APOLLO_PORT || 80}`,
        // optional
        // override HTTP endpoint in browser only
        browserHttpEndpoint: '/graphql',
        // optional
        httpLinkOptions: {
          credentials: 'same-origin'
        },
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: `ws://${keys.APOLLO_HOST || '192.168.40.63'}:${keys.APOLLO_PORT || 80}/graphql`, // optional
        // wsEndpoint: 'ws://192.168.40.63/graphql', // optional
        // wsEndpoint: 'ws://localhost:3000/graphql', // optional
        // LocalStorage token
        tokenName: 'apollo-token', // optional
        // Enable Automatic Query persisting with Apollo Engine
        persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        websocketsOnly: false // Optional
      }
    }
  },
  webfontloader: {
    google: {
      families: ['Roboto:400,700'],
      urls: ['./fonts/roboto-fontface/css/roboto/roboto-fontface.css']
    }
  },
  babel: {
    // sourceType: 'unambiguous'
    babelrc: true,
    cacheDirectory: undefined,
    presets: ['@babel/env']
    // presets: ['@nuxt/babel-preset-app']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    babel: {
      presets ({ envName }) {
        const envTargets = {
          client: { browsers: ['last 2 versions'] },
          server: { node: 'current' }
        }
        return [
          [
            '@nuxt/babel-preset-app',
            {
              targets: envTargets[envName],
              modules: 'commonjs',
              useBuiltIns: 'entry'
            }
          ]
        ]
      },
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-class-properties'
      ]
    },
    // presets: ['env', { modules: 'commonjs' }],
    extend (config, ctx) {
    }
  }
}
