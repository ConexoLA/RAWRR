<template>
  <v-container fill-height fluid>
    <router-link to="/threats">
      <v-btn color="primary" class="black--text font-weight-regular">
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t("global.back") }}
      </v-btn>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn
      color="error"
      v-if="audits.length > 1"
      @click="dialogDeleteAll = true, threat_id = threat.id, current_threat = threat"
    >
      <v-icon class="mr-2">mdi-delete-variant</v-icon>
      {{ $t("threats.threat_history.delete") }}
    </v-btn>

    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center">
        <v-card class="elevation-2 text-left">
          <v-card-title class="text-h5 red darken-2 text-white" tabIndex="1">
            {{ $t("threats.current_threats_values") }}
          </v-card-title>
          <v-card-text class="white text--primary">
            <div v-if="threat.id" class="pt-3" tabIndex="2">
              <b>ID: </b>{{ threat.id }}
            </div>
            <div v-if="threat.name" tabIndex="3">
              <b>{{ $t("global.name") }}: </b>{{ threat.name }}
            </div>
            <div v-if="threat.description" tabIndex="4">
              <b>{{ $t("global.description") }}: </b>
              <span class="d-inline-block text-truncate trunc">{{
                threat.description
              }}</span>
              <template>
                <v-icon
                  small
                  color="accent"
                  class="trunc"
                  @click="
                    overlay_observation = true;
                    fillOverlay($t('global.description'), threat.description);
                  "
                  tabIndex="5"
                >
                  mdi-dots-vertical
                </v-icon>
              </template>
            </div>
            <div v-if="threat.threat_type_name" tabIndex="5">
              <b>{{ $t("global.threat_type") }}: </b
              >{{ threat.threat_type_name }}
            </div>
            <div v-if="threat.asset_name" tabIndex="6">
              <b>{{ $t("global.asset") }}: </b>{{ threat.asset_name }}
            </div>
            <div tabIndex="7">
              <b>{{ $t("global.impact") }}: </b>{{ threat.impact }}
            </div>
            <div tabIndex="8">
              <b>{{ $t("global.likelihood") }}: </b>{{ threat.likelihood }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col class="text-left">
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
              <b :tabIndex="n.created[1]">
                {{ $d(new Date(n.created[0]), "short", $i18n.locale) }}
              </b>
            </template>
            <v-card dark color="red darken-2">
              <v-card-title
                class="text-h5 red darken-2"
                v-if="n.type[0] == 1"
                :tabIndex="n.type[1]"
              >
                {{ $t("threats.modified_threat") }}
                <v-spacer></v-spacer>
                <v-btn icon @click="dialogDeleteSingle = true, threat_to_delete = n.id[0], current_threat = threat">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-title
                class="text-h5 red darken-2"
                v-if="n.type[0] == 0"
                :tabIndex="n.type[1]"
                >{{ $t("threats.created_threat") }}</v-card-title
              >
              <v-card-text class="white text--primary">
                <br />
                <!-- Names -->
                <div v-if="n.name_new || n.name_old">
                  <div v-if="n.name_new && n.name_old">
                    <div :tabIndex="n.name_new[1]">
                      <b>{{ $t("threats.updated_name") }}: </b
                      >{{ n.name_new[0] }}
                    </div>
                    <div :tabIndex="n.name_old[1]">
                      <b>{{ $t("threats.previous_name") }}: </b
                      ><strike>{{ n.name_old[0] }}</strike>
                    </div>
                  </div>
                  <div v-if="n.name_new && !n.name_old">
                    <div :tabIndex="n.name_new[1]">
                      <b>{{ $t("threats.added_name") }}: </b>{{ n.name_new[0] }}
                    </div>
                  </div>
                </div>
                <!-- Names -->

                <!-- Descriptions -->
                <div v-if="n.description_new || n.description_old">
                  <div v-if="n.description_new && n.description_old">
                    <div :tabIndex="n.description_new[1]">
                      <b class="d-inline text-truncate trunc"
                        >{{ $t("threats.updated_description") }}:
                      </b>
                      <span class="d-inline-block text-truncate trunc">{{
                        n.description_new[0]
                      }}</span>
                      <template>
                        <v-icon
                          small
                          color="accent"
                          class="trunc"
                          @click="
                            overlay_observation = true;
                            fillOverlay(
                              $t('threats.updated_description'),
                              n.description_new[0],
                              n.description_new[1]
                            );
                          "
                          :tabIndex="n.description_new[1] + 1"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                    </div>
                    <div :tabIndex="n.description_old[1]">
                      <b class="d-inline text-truncate trunc">
                        {{ $t("threats.previous_description") }}:
                      </b>
                      <span class="d-inline-block text-truncate trunc"
                        ><strike>{{ n.description_old[0] }}</strike></span
                      >
                      <template>
                        <v-icon
                          small
                          color="accent"
                          class="trunc"
                          @click="
                            overlay_observation = true;
                            fillOverlay(
                              $t('threats.previous_description'),
                              n.description_old[0],
                              n.description_old[1]
                            );
                          "
                          :tabIndex="n.description_old[1] + 1"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                    </div>
                  </div>
                  <div v-if="n.description_new && !n.description_old">
                    <div :tabIndex="n.description_new[1]">
                      <b class="d-inline text-truncate trunc">
                        {{ $t("threats.added_description") }}:
                      </b>
                      <span class="d-inline-block text-truncate trunc">{{
                        n.description_new[0]
                      }}</span>
                      <template>
                        <v-icon
                          small
                          color="accent"
                          class="trunc"
                          @click="
                            overlay_observation = true;
                            fillOverlay(
                              $t('threats.added_description'),
                              n.description_new[0],
                              n.description_new[1]
                            );
                          "
                          :tabIndex="n.description_new[1] + 1"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                    </div>
                  </div>
                  <div v-if="!n.description_new && n.description_old">
                    <div :tabIndex="n.description_old[1]">
                      <b class="d-inline text-truncate trunc">
                        {{ $t("threats.deleted_description") }}:
                      </b>
                      <span class="d-inline-block text-truncate trunc"
                        ><strike>{{ n.description_old[0] }}</strike></span
                      >
                      <template>
                        <v-icon
                          small
                          color="accent"
                          class="trunc"
                          @click="
                            overlay_observation = true;
                            fillOverlay(
                              $t('threats.deleted_description'),
                              n.description_old[0],
                              n.description_old[1]
                            );
                          "
                          :tabIndex="n.description_old[1] + 1"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- Descriptions -->

                <!-- impact -->
                <div v-if="n.impact_new || n.impact_old">
                  <div v-if="n.impact_new && n.impact_old">
                    <div :tabIndex="n.impact_new[1]">
                      <b>{{ $t("threats.updated_impact") }}:</b
                      >{{ n.impact_new[0] }}
                    </div>
                    <div :tabIndex="n.impact_old[1]">
                      <b>{{ $t("threats.previous_impact") }}: </b>
                      <strike>{{ n.impact_old[0] }}</strike>
                    </div>
                  </div>
                  <div v-if="n.impact_new && !n.impact_old">
                    <div :tabIndex="n.impact_new[1]">
                      <b>{{ $t("threats.added_impact") }}: </b
                      >{{ n.impact_new[0] }}
                    </div>
                  </div>
                  <div v-if="!n.impact_new && n.impact_old">
                    <div :tabIndex="n.impact_old[1]">
                      <b>{{ $t("threats.deleted_impact") }}: </b>
                      <strike>{{ n.impact_old[0] }}</strike>
                    </div>
                  </div>
                </div>
                <!-- impact -->

                <!-- likelihood -->

                <div v-if="n.likelihood_new || n.likelihood_old">
                  <div v-if="n.likelihood_new && n.likelihood_old">
                    <div :tabIndex="n.likelihood_new[1]">
                      <b>{{ $t("threats.updated_likelihood") }}: </b
                      >{{ n.likelihood_new[0] }}
                    </div>

                    <div :tabIndex="n.likelihood_old[1]">
                      <b>{{ $t("threats.previous_likelihood") }}: </b>
                      <strike>{{ n.likelihood_old[0] }}</strike>
                    </div>
                  </div>
                  <div v-if="n.likelihood_new && !n.likelihood_old">
                    <div :tabIndex="n.likelihood_new[1]">
                      <b>{{ $t("threats.added_likelihood") }}: </b
                      >{{ n.likelihood_new[0] }}
                    </div>
                  </div>
                  <div v-if="!n.likelihood_new && n.likelihood_old">
                    <div :tabIndex="n.likelihood_old[1]">
                      <b>{{ $t("threats.deleted_likelihood") }}: </b>
                      <strike>{{ n.likelihood_old[0] }}</strike>
                    </div>
                  </div>
                </div>

                <!-- likelihood -->

                <!-- threat type -->
                <div v-if="n.threat_type_name_new || n.threat_type_name_old">
                  <div v-if="n.threat_type_name_new && n.threat_type_name_old">
                    <div :tabIndex="n.threat_type_name_new[1]">
                      <b>{{ $t("threats.updated_threat_type") }}: </b>
                      {{ mapThreatType(n.threat_type_name_new) }}
                    </div>
                    <div :tabIndex="n.threat_type_name_old[1]">
                      <b>{{ $t("threats.previous_threat_type") }}: </b>
                      <strike>{{
                        mapThreatType(n.threat_type_name_old)
                      }}</strike>
                    </div>
                  </div>
                  <div v-if="n.threat_type_name_new && !n.threat_type_name_old">
                    <div :tabIndex="n.threat_type_name_new[1]">
                      <b>{{ $t("threats.added_threat_type") }}: </b>
                      {{ mapThreatType(n.threat_type_name_new) }}
                    </div>
                  </div>
                  <div v-if="!n.threat_type_name_new && n.threat_type_name_old">
                    <div :tabIndex="n.threat_type_name_old[1]">
                      <b>{{ $t("threats.deleted_threat_type") }}: </b>
                      <strike>{{
                        mapThreatType(n.threat_type_name_old)
                      }}</strike>
                    </div>
                  </div>
                </div>
                <!-- threat type -->

                <!-- assets -->
                <div v-if="n.asset_name_new || n.asset_name_old">
                  <div v-if="n.asset_name_new && n.asset_name_old">
                    <div :tabIndex="n.asset_name_new[1]">
                      <b>{{ $t("threats.updated_asset") }}: </b
                      >{{ n.asset_name_new[0] }}
                    </div>
                    <div :tabIndex="n.asset_name_old[1]">
                      <b>{{ $t("threats.previous_asset") }}: </b>
                      <strike>{{ n.asset_name_old[0] }}</strike>
                    </div>
                  </div>
                  <div v-if="n.asset_name_new && !n.asset_name_old">
                    <div :tabIndex="n.asset_name_new[1]">
                      <b>{{ $t("threats.added_asset") }}: </b
                      >{{ n.asset_name_new[0] }}
                    </div>
                  </div>
                  <div v-if="!n.asset_name_new && n.asset_name_old">
                    <div :tabIndex="n.asset_name_old[1]">
                      <b>{{ $t("threats.deleted_asset") }}: </b>
                      <strike>{{ n.asset_name_old[0] }}</strike>
                    </div>
                  </div>
                </div>
                <!-- assets -->

                <!-- observation -->
                <div v-if="n.observation" :tabIndex="n.observation[1]">
                  <hr />
                  <br />
                  <b>{{ $t("threats.observation") }}: </b>{{ n.observation[0] }}
                </div>
                <!-- observation -->
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
    <v-overlay :dark="false" :value="overlay_observation" @keydown.esc="toggle">
      <v-card outlined v-click-outside="toggle">
        <v-card-text>
          <p class="display-2 text--secondary">
            {{ description_title }}
          </p>
          <div
            :style="`
          max-height: ${(windowSize.y * 50) / 100}px;
          max-width: ${(windowSize.x * 50) / 100}px;
          overflow-y: auto;`"
            v-resize="onResize"
            :tabIndex="tab_idx + 2"
          >
            {{ description_value }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text plain color="accent" @click="overlay_observation = false">
            {{ $t("global.close_sheet") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-dialog v-model="dialogDeleteSingle" width="500">
      <v-card>
        <v-card-title class="text-h5 warning">
          {{ $t("global.delete_confirm") }}
        </v-card-title>

        <br />

        <v-card-text>
          {{ $t("threats.threat_history.confirm_delete") }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogDeleteSingle = false">
            {{ $t("global.cancel") }}
          </v-btn>
          <v-btn color="error" text @click="deleteElement">
            {{ $t("global.delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeleteAll" width="500">
      <v-card>
        <v-card-title class="text-h5 warning">
          {{ $t("global.delete_confirm") }}
        </v-card-title>

        <br />

        <v-card-text>
          {{ $t("threats.threat_history.confirm_delete_all") }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogDeleteAll = false">
            {{ $t("global.cancel") }}
          </v-btn>
          <v-btn color="error" text @click="deleteAllAudits">
            {{ $t("global.delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
//import ThreatList from "../components/threats/ThreatList.vue";
export default {
  props: ["threat", "audits"],
  data: () => ({
    dialogDeleteSingle: false,
    dialogDeleteAll: false,
    overlay_observation: false,
    threat_to_delete: false,
    current_threat: null,
    threat_id: null,
    description_value: "",
    description_title: "",
    tab_idx: "",
    windowSize: {
      x: 0,
      y: 0,
    },
  }),
  mounted() {
    document.addEventListener("keydown", (e) => {
      // If  ESC key was pressed
      if (e.keyCode == 27) {
        this.overlay_observation = false;

        // or if you have created a dialog as a custom component, emit an event
        // this.$emit('closeDialog')
      }
    });
  },
  components: {
    //ThreatList,
  },
  computed: {
    ...mapGetters(["getAllThreatTypes"]),
  },
  methods: {
    ...mapActions([
      "deleteThreatAudit",
      "deleteAllThreatAudit",
      "resetThreatAudit",
      "changeActiveThreatHistory"
    ]),    
    mapThreatType(id) {
      const tempObj = JSON.parse(
        this.getAllThreatTypes.find((x) => x.id === id[0]).name
      );
      return tempObj[this.$i18n.locale];
    },
    async deleteElement() {
      this.deleteThreatAudit(this.threat_to_delete);
      this.dialogDeleteSingle = !this.dialogDeleteSingle;
      this.changeActiveThreatHistory(this.threat);
    },
    async deleteAllAudits() {
      this.deleteAllThreatAudit(this.threat_id);
      this.dialogDeleteAll = !this.dialogDeleteAll;
      this.resetThreatAudit(this.current_threat);
    },      
    fillOverlay(title, description, tab_idx) {
      this.description_title = title;
      this.description_value = description;
      this.tab_idx = tab_idx;
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    toggle() {
      this.overlay_observation = !this.overlay_observation;
    },
  },
};
</script>

<style scoped>
.trunc {
  max-width: 360px;
  vertical-align: bottom;
}
</style>
