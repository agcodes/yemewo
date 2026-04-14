import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,

  defaults: {
    global: {
      style: {
        fontFamily: 'Bricolage Grotesque, Verdana, sans-serif',
      },
    },
  },

  theme: {
    defaultTheme: 'light',

    themes: {
      light: {
        colors: {
          background: '#f8f5ff', // Couleur de base, le dégradé sera dans main.css
        },
      },
    },
  },
})
