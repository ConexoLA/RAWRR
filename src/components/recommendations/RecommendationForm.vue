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
              color="accent"
              class="mb-3"
              v-model="formDataTemp.recommendation.name"
              :rules="nameRules"
              :label="$t('forms.name')"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              color="accent"
              v-model="formDataTemp.recommendation.description"
              :label="$t('global.description')"
              outlined
              rows="5"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters justify="center">
            <v-col cols="5">
              <v-text-field
                color="accent"
                v-model="formDataTemp.recommendation.implementation_cost"
                :label="$t('global.implementation_cost')"
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-text-field
                color="accent"
                v-model="formDataTemp.recommendation.implementation_time"
                :label="$t('global.implementation_time')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-select
              color="accent"
              item-color="accent"
              v-model="formDataTemp.recommendation.newVulnerabilitiesId"
              clearable
              :items="getAllVulnerabilities()"
              :label="$t('global.vulnerabilities')"
              multiple
              chips
              deletable-chips
              item-text="name"
              item-value="id"
              @change="checkChange()"
            ></v-select>
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
                :disabled="shouldDisableButton()"
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
                class="mr-4 black--text font-weight-regular"
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
    changedRelated: true,
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
    async updateElement(recommendation) {
      if (
        recommendation.newVulnerabilitiesId !=
        recommendation.oldVulnerabilitiesId
      ) {
        let _recommendationVulnerabilityAssociation = await {
          recommendation_id: recommendation.id,
          vulnerability_id: null,
        };
        await recommendation.oldVulnerabilitiesId.forEach(
          (oldVulnerabilityId) => {
            _recommendationVulnerabilityAssociation.vulnerability_id =
              oldVulnerabilityId;
            this.deleteRecommendationVulnerabilityAssociation(
              _recommendationVulnerabilityAssociation
            );
          }
        );
        await recommendation.newVulnerabilitiesId.forEach(
          (newVulnerabilityId) => {
            _recommendationVulnerabilityAssociation.vulnerability_id =
              newVulnerabilityId;
            this.addRecommendationVulnerabilityAssociation(
              _recommendationVulnerabilityAssociation
            );
          }
        );
        await this.fetchAllRecommendationVulnerabilityAssociations();
      }
      await this.updateRecommendation(recommendation);
      await this.fetchAllRecommendations();
      this.changedRelated = await true;
      await this.$emit("toggle");
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
    enabledUpdateButton() {
      var b_disabled = true;
      var arr_keys = Object.keys(this.formDataTemp.recommendation);
      var old_vul_index = arr_keys.indexOf("oldVulnerabilitiesId");
      arr_keys.splice(old_vul_index, 1);
      var new_vul_index = arr_keys.indexOf("newVulnerabilitiesId");
      arr_keys.splice(new_vul_index, 1);

      var arrayLength = arr_keys.length;
      for (var i = 0; i < arrayLength; i++) {
        if (
          this.formDataTemp.recommendation[arr_keys[i]] !=
          this.formDataTemp.recommendation_aux[arr_keys[i]]
        ) {
          var b_disabled = false;
          break;
        }
      }
      return b_disabled;
    },
    checkChange() {
      if (
        JSON.stringify(this.formDataTemp.recommendation.oldVulnerabilitiesId) ==
        JSON.stringify(this.formDataTemp.recommendation.newVulnerabilitiesId)
      ) {
        this.changedRelated = true;
      } else {
        this.changedRelated = false;
      }
    },
    shouldDisableButton() {
      if (!this.valid || (this.changedRelated && this.enabledUpdateButton())) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped></style>
