import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";
import en from "vuetify/src/locale/en.ts";

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
    locales: { en },
    current: process.env.VUE_APP_I18N_LOCALE,
  },
});
