<template>
  <v-toolbar dense max-height="48" class="amber darken-3">
    <v-toolbar-title to="/">
      <router-link to="/">
        <v-img
          class="mr-3"
          :src="require('../assets/logo_rawrr_h_black.png')"
          contain
          height="48"
          width="200"
        ></v-img>
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn class="amber darken-3" elevation="0" to="/">{{
        $t("header.home")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/assets">{{
        $t("header.assets")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/activities">{{
        $t("header.activities")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/threats">{{
        $t("header.threats")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/vulnerabilities">{{
        $t("header.vulnerabilities")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/recommendations">{{
        $t("header.recommendations")
      }}</v-btn>
      <v-btn class="amber darken-3" elevation="0" to="/reports">{{
        $t("header.report")
      }}</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style></style>
