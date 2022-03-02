import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import en from "vuetify/src/locale/en.ts";
import es from "vuetify/src/locale/es.ts";
import pt from "vuetify/src/locale/pt.ts";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        //https://vuetifyjs.com/en/styles/colors/#sass-color-pack
        primary: colors.amber.darken3, //FF8F00
        secondary: colors.grey.lighten2, //E0E0E0
        accent: colors.grey.darken4, //212121
        info: colors.amber.darken1, //FFB300
        warning: colors.orange.darken2, //F57C00
        error: "B30000",
        success: colors.green.darken3, //1B5E20
        white: colors.white, //FFFFFF
        black: colors.black, ///000000
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
  lang: {
    locales: { en, es, pt },
    current: process.env.VUE_APP_I18N_LOCALE,
  },
});
