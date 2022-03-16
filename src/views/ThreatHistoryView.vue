<template>
  <threat-history v-bind:threat="getActiveThreatHistory"></threat-history>
</template>

<script>
import { mapGetters } from "vuex";
import ThreatHistory from "../components/threats/ThreatHistory.vue";
export default {
  components: {
    ThreatHistory,
  },
  computed: {
    ...mapGetters(["getActiveThreatHistory"]),
  },
};
</script>
