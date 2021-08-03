<template>
  <asset-list v-bind:assets="getAllMergedAssets"></asset-list>
</template>

<script>
import { mapGetters } from "vuex";
import AssetList from "../components/assets/AssetList.vue";
export default {
  components: {
    AssetList,
  },
  computed: {
    ...mapGetters(["getAllMergedAssets"]),
  },
};
</script>
