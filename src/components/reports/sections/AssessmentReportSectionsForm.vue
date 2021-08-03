<template>
  <div>
    <h4>{{ formDataTemp.title }}</h4>
    <div class="assessmentReportSectionForm">
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
                  v-model="formDataTemp.assessmentReportSection.name"
                  :rules="nameRules"
                  :label="$t('generic_form_name_label')"
                  required
                ></v-text-field>
              </v-row>
              <v-row>
                <v-textarea
                  v-model="formDataTemp.assessmentReportSection.description"
                  :label="$t('generic_form_description_label')"
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
                  @click="updateElement(formDataTemp.assessmentReportSection)"
                  >{{ $t("generic_form_update_button") }}
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
                  @click="insertElement(formDataTemp.assessmentReportSection)"
                  >{{ $t("generic_form_insert_button") }}
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
  name: "AssessmentReportSectionForm",
  props: ["formData"],
  created() {
    this.formDataTemp = this.formData;
  },
  computed: {
    nameRules() {
      return [
        (v) => !!v || this.$t("generic_form_name_restriction_1"),
        (v) =>
          (v && v.length <= 150) || this.$t("generic_form_name_restriction_2"),
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
      "fetchAllAssessmentReportSections",
      "addAssessmentReportSection",
      "updateAssessmentReportSection",
    ]),
    ...mapGetters(["getAllAssessmentReportSections"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    updateElement(assessmentReportSection) {
      this.updateAssessmentReportSection(assessmentReportSection);
      this.fetchAllAssessmentReportSections();
    },
    async insertElement(assessmentReportSection) {
      this.addAssessmentReportSection(assessmentReportSection);
      await this.fetchAllAssessmentReportSections();
      await this.$refs.form.reset();
    },
  },
};
</script>

<style scoped></style>
