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
            {{$t("threats.current_threats_values")}}
          </v-card-title>
          <v-card-text class="white text--primary">
            <div v-if="threat.id" class="pt-3"><b>ID: </b>{{ threat.id }}</div>
            <div v-if="threat.name"><b>{{$t("global.name")}}: </b>{{ threat.name }}</div>
            <div v-if="threat.description">
              <b>{{$t("global.description")}}: </b>
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
              <b>{{$t("global.threat_type")}}: </b>{{ threat.threat_type_name }}
            </div>
            <div v-if="threat.asset_name">
              <b>{{$t("global.asset")}}: </b>{{ threat.asset_name }}
            </div>
            <div><b>{{$t("global.impact")}}: </b>{{ threat.impact }}</div>
            <div><b>{{$t("global.likelihood")}}: </b>{{ threat.likelihood }}</div>
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
              <v-card-title class="text-h5 red darken-2" v-if="n.type == 1">{{$t("threats.modified_threat")}}</v-card-title>
              <v-card-title class="text-h5 red darken-2" v-if="n.type == 0">{{$t("threats.created_threat")}}</v-card-title>
              <v-card-text class="white text--primary">
                <div v-if="n.name_new || n.name_old">
                  <br />
                  <div v-if="n.name_new && n.name_old">
                    <b>{{$t("threats.updated_name")}}: </b>{{ n.name_new }}
                    <br />
                    <b>{{$t("threats.previous_name")}}: </b><strike>{{ n.name_old }}</strike>
                  </div>
                  <div v-if="n.name_new && !n.name_old">
                    <b>{{$t("threats.added_name")}}: </b>{{ n.name_new }}
                  </div>
                </div>
                <div v-if="n.description_new || n.description_old">
                  <br />

                  <div v-if="n.description_new && n.description_old">
                    <b class="d-inline text-truncate trunc"
                      >{{$t("threats.updated_description")}}:
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

                    <b class="d-inline text-truncate trunc">
                      {{$t("threats.previous_description")}}:
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
                    <b>{{$t("threats.added_description")}}: </b>
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
                    <b>{{$t("threats.deleted_description")}}: </b
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
                    <b>{{$t("threats.updated_threat_type")}}: </b>
                    {{ mapThreatType(n.threat_type_name_new) }}
                    <br />
                    <b>{{$t("threats.previous_threat_type")}}: </b>
                    <strike>{{ mapThreatType(n.threat_type_name_old) }}</strike>
                  </div>
                  <div v-if="n.threat_type_name_new && !n.threat_type_name_old">
                    <b>{{$t("threats.added_threat_type")}}: </b>
                    {{ mapThreatType(n.threat_type_name_new) }}
                  </div>
                  <div v-if="!n.threat_type_name_new && n.threat_type_name_old">
                    <b>{{$t("threats.deleted_threat_type")}}: </b>
                    <strike>{{ mapThreatType(n.threat_type_name_old) }}</strike>
                  </div>
                </div>
                <div v-if="n.asset_name_new || n.asset_name_old">
                  <br />
                  <div v-if="n.asset_name_new && n.asset_name_old">
                    <b>{{$t("threats.updated_asset")}}: </b>{{ n.asset_name_new }}
                    <br />
                    <b>{{$t("threats.previous_asset")}}: </b>
                    <strike>{{ n.asset_name_old }}</strike>
                  </div>
                  <div v-if="n.asset_name_new && !n.asset_name_old">
                    <b>{{$t("threats.added_asset")}}: </b>{{ n.asset_name_new }}
                  </div>
                  <div v-if="!n.asset_name_new && n.asset_name_old">
                    <b>{{$t("threats.deleted_asset")}}: </b>
                    <strike>{{ n.asset_name_old }}</strike>
                  </div>
                </div>

                <div v-if="n.impact_new || n.impact_old">
                  <br />
                  <div v-if="n.impact_new && n.impact_old">
                    <b>{{$t("threats.updated_impact")}}:</b>{{ n.impact_new }}
                    <br />
                    <b>{{$t("threats.previous_impact")}}: </b><strike>{{ n.impact_old }}</strike>
                  </div>
                  <div v-if="n.impact_new && !n.impact_old">
                    <b>{{$t("threats.added_impact")}}: </b>{{ n.impact_new }}
                  </div>
                  <div v-if="!n.impact_new && n.impact_old">
                    <b>{{$t("threats.deleted_impact")}}: </b>
                    <strike>{{ n.impact_old }}</strike>
                  </div>
                </div>

                <div v-if="n.likelihood_new || n.likelihood_old">
                  <br />
                  <div v-if="n.likelihood_new && n.likelihood_old">
                    <b>{{$t("threats.updated_likelihood")}}: </b>{{ n.likelihood_new }}
                    <br />
                    <b>{{$t("threats.previous_likelihood")}}: </b>
                    <strike>{{ n.likelihood_old }}</strike>
                  </div>
                  <div v-if="n.likelihood_new && !n.likelihood_old">
                    <b>{{$t("threats.added_likelihood")}}: </b>{{ n.likelihood_new }}
                  </div>
                  <div v-if="!n.likelihood_new && n.likelihood_old">
                    <b>{{$t("threats.deleted_likelihood")}}: </b>
                    <strike>{{ n.likelihood_old }}</strike>
                  </div>
                </div>
                <div v-if="n.observation">
                  <hr>
                  <br />
                  <b>{{$t("threats.observation")}}: </b>{{ n.observation }}
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
