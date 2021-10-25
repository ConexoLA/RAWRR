<template>
  <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
    <div class="flex justify-between" style="margin-bottom: 15px; padding: 0px">
      <div>
        <div
          class="h-5 rounded-full text-xs font-semibold flex items-center"
          :class="`bg-${badgeColor}-100 text-${badgeColor}-700`"
        >
          <span>
            <slot
              class="
                text-gray-700
                font-semibold font-sans
                tracking-wide
                text-sm
              "
              >{{ task.identifier }} - {{ task.title }}</slot
            >
          </span>
        </div>
      </div>
      <div>
        <v-btn
          v-if="!isReport"
          class="mx-2"
          dark
          small
          :color="badgeColor"
          @click="clickAdd(task)"
        >
          <v-icon dark> mdi-plus </v-icon>
          {{ $t("global.add") }}
        </v-btn>

        <v-btn
          v-if="isReport"
          class="mx-2"
          dark
          small
          :color="badgeColor"
          @click="clickRemove(task, index)"
        >
          <v-icon dark> mdi-minus </v-icon>
          {{ $t("global.remove") }}
        </v-btn>
      </div>
    </div>

    <div class="flex justify-between fixed-items" style="align-items: center">
      <span
        class="text-sm text-gray-600"
        style="margin-right: 5px; text-indent: 5px"
        >{{ task.description }}</span
      >
      <badge v-if="task.type" :color="badgeColor">{{ task.type }}</badge>
    </div>
  </div>
</template>

<script>
import Badge from "./Badge.vue";
import { mapActions } from "vuex";
export default {
  components: {
    Badge,
  },
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    isReport: Boolean,
    index: {},
  },
  data() {
    return {
      buttonChecked: false,
    };
  },
  methods: {
    ...mapActions([
      "pushReportAsset",
      "pushReportActivity",
      "pushReportThreat",
      "pushReportVulnerability",
      "pushReportRecommendation",
      "spliceReportAsset",
      "spliceReportActivity",
      "spliceReportThreat",
      "spliceReportVulnerability",
      "spliceReportRecommendation",
    ]),
    clickAdd(title) {
      switch (title.type) {
        case "Assets":
          this.pushReportAsset(title);
          break;
        case "Activities":
          this.pushReportActivity(title);
          break;
        case "Threats":
          this.pushReportThreat(title);
          break;
        case "Vulnerabilities":
          this.pushReportVulnerability(title);
          break;
        case "Recommendations":
          this.pushReportRecommendation(title);
          break;
        default:
          /* eslint-disable no-console */
          console.log("No value found");
      }
      this.buttonChecked = !this.buttonChecked;
    },
    clickRemove(title, index) {
      switch (title.type) {
        case "Assets":
          this.spliceReportAsset(index);
          break;
        case "Activities":
          this.spliceReportActivity(index);
          break;
        case "Threats":
          this.spliceReportThreat(index);
          break;
        case "Vulnerabilities":
          this.spliceReportVulnerability(index);
          break;
        case "Recommendations":
          this.spliceReportRecommendation(index);
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
        Activities: "purple",
        Assets: "teal",
        Threats: "blue",
        Vulnerabilities: "green",
        Recommendations: "red",
        default: "black",
      };
      return mappings[this.task.type] || mappings.default;
    },
  },
};
</script>
