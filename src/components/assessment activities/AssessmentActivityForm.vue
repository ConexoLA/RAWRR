<template>
  <div>
    <b>{{ formDataTemp.title }}</b>
    <div class="assessmentActivityForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row no-gutters>
            <v-text-field
              color="accent"
              class="mb-3"
              v-model="formDataTemp.assessmentActivity.name"
              :rules="nameRules"
              :label="$t('forms.name')"
              ref="name_focus"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              color="accent"
              v-model="formDataTemp.assessmentActivity.description"
              :label="$t('global.description')"
              outlined
              rows="5"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters>
            <v-select
              color="accent"
              item-color="accent"
              class="mb-3"
              v-model="formDataTemp.assessmentActivity.newAssetsId"
              clearable
              :items="getAllAssets()"
              :label="$t('global.assets')"
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
                @click="updateElement(formDataTemp.assessmentActivity)"
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
                @click="insertElement(formDataTemp.assessmentActivity)"
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
    changedRelated: true,
    alertType: null,
    formDataTemp: null,
  }),
  mounted: function () {
    this.$nextTick(function () {
      this.$refs["name_focus"].$el.focus();
    })
  },  
  methods: {
    ...mapActions([
      "fetchAllAssessmentActivities",
      "addAssessmentActivity",
      "updateAssessmentActivity",
      "deleteAssessmentActivityAssetAssociation",
      "addAssessmentActivityAssetAssociation",
      "fetchAllAssessmentActivityAssetAssociations",
    ]),
    ...mapGetters(["getAllAssets", "getFirstAssessmentActivity"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    async updateElement(assessmentActivity) {
      if (assessmentActivity.newAssetsId != assessmentActivity.oldAssetsId) {
        let _activityAssetAssociation = await {
          assessment_activity_id: assessmentActivity.id,
          asset_id: null,
        };
        await assessmentActivity.oldAssetsId.forEach((oldAssetId) => {
          _activityAssetAssociation.asset_id = oldAssetId;
          this.deleteAssessmentActivityAssetAssociation(
            _activityAssetAssociation
          );
        });
        await assessmentActivity.newAssetsId.forEach((newAssetId) => {
          _activityAssetAssociation.asset_id = newAssetId;
          this.addAssessmentActivityAssetAssociation(_activityAssetAssociation);
        });
        await this.fetchAllAssessmentActivityAssetAssociations();
      }
      await this.updateAssessmentActivity(assessmentActivity);
      await this.fetchAllAssessmentActivities();
      this.changedRelated = await true;
      await this.$emit("toggle");
    },
    async insertElement(assessmentActivity) {
      this.addAssessmentActivity(assessmentActivity);
      await this.fetchAllAssessmentActivities();
      if (
        assessmentActivity.newAssetsId &&
        assessmentActivity.newAssetsId.length > 0
      ) {
        let _activityAssetAssociation = {
          //return first element in array since it is returned sorted from "backend" by last modified
          assessment_activity_id: this.getFirstAssessmentActivity().id,
          asset_id: null,
        };
        await assessmentActivity.newAssetsId.forEach((newAssetId) => {
          _activityAssetAssociation.asset_id = newAssetId;
          this.addAssessmentActivityAssetAssociation(_activityAssetAssociation);
        });
        await this.fetchAllAssessmentActivityAssetAssociations();
        await this.fetchAllAssessmentActivities();
      }
      await this.$refs.form.reset();
    },
    enabledUpdateButton() {
      var b_disabled = true;
      var arr_keys = Object.keys(this.formDataTemp.assessmentActivity);

      var old_ass_index = arr_keys.indexOf("oldAssetsId");
      arr_keys.splice(old_ass_index, 1);
      var new_ass_index = arr_keys.indexOf("newAssetsId");
      arr_keys.splice(new_ass_index, 1);

      var arrayLength = arr_keys.length;
      for (var i = 0; i < arrayLength; i++) {
        if (
          this.formDataTemp.assessmentActivity[arr_keys[i]] !=
          this.formDataTemp.assessmentActivity_aux[arr_keys[i]]
        ) {
          b_disabled = false;
          break;
        }
      }
      return b_disabled;
    },
    checkChange() {
      if (
        JSON.stringify(this.formDataTemp.assessmentActivity.oldAssetsId) ==
        JSON.stringify(this.formDataTemp.assessmentActivity.newAssetsId)
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
