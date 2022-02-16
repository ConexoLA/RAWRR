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
              :label="$t('forms.name')"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              v-model="formDataTemp.asset.description"
              :label="$t('global.description')"
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
              item-text="name_translation"
              item-value="id"
              :label="$t('global.asset_category')"
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
                @click="insertElement(formDataTemp.asset)"
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
  name: "AssetForm",
  props: ["formData"],
  computed: {
    ...mapGetters(["getAllAssetCategories"]),
    nameRules() {
      return [
        (v) => !!v || this.$t("forms.name_restriction_1"),
        (v) => (v && v.length <= 150) || this.$t("forms.name_restriction_2"),
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
