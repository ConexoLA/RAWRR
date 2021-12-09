import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import en from "vuetify/src/locale/en.ts";
import es from "vuetify/src/locale/es.ts";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.amber.darken4,
        secondary: colors.grey.lighten1,
        accent: colors.grey.darken4,
        error: colors.red.accent4,
        info: colors.amber.darken1,
        success: colors.lime.darken1,
        warning: colors.orange.darken4,
      },
    },
  },
  icons: {
    iconfont: "mdi",
  },
  lang: {
    locales: { en, es },
    current: process.env.VUE_APP_I18N_LOCALE,
  },
});
