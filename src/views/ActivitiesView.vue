<template>
  <assessment-activity-list
    v-bind:assessmentActivities="getAllMergedAssessmentActivities"
  ></assessment-activity-list>
</template>

<script>
import { mapGetters } from "vuex";
import AssessmentActivityList from "../components/assessment activities/AssessmentActivityList.vue";
export default {
  components: {
    AssessmentActivityList,
  },
  computed: {
    ...mapGetters(["getAllMergedAssessmentActivities"]),
  },
};
</script>
