<template>
  <v-row>
    <v-col>
      <div
        v-for="asset in report_section[interest]"
        :key="asset.title"
        class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4"
      >
        <div class="flex justify-between">
          <i v-if="!dragDisabled" class="fa fa-align-justify handle"
            ><v-icon>mdi-drag-horizontal-variant</v-icon></i
          >
          <p class="text-gray-700 font-bold font-sans tracking-wide text-sm">
            {{ asset.title }}
          </p>
          <div>
            <v-tooltip top close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-show="!isReport"
                  fab
                  x-small
                  color="gray"
                  style="margin-right: 5px; padding: 0px"
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="addAllToReport(asset)"
                  :disabled="asset.tasks.length === 0"
                >
                  <v-icon> mdi-expand-all </v-icon>
                </v-btn>
                <v-btn
                  v-show="isReport"
                  fab
                  x-small
                  color="gray"
                  style="margin-right: 5px; padding: 0px"
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="removeAllFromReport(asset)"
                  :disabled="asset.tasks.length === 0"
                >
                  <v-icon> mdi-collapse-all </v-icon>
                </v-btn>
              </template>
              <span v-if="!isReport">{{ $t("global.add_all") }} </span>
              <span v-if="isReport">{{ $t("global.remove_all") }} </span>
            </v-tooltip>
            <v-tooltip top close-delay="100">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  x-small
                  color="gray"
                  v-bind="attrs"
                  v-on="on"
                  v-on:click="toggleSections(asset.showClass)"
                >
                  <v-icon dark v-show="showSections[asset.showClass]">
                    mdi-arrow-up
                  </v-icon>
                  <v-icon dark v-show="!showSections[asset.showClass]">
                    mdi-arrow-down
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="showSections[asset.showClass]"
                >{{ $t("global.collapse") }}
              </span>
              <span v-if="!showSections[asset.showClass]"
                >{{ $t("global.expand") }}
              </span>
            </v-tooltip>
          </div>
        </div>
        <draggable
          :disabled="false"
          :list="asset.tasks"
          :animation="200"
          v-show="showSections[asset.showClass]"
          ghost-class="ghost-card"
          :group="group_name"
        >
          <task-card
            v-for="(task, index) in asset.tasks"
            :key="task.id"
            :task="task"
            :index="index"
            :isReport="isReport"
            class="mt-1 cursor-move"
          ></task-card>
          <div
            v-if="asset.tasks.length === 0 && isReport === false"
            style="text-align: center; font-style: italic"
            class="text-gray-700 font-sans tracking-wide text-sm"
          >
            {{ $t("reports.to_add_empty") }}
          </div>
          <div
            v-else-if="asset.tasks.length === 0 && isReport === true"
            style="text-align: center; font-style: italic"
            class="text-gray-700 font-sans tracking-wide text-sm"
          >
            {{ $t("reports.added_empty") }}
          </div>
        </draggable>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import draggable from "vuedraggable";
import TaskCard from "./TaskCard.vue";
import { mapActions } from "vuex";

export default {
  components: {
    draggable,
    TaskCard,
  },
  props: {
    interest: {
      type: String,
      default: () => "assets",
    },
    group_name: {
      type: String,
      default: () => "assets",
    },
    report_section: {
      type: Object,
      default: () => ({}),
    },
    dragDisabled: Boolean,
    isReport: Boolean,
  },
  data() {
    return {
      overlay: false,
      addAll: {
        Assets: true,
        Activities: true,
        Recommendations: true,
        Vulnerabilities: true,
        Threats: true,
        reportAssets: true,
        reportActivities: true,
        reportRecommendations: true,
        reportVulnerabilities: true,
        reportThreats: true,
      },
      showSections: {
        Assets: true,
        Activities: true,
        Recommendations: true,
        Vulnerabilities: true,
        Threats: true,
        reportAssets: true,
        reportActivities: true,
        reportRecommendations: true,
        reportVulnerabilities: true,
        reportThreats: true,
      },
    };
  },
  methods: {
    ...mapActions([
      "pushAllReportAsset",
      "pushAllReportActivity",
      "pushAllReportThreat",
      "pushAllReportVulnerability",
      "pushAllReportRecommendation",
      "removeAllReportAsset",
      "removeAllReportActivity",
      "removeAllReportThreat",
      "removeAllReportVulnerability",
      "removeAllReportRecommendation",
    ]),
    toggleSections: function (section) {
      this.showSections[section] = !this.showSections[section];
      this.showSections[section];
      /* eslint-enable no-console */
    },
    addAllCards: function (section) {
      this.addAll[section] = !this.addAll[section];
    },
    addAllToReport(asset) {
      switch (asset.showClass) {
        case "Assets":
          this.pushAllReportAsset(asset.tasks);
          break;
        case "Activities":
          this.pushAllReportActivity(asset.tasks);
          break;
        case "Threats":
          this.pushAllReportThreat(asset.tasks);
          break;
        case "Vulnerabilities":
          this.pushAllReportVulnerability(asset.tasks);
          break;
        case "Recommendations":
          this.pushAllReportRecommendation(asset.tasks);
          break;
        default:
          /* eslint-disable no-console */
          console.log("No value found");
      }
    },
    removeAllFromReport(asset) {
      switch (asset.showClass) {
        case "reportAssets":
          this.removeAllReportAsset(asset.tasks);
          break;
        case "reportActivities":
          this.removeAllReportActivity(asset.tasks);
          break;
        case "reportThreats":
          this.removeAllReportThreat(asset.tasks);
          break;
        case "reportVulnerabilities":
          this.removeAllReportVulnerability(asset.tasks);
          break;
        case "reportRecommendations":
          this.removeAllReportRecommendation(asset.tasks);
          break;
        default:
          /* eslint-disable no-console */
          console.log("No value found");
      }
    },
  },
  computed: {
    badgeColor() {
      const mappings = {
        Assets: "pink",
        Activities: "indigo",
        Threats: "red",
        Vulnerabilities: "purple",
        Recommendations: "green",
        default: "black",
      };
      return mappings[this.task.type] || mappings.default;
    },
  },
};
</script>
