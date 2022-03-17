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
        <v-card class="elevation-2 text-left">
          <v-card-title class="text-h5">
            {{ threat.id }} - {{ threat.name }}
          </v-card-title>
          <v-card-text>
            <li>Description: {{ threat.description }}</li>
            <li>Threat type: {{ threat.threat_type_name }}</li>
            <li>Asset: {{ threat.asset_name }}</li>
            <li>Impact: {{ threat.impact }}</li>
            <li>likelihood: {{ threat.likelihood }}</li>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <v-timeline>
          <v-timeline-item
            v-for="n in audits"
            :key="n.threat_id"
            color="red darken-2"
            large
          >
            <template v-slot:opposite>
              <p>
                {{ $d(new Date(n.created), "long", $i18n.locale) }}
              </p>
            </template>
            <v-card class="elevation-2">
              <v-card-title class="text-h5">Modified</v-card-title>
              <v-card-text>
                <p v-if="n.name_old">Nombre anterior: {{ n.name_old }}</p>
                <p v-if="n.name_new">Nombre actualizado: {{ n.name_new }}</p>
                <hr v-if="n.name_new">
                <p v-if="n.description_old">Descripcion anterior: {{ n.description_old }}</p>
                <p v-if="n.description_new">Descripcion actualizado: {{ n.description_new }}</p>
                <hr v-if="n.description_new">
                <p v-if="n.asset_name_old">Activo anterior: {{ n.asset_name_old }}</p>
                <p v-if="n.asset_name_new">Activo actualizado: {{ n.asset_name_new }}</p>
                <hr v-if="n.asset_name_new">
                <p v-if="n.impact_old">Impacto anterior: {{ n.impact_old }}</p>
                <p v-if="n.impact_new">Impacto actualizado: {{ n.impact_new }}</p>
                <hr v-if="n.likelihood_new">
                <p v-if="n.likelihood_old">Frecuencia anterior: {{ n.likelihood_old }}</p>
                <p v-if="n.likelihood_new">Frecuencia actualizado: {{ n.likelihood_new }}</p>
                <hr v-if="n.threat_type_name_new">
                <p v-if="n.threat_type_name_old">Tipo de riesgo anterior: {{ n.threat_type_name_old }}</p>
                <p v-if="n.threat_type_name_new">Tipo de riesgo actualizado: {{ n.threat_type_name_new }}</p>
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
  props: ["threat", "audits"],
  data: () => ({}),
  components: {
    //ThreatList,
  },
  computed: {
    //...mapGetters(["getAllMergedThreats"]),
  },
};
</script>
