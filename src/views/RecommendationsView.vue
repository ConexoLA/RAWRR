<template>
  <recommendation-list
    v-bind:recommendations="getAllMergedRecommendations"
  ></recommendation-list>
</template>

<script>
import { mapGetters } from "vuex";
import RecommendationList from "../components/recommendations/RecommendationList.vue";
export default {
  components: {
    RecommendationList,
  },
  computed: {
    ...mapGetters(["getAllMergedRecommendations"]),
  },
};
</script>
