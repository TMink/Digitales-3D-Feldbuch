import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    option: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#594743',
        secondary: '#8b4b63',
        background: '#e8e4d9'
      },
    },
  },
})
