<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-img
          :src="require('../assets/logo_rawrr_v_yellow.png')"
          contain
          height="200"
        ></v-img>
      </v-col>

      <v-row align="center" justify="center">
        <v-col cols="auto">
          <h1 class="display-1 font-weight-bold">
            {{ $t("home.welcome_message_1") }}
          </h1>
        </v-col>
      </v-row>

      <v-row align-content="center" justify="center" class="ml-2 mr-2">
        <v-col cols="auto" align-self="center">
          <p justify-center align-center style="white-space: pre-line">
            {{ $t("home.welcome_message_2") }}
          </p>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="auto" align-self="center">
          <v-card class="pa-2" elevation="0">
            <v-tooltip bottom close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  medium
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="onLoadTestValues()"
                >
                  <v-icon class="mr-2">mdi-test-tube</v-icon>
                  {{ $t("home.test") }}
                </v-btn>
              </template>

              <span>{{ $t("home.test_tooltip") }} </span>
            </v-tooltip>
          </v-card>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-card class="pa-2" elevation="0">
            <v-tooltip bottom close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  medium
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="onImportDatabase()"
                  ><v-icon class="mr-2">mdi-import</v-icon> {{ ""
                  }}{{ $t("home.import") }}
                </v-btn>
              </template>

              <span>{{ $t("home.import_tooltip") }} </span>
            </v-tooltip>
          </v-card>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-card class="pa-2" elevation="0">
            <v-tooltip bottom close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  medium
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="onExportDatabase()"
                  ><v-icon class="mr-2">mdi-export</v-icon>
                  {{ $t("home.export") }}
                </v-btn>
              </template>

              <span>{{ $t("home.export_tooltip") }} </span>
            </v-tooltip>
          </v-card>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-card class="pa-2" elevation="0">
            <v-tooltip bottom close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  medium
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="onDeleteDatabase()"
                  ><v-icon class="mr-2">mdi-delete-forever</v-icon>
                  {{ $t("home.delete") }}
                </v-btn>
              </template>

              <span>{{ $t("home.delete_tooltip") }} </span>
            </v-tooltip>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    backup: false,
  }),
  computed: {
    ...mapGetters(["getBackup"]),
  },
  methods: {
    ...mapActions([
      "exportDatabase",
      "importDatabase",
      "loadTestValues",
      "backupDatabase",
      "deleteDatabase",
      "fetchAllAssetCategories",
      "fetchAllAssets",
      "fetchAllAssessmentActivities",
      "fetchAllAssessmentActivityAssetAssociations",
      "fetchAllThreatTypes",
      "fetchAllThreats",
      "fetchAllVulnerabilities",
      "fetchAllVulnerabilityThreatAssociations",
      "fetchAllRecommendations",
      "fetchAllRecommendationVulnerabilityAssociations",
      "fetchAllAssessmentReports",
      "fetchAllAssessmentReportSections",
      "setBackup",
    ]),
    onExportDatabase: function () {
      this.exportDatabase([
        "db",
        this.$t("home.export_window_title"),
        this.$t("home.export_window_message"),
      ]);
    },
    onImportDatabase: async function () {
      if (window.confirm(this.$t("home.write_confirm"))) {
        let backup_state = await this.backupDatabase();
        if (backup_state != "error") {
          let answer = await this.importDatabase([
            "db",
            this.$t("home.import_window_title"),
            this.$t("home.import_window_message"),
            false,
          ]);

          if (answer != "ignore") {
            await this.fetchAllAssetCategories();
            await this.fetchAllAssets();
            await this.fetchAllAssessmentActivities();
            await this.fetchAllAssessmentActivityAssetAssociations();
            await this.fetchAllThreatTypes();
            await this.fetchAllThreats();
            await this.fetchAllVulnerabilities();
            await this.fetchAllVulnerabilityThreatAssociations();
            await this.fetchAllRecommendations();
            await this.fetchAllRecommendationVulnerabilityAssociations();
            await this.fetchAllAssessmentReports();
            await this.fetchAllAssessmentReportSections();

            this.backup = await this.getBackup;

            if (this.backup == true) {
              let answer = await this.importDatabase([
                "db",
                this.$t("home.import_window_title"),
                this.$t("home.import_window_message"),
                true,
              ]);

              await this.setBackup(false);

              await this.fetchAllAssetCategories();
              await this.fetchAllAssets();
              await this.fetchAllAssessmentActivities();
              await this.fetchAllAssessmentActivityAssetAssociations();
              await this.fetchAllThreatTypes();
              await this.fetchAllThreats();
              await this.fetchAllVulnerabilities();
              await this.fetchAllVulnerabilityThreatAssociations();
              await this.fetchAllRecommendations();
              await this.fetchAllRecommendationVulnerabilityAssociations();
              await this.fetchAllAssessmentReports();
              await this.fetchAllAssessmentReportSections();
            }
          }
        }
      }
    },
    onLoadTestValues: function () {
      if (window.confirm(this.$t("home.write_confirm"))) {
        this.loadTestValues();

        this.fetchAllAssessmentActivities();
        this.fetchAllAssessmentActivityAssetAssociations();
        this.fetchAllAssessmentReports();
        this.fetchAllAssessmentReportSections();
        this.fetchAllAssets();
        this.fetchAllAssetCategories();
        this.fetchAllRecommendations();
        this.fetchAllRecommendationVulnerabilityAssociations();
        this.fetchAllThreatTypes();
        this.fetchAllThreats();
        this.fetchAllVulnerabilities();
        this.fetchAllVulnerabilityThreatAssociations();
      }
    },
    onDeleteDatabase: function () {
      if (window.confirm(this.$t("home.delete_confirm"))) {
        this.deleteDatabase();

        this.fetchAllAssessmentActivities();
        this.fetchAllAssessmentActivityAssetAssociations();
        this.fetchAllAssessmentReports();
        this.fetchAllAssessmentReportSections();
        this.fetchAllAssets();
        this.fetchAllAssetCategories();
        this.fetchAllRecommendations();
        this.fetchAllRecommendationVulnerabilityAssociations();
        this.fetchAllThreatTypes();
        this.fetchAllThreats();
        this.fetchAllVulnerabilities();
        this.fetchAllVulnerabilityThreatAssociations();
      }
    },
  },
};
</script>
