<template>
  <vulnerability-list
    v-bind:vulnerabilities="getAllMergedVulnerabilities"
  ></vulnerability-list>
</template>

<script>
import { mapGetters } from "vuex";
import VulnerabilityList from "../components/vulnerabilities/VulnerabilityList.vue";
export default {
  components: {
    VulnerabilityList,
  },
  computed: {
    ...mapGetters(["getAllMergedVulnerabilities"]),
  },
};
</script>
