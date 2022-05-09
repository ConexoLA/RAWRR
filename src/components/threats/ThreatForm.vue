<template>
  <div>
    <b>{{ formDataTemp.title }}</b>
    <div class="threatForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row no-gutters>
            <v-text-field
              color="accent"
              class="mb-3"
              v-model="formDataTemp.threat.name"
              :rules="nameRules"
              :label="$t('forms.name')"
              ref="name_focus"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              color="accent"
              v-model="formDataTemp.threat.description"
              :label="$t('global.description')"
              outlined
              rows="4"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5" class="mr-5">
              <v-select
                color="accent"
                item-color="accent"
                v-model="formDataTemp.threat.threat_type_id"
                :items="getAllThreatTypes()"
                item-text="name_translation"
                item-value="id"
                :label="$t('global.threat_type')"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="5" class="ml-5">
              <v-select
                color="accent"
                item-color="accent"
                v-model="formDataTemp.threat.asset_id"
                :items="getAllAssets()"
                item-text="name"
                item-value="id"
                :label="$t('global.asset')"
                clearable
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5" class="mr-5">
              <v-text-field
                color="accent"
                v-model="formDataTemp.threat.impact"
                type="number"
                min="0"
                max="10"
                :rules="impactRules"
                :label="$t('global.impact')"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="ml-5">
              <v-text-field
                color="accent"
                v-model="formDataTemp.threat.likelihood"
                type="number"
                min="0"
                max="10"
                :rules="likelihoodRules"
                :label="$t('global.likelihood')"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            justify="center"
            v-if="formDataTemp.type === 'Edit'"
          >
            <v-col cols="8">
              <v-text-field
                color="accent"
                v-model="formDataTemp.threat.observation"
                :label="$t('threats.observation')"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            no-gutters
            class="text-end"
            v-if="formDataTemp.type === 'Edit'"
          >
            <v-col>
              <v-btn
                class="mr-4 black--text font-weight-regular"
                color="primary"
                :disabled="!valid || enabledUpdateButton()"
                @click="updateElement(formDataTemp.threat)"
                >{{ $t("global.update") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            no-gutters
            class="text-end"
            v-if="formDataTemp.type === 'Create'"
          >
            <v-col>
              <v-btn
                class="mr-4 black--text font-weight-regular"
                color="primary"
                :disabled="!valid"
                @click="insertElement(formDataTemp.threat)"
                >{{ $t("global.insert") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ThreatForm",
  props: ["formData"],
  created() {
    this.formDataTemp = this.formData;
  },
  computed: {
    nameRules() {
      return [
        (v) => !!v || this.$t("forms.name_restriction_1"),
        (v) => (v && v.length <= 150) || this.$t("forms.name_restriction_2"),
      ];
    },
    threatTypeRules() {
      return [(v) => !!v || this.$t("forms.threat_type_restriction")];
    },
    assetRules() {
      return [(v) => !!v || this.$t("generic_form_asset_restriction")];
    },
    impactRules() {
      return [
        (v) => v >= 0 || this.$t("forms.impact_restriction"),
        (v) => v <= 10 || this.$t("forms.impact_restriction"),
      ];
    },
    likelihoodRules() {
      return [
        (v) => v >= 0 || this.$t("forms.likelihood_restriction"),
        (v) => v <= 10 || this.$t("forms.likelihood_restriction"),
      ];
    },
  },
  data: () => ({
    valid: true,
    alertType: null,
    formDataTemp: null,
  }),
  mounted: function () {
    this.$nextTick(function () {
      this.$refs["name_focus"].$el.focus();
    })
  },    
  methods: {
    ...mapActions(["fetchAllThreats", "addThreat", "updateThreat"]),
    ...mapGetters(["getAllThreatTypes", "getAllAssets"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    resetImpactLikelihood() {
      this.formDataTemp.threat.impact = 0;
      this.formDataTemp.threat.likelihood = 0;
    },
    async updateElement(threat) {
      if (!threat.impact) {
        threat.impact = await 0;
      }
      if (!threat.likelihood) {
        threat.likelihood = await 0;
      }
      await this.updateThreat(threat);
      await this.fetchAllThreats();
      await this.$emit("toggle");
    },
    async insertElement(threat) {
      if (!threat.impact) {
        threat.impact = 0;
      }
      if (!threat.likelihood) {
        threat.likelihood = 0;
      }
      this.addThreat(threat);
      await this.fetchAllThreats();
      await this.$refs.form.reset();
      await this.resetImpactLikelihood();
    },
    enabledUpdateButton() {
      var b_disabled = true;
      var arr_keys = Object.keys(this.formDataTemp.threat);
      var observation_index = arr_keys.indexOf("observation");
      arr_keys.splice(observation_index, 1);
      var arrayLength = arr_keys.length;

      for (var i = 0; i < arrayLength; i++) {
        if (
          this.formDataTemp.threat[arr_keys[i]] !=
          this.formDataTemp.threat_aux[arr_keys[i]]
        ) {
          var b_disabled = false;
          break;
        }
      }
      return b_disabled;
    },
  },
};
</script>

<style scoped></style>
