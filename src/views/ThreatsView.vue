<template>
  <threat-list v-bind:threats="getAllMergedThreats"></threat-list>
</template>

<script>
import { mapGetters } from "vuex";
import ThreatList from "../components/threats/ThreatList.vue";
export default {
  components: {
    ThreatList,
  },
  computed: {
    ...mapGetters(["getAllMergedThreats"]),
  },
};
</script>
