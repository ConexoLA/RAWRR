<template>
  <v-container fill-height fluid>
    <router-link to="/threats">
      <v-btn color="primary" class="black--text font-weight-regular">
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t("global.back") }}
      </v-btn>
    </router-link>

    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center">
        <v-card class="elevation-2 text-left">
          <v-card-title class="text-h5 red darken-2 text-white">
            Current Threat values
          </v-card-title>
          <v-card-text class="white text--primary">
            <div v-if="threat.id" class="pt-3"><b>ID: </b>{{ threat.id }}</div>
            <div v-if="threat.name"><b>Name: </b>{{ threat.name }}</div>
            <div v-if="threat.description">
              <b>Description: </b>
              <span class="d-inline-block text-truncate trunc">{{
                threat.description
              }}</span>
              <v-tooltip bottom color="accent">
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    color="accent"
                    v-on="on"
                    class="tooltipIcon trunc"
                  >
                    mdi-more
                  </v-icon>
                </template>
                <span>{{ threat.description }}</span>
              </v-tooltip>
            </div>
            <div v-if="threat.threat_type_name">
              <b>Threat type: </b>{{ threat.threat_type_name }}
            </div>
            <div v-if="threat.asset_name">
              <b>Asset: </b>{{ threat.asset_name }}
            </div>
            <div><b>Impact: </b>{{ threat.impact }}</div>
            <div><b>Likelihood: </b>{{ threat.likelihood }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="text-left">
        <p v-if="!audits.length">Vacio {{ audits }}</p>
        <v-timeline v-if="audits.length">
          <v-timeline-item
            v-for="n in audits"
            :key="n.threat_id"
            color="red darken-2"
            small
            fill-dot
          >
            <template v-slot:opposite>
              <v-icon>mdi-calendar</v-icon>
              <b> {{ $d(new Date(n.created), "short", $i18n.locale) }} </b>
            </template>
            <v-card dark color="red darken-2">
              <v-card-title class="text-h5 red darken-2">Modified</v-card-title>
              <v-card-text class="white text--primary">
                <div v-if="n.name_new || n.name_old">
                  <br />
                  <div v-if="n.name_new && n.name_old">
                    <b>Nombre actualizado: </b>{{ n.name_new }}
                    <br />
                    <b>Nombre anterior: </b><strike>{{ n.name_old }}</strike>
                  </div>
                  <div v-if="n.name_new && !n.name_old">
                    <b>Nombre agregado: </b>{{ n.name_new }}
                  </div>
                </div>
                <div v-if="n.description_new || n.description_old">
                  <br />

                  <div v-if="n.description_new && n.description_old">
                    <b class="d-inline text-truncate trunc"
                      >Descripcion actualizada:
                    </b>
                    <span class="d-inline-block text-truncate trunc">{{
                      n.description_new
                    }}</span>
                    <v-tooltip bottom color="accent">
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          color="accent"
                          v-on="on"
                          class="tooltipIcon trunc"
                        >
                          mdi-more
                        </v-icon>
                      </template>
                      <span>{{ n.description_new }}</span>
                    </v-tooltip>

                    <br />

                    <b class="d-inline text-truncate trunc"
                      >Descripcion anterior:
                    </b>
                    <span class="d-inline-block text-truncate trunc"
                      ><strike>{{ n.description_old }}</strike></span
                    >
                    <v-tooltip bottom color="accent">
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          color="accent"
                          v-on="on"
                          class="tooltipIcon trunc"
                        >
                          mdi-more
                        </v-icon>
                      </template>
                      <span>{{ n.description_old }}</span>
                    </v-tooltip>
                  </div>
                  <div v-if="n.description_new && !n.description_old">
                    <b>Descripcion agregada: </b>
                    <span class="d-inline-block text-truncate trunc">{{
                      n.description_new
                    }}</span>
                    <v-tooltip bottom color="accent">
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          color="accent"
                          v-on="on"
                          class="tooltipIcon trunc"
                        >
                          mdi-more
                        </v-icon>
                      </template>
                      <span>{{ n.description_new }}</span>
                    </v-tooltip>
                  </div>
                  <div v-if="!n.description_new && n.description_old">
                    <b>Descripcion eliminada: </b
                    ><span class="d-inline-block text-truncate trunc"
                      ><strike>{{ n.description_old }}</strike></span
                    >
                    <v-tooltip bottom color="accent">
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          color="accent"
                          v-on="on"
                          class="tooltipIcon trunc"
                        >
                          mdi-more
                        </v-icon>
                      </template>
                      <span>{{ n.description_old }}</span>
                    </v-tooltip>
                  </div>
                </div>
                <div v-if="n.threat_type_name_new || n.threat_type_name_old">
                  <br />
                  <div v-if="n.threat_type_name_new && n.threat_type_name_old">
                    <b>Tipo de riesgo actualizado: </b>
                    {{ mapThreatType(n.threat_type_name_new) }}
                    <br />
                    <b>Tipo de riesgo anterior: </b>
                    <strike>{{ mapThreatType(n.threat_type_name_old) }}</strike>
                  </div>
                  <div v-if="n.threat_type_name_new && !n.threat_type_name_old">
                    <b>Tipo de riesgo vinculado: </b>
                    {{ mapThreatType(n.threat_type_name_new) }}
                  </div>
                  <div v-if="!n.threat_type_name_new && n.threat_type_name_old">
                    <b>Tipo de riesgo desvinculado: </b>
                    <strike>{{ mapThreatType(n.threat_type_name_old) }}</strike>
                  </div>
                </div>
                <div v-if="n.asset_name_new || n.asset_name_old">
                  <br />
                  <div v-if="n.asset_name_new && n.asset_name_old">
                    <b>Activo actualizado: </b>{{ n.asset_name_new }}
                    <br />
                    <b>Activo anterior: </b>
                    <strike>{{ n.asset_name_old }}</strike>
                  </div>
                  <div v-if="n.asset_name_new && !n.asset_name_old">
                    <b>Activo vinculado: </b>{{ n.asset_name_new }}
                  </div>
                  <div v-if="!n.asset_name_new && n.asset_name_old">
                    <b>Activo desvinculado: </b>
                    <strike>{{ n.asset_name_old }}</strike>
                  </div>
                </div>

                <div v-if="n.impact_new || n.impact_old">
                  <br />
                  <div v-if="n.impact_new && n.impact_old">
                    <b>Impacto actualizado: </b>{{ n.impact_new }}
                    <br />
                    <b>Impacto anterior: </b><strike>{{ n.impact_old }}</strike>
                  </div>
                  <div v-if="n.impact_new && !n.impact_old">
                    <b>Impacto agregado: </b>{{ n.impact_new }}
                  </div>
                  <div v-if="!n.impact_new && n.impact_old">
                    <b>Impacto eliminado: </b>
                    <strike>{{ n.impact_old }}</strike>
                  </div>
                </div>

                <div v-if="n.likelihood_new || n.likelihood_old">
                  <br />
                  <div v-if="n.likelihood_new && n.likelihood_old">
                    <b>Probabilidad actualizada: </b>{{ n.likelihood_new }}
                    <br />
                    <b>Probabilidad anterior: </b>
                    <strike>{{ n.likelihood_old }}</strike>
                  </div>
                  <div v-if="n.likelihood_new && !n.likelihood_old">
                    <b>Probabilidad agregada: </b>{{ n.likelihood_new }}
                  </div>
                  <div v-if="!n.likelihood_new && n.likelihood_old">
                    <b>Probabilidad eliminada: </b>
                    <strike>{{ n.likelihood_old }}</strike>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
//import ThreatList from "../components/threats/ThreatList.vue";
export default {
  props: ["threat", "audits"],
  data: () => ({}),
  components: {
    //ThreatList,
  },
  computed: {
    ...mapGetters(["getAllThreatTypes"]),
  },
  methods: {
    mapThreatType(id) {
      const tempObj = JSON.parse(
        this.getAllThreatTypes.find((x) => x.id === id).name
      );
      return tempObj[this.$i18n.locale];
    },
  },
};
</script>

<style scoped>
.trunc {
  max-width: 360px;
  vertical-align: bottom;
}
.tooltipIcon {
  float: right;
}
</style>
