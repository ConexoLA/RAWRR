<template>
  <div>
    <b>{{ formDataTemp.title }}</b>
    <div class="assetForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row no-gutters>
            <v-text-field
              class="mb-3"
              v-model="formDataTemp.asset.name"
              :rules="nameRules"
              :label="$t('generic_form_name_label')"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              v-model="formDataTemp.asset.description"
              :label="$t('generic_form_description_label')"
              outlined
              rows="5"
              no-resize
            ></v-textarea>
          </v-row>
          <v-row no-gutters>
            <v-select
              class="mb-3"
              v-model="formDataTemp.asset.asset_category_id"
              :items="getAllAssetCategories"
              item-text="name"
              item-value="id"
              :label="$t('generic_form_asset_category_label')"
              clearable
            ></v-select>
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
                @click="updateElement(formDataTemp.asset)"
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
                @click="insertElement(formDataTemp.asset)"
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
  name: "AssetForm",
  props: ["formData"],
  computed: {
    ...mapGetters(["getAllAssetCategories"]),
    nameRules() {
      return [
        (v) => !!v || this.$t("generic_form_name_restriction_1"),
        (v) =>
          (v && v.length <= 150) || this.$t("generic_form_name_restriction_2"),
      ];
    },
  },
  created() {
    this.formDataTemp = this.formData;
  },
  data: () => ({
    valid: true,
    alertType: null,
    formDataTemp: null,
  }),
  methods: {
    ...mapActions(["fetchAllAssets", "addAsset", "updateAsset"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    updateElement(asset) {
      this.updateAsset(asset);
      this.fetchAllAssets();
      this.$emit("toggle");
    },
    insertElement(asset) {
      this.addAsset(asset);
      this.fetchAllAssets();
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped></style>
