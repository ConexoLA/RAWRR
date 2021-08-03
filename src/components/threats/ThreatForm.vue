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
              class="mb-3"
              v-model="formDataTemp.threat.name"
              :rules="nameRules"
              :label="$t('generic_form_name_label')"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              v-model="formDataTemp.threat.description"
              :label="$t('generic_form_description_label')"
              outlined
              rows="5"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5" class="mr-5">
              <v-select
                v-model="formDataTemp.threat.threat_type_id"
                :items="getAllThreatTypes"
                item-text="name"
                item-value="id"
                :label="$t('generic_form_threat_type_label')"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="5" class="ml-5">
              <v-select
                v-model="formDataTemp.threat.asset_id"
                :items="getAllAssets"
                item-text="name"
                item-value="id"
                :label="$t('generic_form_asset_label')"
                clearable
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5" class="mr-5">
              <v-text-field
                v-model="formDataTemp.threat.impact"
                type="number"
                min="0"
                max="10"
                :rules="impactRules"
                :label="$t('generic_form_impact_label')"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="ml-5">
              <v-text-field
                v-model="formDataTemp.threat.likelihood"
                type="number"
                min="0"
                max="10"
                :rules="likelihoodRules"
                :label="$t('generic_form_likelihood_label')"
                required
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
                class="mr-4 v-btn v-btn--contained theme--light v-size--default"
                color="primary"
                :disabled="!valid"
                @click="updateElement(formDataTemp.threat)"
                >{{ $t("generic_form_update_button") }}
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
                class="mr-4 v-btn v-btn--contained theme--light v-size--default"
                color="primary"
                :disabled="!valid"
                @click="insertElement(formDataTemp.threat)"
                >{{ $t("generic_form_insert_button") }}
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
    ...mapGetters(["getAllThreatTypes", "getAllAssets"]),
    nameRules() {
      return [
        (v) => !!v || this.$t("generic_form_name_restriction_1"),
        (v) =>
          (v && v.length <= 150) || this.$t("generic_form_name_restriction_2"),
      ];
    },
    threatTypeRules() {
      return [(v) => !!v || this.$t("generic_form_threat_type_restriction")];
    },
    assetRules() {
      return [(v) => !!v || this.$t("generic_form_asset_restriction")];
    },
    impactRules() {
      return [
        (v) => v >= 0 || this.$t("generic_form_impact_restriction"),
        (v) => v <= 10 || this.$t("generic_form_impact_restriction"),
      ];
    },
    likelihoodRules() {
      return [
        (v) => v >= 0 || this.$t("generic_form_likelihood_restriction"),
        (v) => v <= 10 || this.$t("generic_form_likelihood_restriction"),
      ];
    },
  },
  data: () => ({
    valid: true,
    alertType: null,
    formDataTemp: null,
  }),
  methods: {
    ...mapActions(["fetchAllThreats", "addThreat", "updateThreat"]),
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
    updateElement(threat) {
      if (!threat.impact) {
        threat.impact = 0;
      }
      if (!threat.likelihood) {
        threat.likelihood = 0;
      }
      this.updateThreat(threat);
      this.fetchAllThreats();
      this.$emit("toggle");
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
  },
};
</script>

<style scoped></style>
