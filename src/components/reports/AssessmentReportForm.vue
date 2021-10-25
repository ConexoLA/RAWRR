<template>
  <div>
    <h4>{{ formDataTemp.title }}</h4>
    <div class="assessmentReportForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <v-text-field
                  class="mb-3"
                  v-model="formDataTemp.assessmentReport.name"
                  :rules="nameRules"
                  :label="$t('forms.name')"
                  required
                ></v-text-field>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="formDataTemp.assessmentReport.description"
                  :label="$t('global.description')"
                  outlined
                  rows="5"
                  no-resize
                ></v-textarea>
              </v-row>
              <v-row v-if="formDataTemp.type === 'Edit'">
                <v-btn
                  class="
                    mr-4
                    v-btn v-btn--contained
                    theme--light
                    v-size--default
                  "
                  :disabled="!valid"
                  @click="updateElement(formDataTemp.assessmentReport)"
                  >{{ $t("global.update") }}
                </v-btn>
              </v-row>
              <v-row v-if="formDataTemp.type === 'Create'">
                <v-btn
                  class="
                    mr-4
                    v-btn v-btn--contained
                    theme--light
                    v-size--default
                  "
                  :disabled="!valid"
                  @click="insertElement(formDataTemp.assessmentReport)"
                  >{{ $t("global.insert") }}
                </v-btn>
              </v-row>
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
  name: "AssessmentActivityForm",
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
      "fetchAllAssessmentReports",
      "addAssessmentReport",
      "updateAssessmentReport",
      "setActiveReport",
      "initializeMain",
    ]),
    ...mapGetters(["getAllAssets"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    updateElement(assessmentReport) {
      this.updateAssessmentReport(assessmentReport);
      this.fetchAllAssessmentReports();
    },
    async insertElement(assessmentReport) {
      this.addAssessmentReport(assessmentReport);
      await this.fetchAllAssessmentReports();
      await this.initializeMain();
      await this.$refs.form.reset();
      await this.$router.push("reports/activeReport");
    },
  },
};
</script>

<style scoped></style>
