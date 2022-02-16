<template>
  <div>
    <b>{{ formDataTemp.title }}</b>
    <div class="recommendationForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row no-gutters>
            <v-text-field
              class="mb-3"
              v-model="formDataTemp.recommendation.name"
              :rules="nameRules"
              :label="$t('forms.name')"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              v-model="formDataTemp.recommendation.description"
              :label="$t('global.description')"
              outlined
              rows="5"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters>
            <v-select
              v-model="formDataTemp.recommendation.newVulnerabilitiesId"
              clearable
              :items="getAllVulnerabilities()"
              :label="$t('global.vulnerabilities')"
              multiple
              chips
              deletable-chips
              item-text="name"
              item-value="id"
            ></v-select>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5" class="mr-5">
              <v-text-field
                v-model="formDataTemp.recommendation.implementation_cost"
                :label="$t('global.implementation_cost')"
              ></v-text-field>
            </v-col>
            <v-col cols="5" class="ml-5">
              <v-text-field
                v-model="formDataTemp.recommendation.implementation_time"
                :label="$t('global.implementation_time')"
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
                @click="updateElement(formDataTemp.recommendation)"
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
                class="mr-4 v-btn v-btn--contained theme--light v-size--default"
                color="primary"
                :disabled="!valid"
                @click="insertElement(formDataTemp.recommendation)"
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
  name: "RecommendationForm",
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
  },
  data: () => ({
    valid: true,
    alertType: null,
    formDataTemp: null,
  }),
  methods: {
    ...mapActions([
      "fetchAllRecommendations",
      "addRecommendation",
      "updateRecommendation",
      "deleteRecommendationVulnerabilityAssociation",
      "addRecommendationVulnerabilityAssociation",
      "fetchAllRecommendationVulnerabilityAssociations",
    ]),
    ...mapGetters(["getAllVulnerabilities", "getFirstRecommendation"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    updateElement(recommendation) {
      if (
        recommendation.newVulnerabilitiesId !=
        recommendation.oldVulnerabilitiesId
      ) {
        let _recommendationVulnerabilityAssociation = {
          recommendation_id: recommendation.id,
          vulnerability_id: null,
        };
        recommendation.oldVulnerabilitiesId.forEach((oldVulnerabilityId) => {
          _recommendationVulnerabilityAssociation.vulnerability_id =
            oldVulnerabilityId;
          this.deleteRecommendationVulnerabilityAssociation(
            _recommendationVulnerabilityAssociation
          );
        });
        recommendation.newVulnerabilitiesId.forEach((newVulnerabilityId) => {
          _recommendationVulnerabilityAssociation.vulnerability_id =
            newVulnerabilityId;
          this.addRecommendationVulnerabilityAssociation(
            _recommendationVulnerabilityAssociation
          );
        });
        this.fetchAllRecommendationVulnerabilityAssociations();
      }
      this.updateRecommendation(recommendation);
      this.fetchAllRecommendations();
      this.$emit("toggle");
    },
    async insertElement(recommendation) {
      this.addRecommendation(recommendation);
      await this.fetchAllRecommendations();
      if (
        recommendation.newVulnerabilitiesId &&
        recommendation.newVulnerabilitiesId.length > 0
      ) {
        let _recommendationVulnerabilityAssociation = {
          //return first element in array since it is returned sorted from "backend" by last modified
          recommendation_id: this.getFirstRecommendation().id,
          vulnerability_id: null,
        };
        recommendation.newVulnerabilitiesId.forEach((newVulnerabilityId) => {
          _recommendationVulnerabilityAssociation.vulnerability_id =
            newVulnerabilityId;
          this.addRecommendationVulnerabilityAssociation(
            _recommendationVulnerabilityAssociation
          );
        });
        await this.fetchAllRecommendationVulnerabilityAssociations();
        await this.fetchAllRecommendations();
      }
      await this.$refs.form.reset();
    },
  },
};
</script>

<style scoped></style>
