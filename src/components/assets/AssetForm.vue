<template>
  <div>
    <b tabindex="0">{{ formDataTemp.title }}</b>
    <div class="assetForm">
      <v-container>
        <v-form ref="form" v-model="valid">
          <v-row v-if="formDataTemp.resetFormValidation === true">
            {{ resetFormValidation() }}
          </v-row>
          <v-row no-gutters>
            <v-text-field
              color="accent"
              class="mb-3"
              v-model="formDataTemp.asset.name"
              :rules="nameRules"
              :label="$t('forms.name')"
              ref="name_focus"
              required
            ></v-text-field>
          </v-row>
          <v-row no-gutters>
            <v-textarea
              color="accent"
              v-model="formDataTemp.asset.description"
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
                class="mr-4 black--text font-weight-regular"
                color="primary"
                :disabled="!valid || enabledUpdateButton()"
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
                class="mr-4 black--text font-weight-regular"
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
  mounted: function () {
    this.$nextTick(function () {
      this.$refs["name_focus"].$el.focus();
    })
  },    
  methods: {
    ...mapActions(["fetchAllAssets", "addAsset", "updateAsset"]),
    resetFormValidation() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
        this.formDataTemp.resetFormValidation = false;
      }
    },
    async updateElement(asset) {
      await this.updateAsset(asset);
      await this.fetchAllAssets();
      await this.$emit("toggle");
    },
    insertElement(asset) {
      this.addAsset(asset);
      this.fetchAllAssets();
      this.$refs.form.reset();
    },
    enabledUpdateButton() {
      var b_disabled = true;
      var arr_keys = Object.keys(this.formDataTemp.asset);
      var arrayLength = arr_keys.length;

      for (var i = 0; i < arrayLength; i++) {
        if (
          this.formDataTemp.asset[arr_keys[i]] !=
          this.formDataTemp.asset_aux[arr_keys[i]]
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
