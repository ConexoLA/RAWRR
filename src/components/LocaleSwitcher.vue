<template>
  <v-select
    color="accent"
    item-color="accent"
    prepend-icon="mdi-translate"
    v-model="$i18n.locale"
    :items="[
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
      { text: 'Português do Brasil', value: 'pt-br' },
    ]"
    @change="changeLocale()"
  >
  </v-select>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  created() {
    this.initialLoad();
  },
  computed: {
    ...mapGetters(["getAllConfig"]),
  },
  methods: {
    ...mapActions(["updateConfig", "fetchAllConfig"]),
    async initialLoad() {
      await this.fetchAllConfig();
      var langText = await this.getAllConfig;
      var langObj = await JSON.parse(langText);
      this.$i18n.locale = langObj.lang;
      if (langObj.lang === "pt-br") {
        this.$vuetify.lang.current = "pt";
      } else {
        this.$vuetify.lang.current = langObj.lang;
      }
    },
    async changeLocale() {
      var langText = await this.getAllConfig;
      var langObj = await JSON.parse(langText);
      langObj.lang = this.$i18n.locale;
      if (langObj.lang === "pt-br") {
        this.$vuetify.lang.current = "pt";
      } else {
        this.$vuetify.lang.current = langObj.lang;
      }
      langText = await JSON.stringify(langObj);
      await this.updateConfig(langText);
      await this.fetchAllConfig();
      langText = await this.getAllConfig;
    },
  },
};
</script>

<style></style>
