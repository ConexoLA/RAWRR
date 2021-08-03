<template>
  <v-app>
    <Header />
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-main>
    <v-snackbar
      min-width="auto"
      :key="notification.notification.text + Math.random()"
      v-model="notification.notification.showing"
      :timeout="notification.notification.timeout"
      :color="notification.notification.color"
      :style="`bottom: ${20}px`"
    >
      {{ notification.notification.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  components: {
    Header,
  },
  computed: {
    ...mapState(["notification"]),
    ...mapActions([
      "fetchAllAssessmentActivities",
      "fetchAllAssessmentActivityAssetAssociations",
      "fetchAllAssessmentReports",
      "fetchAllAssessmentReportSections",
      "fetchAllAssets",
      "fetchAllAssetCategories",
      "fetchAllRecommendations",
      "fetchAllRecommendationVulnerabilityAssociations",
      "fetchAllThreatTypes",
      "fetchAllThreats",
      "fetchAllVulnerabilities",
      "fetchAllVulnerabilityThreatAssociations",
    ]),
  },
  created() {
    //Loading Vuex initial state
    this.fetchAllAssessmentActivities;
    this.fetchAllAssessmentActivityAssetAssociations;
    this.fetchAllAssessmentReports;
    this.fetchAllAssessmentReportSections;
    this.fetchAllAssets;
    this.fetchAllAssetCategories;
    this.fetchAllRecommendations;
    this.fetchAllRecommendationVulnerabilityAssociations;
    this.fetchAllThreatTypes;
    this.fetchAllThreats;
    this.fetchAllVulnerabilities;
    this.fetchAllVulnerabilityThreatAssociations;
  },
  data() {
    return {
      //
    };
  },
};
</script>

<style>
.v-data-table td,
.v-data-table th {
  font-size: 16px !important;
  padding: 16px !important;
}
.v-data-table {
  padding-top: 30px;
}
.v-snack:not(.v-snack--absolute) {
  height: auto !important;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(2em);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s ease;
}
</style>
