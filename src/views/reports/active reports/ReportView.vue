<template>
  <!-- <div style="padding: 30px" > -->
  <v-container style="padding: 30px" v-resize="onResize">
    <v-row no-gutters>
      <v-col cols="auto" align-self="center" class="mr-auto">
        <v-row>
          <v-card elevation="0">
            <v-card-title>
              {{ $t("reports.title") }}
            </v-card-title>
            <v-card-subtitle>
              {{ $t("reports.subtitle") }}
            </v-card-subtitle>
          </v-card>
        </v-row>
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
                @click="hide_left_column = !hide_left_column"
              >
                <v-icon v-if="!hide_left_column" class="pr-2"
                  >mdi-eye-off</v-icon
                >
                <v-icon v-if="hide_left_column" class="pr-2">mdi-eye </v-icon>
                {{ $t("reports.to_add") }}
              </v-btn>
            </template>
            <span>{{ $t("reports.to_add_info") }} </span>
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
                @click="overlay_export = true"
                >{{ $t("reports.export") }}</v-btn
              >
            </template>

            <span>{{ $t("reports.export_info") }} </span>
          </v-tooltip>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="5" v-if="!hide_left_column">
        <p align-center class="title text-center">
          {{ $t("reports.to_add") }}
        </p>
      </v-col>
      <v-col cols="auto" v-if="!hide_left_column">
        <v-icon large>mdi-arrow-right-bold</v-icon>
      </v-col>
      <v-col style="align-content: center" align-self="center" cols="5">
        <p class="title text-center">
          {{ $t("reports.added") }}
        </p>
      </v-col>
    </v-row>
    <v-row align-content="center">
      <v-col
        v-if="!hide_left_column"
        v-bind:style="{ height: windowSize.y - 270 + 'px' }"
        class="overflow-y-auto left justify-between mr-1"
      >
        <transition name="fade">
          <div>
            <draggable
              :disabled="true"
              tag="ul"
              :list="secciones"
              class="list-group left-content"
              :animation="200"
              handle=".handle"
            >
              <li
                class="list-group-item"
                v-for="element in secciones"
                :key="element.id"
              >
                <span>
                  <report-section
                    class="list-group-item"
                    :report_section="getMain"
                    :interest="element.interest"
                    :group_name="element.group_name"
                    :dragDisabled="true"
                    :isReport="false"
                  >
                  </report-section>
                </span>
              </li>
            </draggable>
          </div>
        </transition>
      </v-col>
      <v-col
        v-bind:style="{ height: windowSize.y - 270 + 'px' }"
        class="overflow-y-auto right justify-between ml-1"
      >
        <draggable
          :disabled="false"
          tag="ul"
          :list="secciones_report"
          class="list-group-report"
          :animation="200"
          handle=".handle"
        >
          <li
            class="list-group-item-report"
            v-for="element in secciones_report"
            :key="element.id"
          >
            <report-section
              class="list-group-item-report"
              :report_section="getMain"
              :interest="element.interest"
              :group_name="element.group_name"
              :dragDisabled="false"
              :isReport="true"
            >
            </report-section>
          </li>
        </draggable>
      </v-col>
    </v-row>

    <v-overlay :dark="false" :value="overlay_export">
      <v-card outlined>
        <v-card-text>
          <p class="display-2 text--secondary">
            {{ $t("reports.choose") }}
          </p>
          <div v-for="item in supportedFiles" :key="item.id">
            <v-btn
              text
              color="primary"
              :disabled="item.disabled"
              @click="onExportReport(`${item.type}`)"
            >
              {{ `${item.name} (${item.type})` }}
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text plain color="accent" @click="overlay_export = false">
            {{ $t("global.return") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import ReportSection from "../../../components/reports/active reports/ReportSection.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    draggable,
    ReportSection,
  },
  data() {
    return {
      windowSize: {
        x: 0,
        y: 0,
      },
      overlay_custom_section: false,
      overlay_export: false,
      hide_left_column: false,
      supportedFiles: [
        {
          id: 1,
          type: "md",
          name: this.$t("reports.md.name"),
          disabled: false,
        },
        {
          id: 2,
          type: "docx",
          name: this.$t("reports.docx.name"),
          disabled: false,
        },
        {
          id: 3,
          type: "json",
          name: this.$t("reports.json.name"),
          disabled: false,
        },
        {
          id: 4,
          type: "txt",
          name: this.$t("reports.txt.name"),
          disabled: false,
        },
      ],
      showSections: {
        Assets: true,
        Activities: true,
        Recommendations: true,
        Vulnerabilities: true,
        Threats: true,
      },
      secciones: [
        { id: "1", interest: "assets", group_name: "asset" },
        { id: "2", interest: "activities", group_name: "activity" },
        { id: "3", interest: "threats", group_name: "threat" },
        { id: "4", interest: "vulnerabilities", group_name: "vulnerability" },
        { id: "5", interest: "recommendations", group_name: "recommendation" },
      ],
      secciones_report: [
        {
          id: "1",
          name: "Assets",
          interest: "report_assets",
          group_name: "asset",
        },
        {
          id: "2",
          name: "Activities",
          interest: "report_activities",
          group_name: "activity",
        },
        {
          id: "3",
          name: "Threats",
          interest: "report_threats",
          group_name: "threat",
        },
        {
          id: "4",
          name: "Vulnerabilities",
          interest: "report_vulnerabilities",
          group_name: "vulnerability",
        },
        {
          id: "5",
          name: "Recommendations",
          interest: "report_recommendations",
          group_name: "recommendation",
        },
      ],
    };
  },
  methods: {
    ...mapActions(["exportReport"]),
    toggleSections: function (section) {
      this.showSections[section] = !this.showSections[section];
    },
    onExportReport: function (format) {
      let export_aux = [];
      switch (format) {
        case "md":
          export_aux = [
            format,
            this.secciones_report,
            this.getMain,
            this.getAllMergedAssets,
            this.getAllMergedAssessmentActivities,
            this.getAllMergedThreats,
            this.getAllMergedVulnerabilities,
            this.getAllMergedRecommendations,
            this.$t("reports.md.title"),
            this.$t("global.report_save"),
          ];
          break;
        case "docx":
          export_aux = [
            format,
            this.secciones_report,
            this.getMain,
            this.getAllMergedAssets,
            this.getAllMergedAssessmentActivities,
            this.getAllMergedThreats,
            this.getAllMergedVulnerabilities,
            this.getAllMergedRecommendations,
            this.$t("reports.docx.title"),
            this.$t("global.report_save"),
          ];
          break;
        case "json":
          export_aux = [
            format,
            this.secciones_report,
            this.getMain,
            this.getAllMergedAssets,
            this.getAllMergedAssessmentActivities,
            this.getAllMergedThreats,
            this.getAllMergedVulnerabilities,
            this.getAllMergedRecommendations,
            this.$t("reports.json.title"),
            this.$t("global.report_save"),
          ];
          break;
        case "txt":
          export_aux = [
            format,
            this.secciones_report,
            this.getMain,
            this.getAllMergedAssets,
            this.getAllMergedAssessmentActivities,
            this.getAllMergedThreats,
            this.getAllMergedVulnerabilities,
            this.getAllMergedRecommendations,
            this.$t("reports.txt.title"),
            this.$t("global.report_save"),
          ];
          break;
        default:
          /* eslint-disable no-console */
          console.log(format, " does not have a valid export method.");
      }

      this.exportReport(export_aux);
      this.overlay = true;
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
  },
  computed: {
    ...mapGetters([
      "getMain",
      "getAllMergedAssets",
      "getAllMergedAssessmentActivities",
      "getAllMergedThreats",
      "getAllMergedVulnerabilities",
      "getAllMergedRecommendations",
    ]),
    ...mapActions(["initializeMain"]),
  },
  created() {
    this.initializeMain;
  },
};
</script>

<style scoped>
@import "../../../assets/styles/tailwindcss@1.9.6.css";

.column-width {
  min-width: 180px;
  width: 750px;
  max-width: 1200px;
}
.column-report-width {
  min-width: 180px;
  width: 750px;
  max-width: 1200px;
}
/* Unfortunately @apply cannot be setup in codesandbox, 
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1.5px solid #4299e1;
}

.ghost-report-card {
  opacity: 0.5;
  background: #44494d;
  border: 1.5px solid #4299e1;
}

.layout {
  display: block;
}

.left {
  direction: rtl;
  border-width: medium;
  border-style: solid;
}

.right {
  border-width: medium;
  border-style: solid;
}

.left-content {
  direction: ltr;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 6px;
  border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 0px;
  border-radius: 0px;
  background: rgba(189, 189, 189, 1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.445);
}
/*::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}*/

.fade-enter,
.fade-leave-to {
  height: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
</style>
