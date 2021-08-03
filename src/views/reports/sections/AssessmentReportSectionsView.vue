<template>
  <div>
    <v-btn class="ma-2" color="orange darken-2" dark to="/reports" rounded>
      <v-icon dark left>mdi-arrow-left</v-icon>
      {{ $t("back_button") }}
    </v-btn>
    <custom-sections-list
      v-bind:assessmentReportSections="getAllAssessmentReportSections"
    ></custom-sections-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CustomSectionsList from "../../../components/reports/sections/AssessmentReportSectionsList.vue";
export default {
  components: {
    CustomSectionsList,
  },
  computed: {
    ...mapGetters(["getAllAssessmentReportSections"]),
  },
};
</script>
