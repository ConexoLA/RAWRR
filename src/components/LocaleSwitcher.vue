<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        medium
        color="accent"
        class="text-capitalize"
        v-bind="attrs"
        v-on="on"
        text
      >
        <v-icon left>mdi-translate</v-icon>
        {{ activeLang.text }}
        <v-icon small right>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(lang, index) in langs"
        :key="index"
        @click="changeLocale(lang)"
      >
        <v-list-item-title>{{ lang.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    langs: [
      { text: "English", value: "en" },
      { text: "Español", value: "es" },
      { text: "Português do Brasil", value: "pt-br" },
    ],
    activeLang: { text: "English", value: "en" },
  }),
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
      this.$i18n.locale = langObj.value;
      if (langObj.value === "pt-br") {
        this.$vuetify.lang.current = "pt";
      } else {
        this.$vuetify.lang.current = langObj.value;
      }
      this.activeLang = langObj;
    },
    async changeLocale(lang) {
      this.$i18n.locale = lang.value;
      if (lang.value === "pt-br") {
        this.$vuetify.lang.current = "pt";
      } else {
        this.$vuetify.lang.current = lang.value;
      }
      let langText = await JSON.stringify(lang);
      await this.updateConfig(langText);
      await this.fetchAllConfig();
      await this.getAllConfig;
      this.activeLang = lang;
    },
  },
};
</script>

<style></style>
