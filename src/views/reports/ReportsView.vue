<template>
  <div>
    <assessment-report-list
      v-bind:assessmentReports="getAllAssessmentReports"
    ></assessment-report-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AssessmentReportList from "../../components/reports/AssessmentReportList.vue";
export default {
  components: {
    AssessmentReportList,
  },
  computed: {
    ...mapGetters(["getAllAssessmentReports"]),
  },
};
</script>
