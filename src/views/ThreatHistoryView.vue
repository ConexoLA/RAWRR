<template>
  <v-container fill-height fluid>
    <router-link to="/threats">
      <v-btn color="primary" class="black--text font-weight-regular">
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t("global.back") }}
      </v-btn>
    </router-link>
    <v-row align="center" justify="center">
      <v-col cols="6" class="text-center">
        <v-card class="elevation-2 text-center">
          <v-card-title class="text-h5"> Lorem ipsum </v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola
            imperdiet nec ut, sed euismod convenire principes at. Est et nobis
            iisque percipit, an vim zril disputando voluptatibus, vix an
            salutandi sententiae.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-timeline>
          <v-timeline-item
            v-for="n in years"
            :key="n.date"
            color="red darken-2"
            large
          >
            <template v-slot:opposite>
              <p>
                {{ $d(new Date(), "long", $i18n.locale) }}
              </p>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="text-h5"> {{ n.title }} </v-card-title>
              <v-card-text>
                Lorem ipsum dolor sit amet, no nam oblique veritus. Commune
                scaevola imperdiet nec ut, sed euismod convenire principes at.
                Est et nobis iisque percipit, an vim zril disputando
                voluptatibus, vix an salutandi sententiae.
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import { mapGetters } from "vuex";
//import ThreatList from "../components/threats/ThreatList.vue";
export default {
  data: () => ({
    years: [
      {
        color: "cyan",
        date: "January",
        title: "Created",
        subtitle: "",
      },
      {
        color: "green",
        date: "1970",
        title: "Modified",
        subtitle: "",
      },
      {
        color: "pink",
        date: "1980",
        title: "Modified",
        subtitle: "",
      },
      {
        color: "amber",
        date: "1990",
        title: "Modified",
        subtitle: "",
      },
      {
        color: "orange",
        date: "2000",
        title: "Modified",
        subtitle: "",
      },
    ],
  }),
  components: {
    //ThreatList,
  },
  computed: {
    //...mapGetters(["getAllMergedThreats"]),
  },
};
</script>
