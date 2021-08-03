<template>
  <div v-resize="onResize" style="padding: 15px">
    <v-row>
      <v-col cols="auto" align-self="center">
        <v-card class="pa-2" elevation="0">
          <v-card-title>
            {{ $t("assessment_activities_table_title") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("assessment_activities_table_subtitle") }}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="auto" align-self="center">
        <v-btn medium color="primary" @click="showCreateDialog()">{{
          $t("generic_table_add_element")
        }}</v-btn>
      </v-col>
      <v-col cols="auto" align-self="center">
        <v-btn
          v-if="selected.length"
          medium
          color="error"
          class="ml-2"
          @click="showDeleteDialog(selected)"
          >{{ $t("assessment_activity_table_delete_multiple_button") }}
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" xl="4" lg="3" md="2" align-self="center" class="pr-10">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('generic_table_search_bar_title')"
          clearable
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- 64: header, 24: table padding, 59: table footer, 36: page footer, 115: arbitrary value-->
    <v-row no-gutters>
      <v-col cols="12">
        <v-data-table
          fixed-header
          :height="windowSize.y - 64 - 24 - 59 - 36 - 115"
          v-model="selected"
          :headers="headers"
          :items="assessmentActivities"
          item-key="id"
          :items-per-page="-1"
          show-select
          :search="search"
        >
          <template v-slot:[`item.id`]="{ item }">
            <span class="d-inline-block text-truncate" :title="item.id">
              {{ item.id }}
            </span>
          </template>

          <template v-slot:[`item.name`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 15) / 100}px`"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </template>

          <template v-slot:[`item.description`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 30) / 100}px`"
              :title="item.description"
            >
              {{ item.description }}
            </span>
          </template>

          <template v-slot:[`item.asset_name`]="{ item }">
            <v-responsive
              :style="`max-width: ${(windowSize.x * 20) / 100}px`"
              max-height="100px"
              style="display: block; overflow: auto"
            >
              <v-chip
                v-for="element in item.asset_name"
                :key="element"
                :title="element"
              >
                <span class="d-inline-block text-truncate">
                  {{ element }}
                </span>
              </v-chip>
            </v-responsive>
          </template>

          <template v-slot:[`item.edit`]="props">
            <v-btn text icon color="accent" @click="showEditDialog(props.item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>

          <template v-slot:[`item.delete`]="props">
            <v-btn
              text
              icon
              color="accent"
              @click="showDeleteDialog([props.item])"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-bottom-sheet v-model="sheet" scrollable>
      <v-sheet class="text-center px-4 pt-4 overflow-y-auto">
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheet = !sheet"
          absolute
          right
          ><v-icon>mdi-close</v-icon></v-btn
        >
        <div class="my-3">
          <assessment-activity-form
            :formData="formData"
            @toggle="toggleSheet"
          ></assessment-activity-form>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <v-overlay :value="overlay">
      <div
        :style="`
          max-height: ${(windowSize.y * 80) / 100}px;
          max-width: ${(windowSize.x * 80) / 100}px;
          overflow-y: auto;`"
      >
        <v-card color="#FFFFFF" tile>
          <v-card-text>
            <p class="display-1 text--primary">
              {{ $t("generic_delete_item_confirmation") }}
            </p>
            <div v-if="deleteElements.length == 1" class="text--primary">
              {{ $t("assessment_activity_delete_description") }}
            </div>
            <div v-if="deleteElements.length > 1" class="text--primary">
              {{ $t("assessment_activity_multiple_delete_description") }}
            </div>
            <div
              v-for="element in deleteElements"
              :key="element.id"
              class="ml-5 text--primary"
            >
              (ID: {{ element.id }}) - {{ element.name }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="accent" @click="overlay = false">
              {{ $t("generic_delete_cancel") }}
            </v-btn>
            <v-btn text color="error" @click="confirmDelete()">
              {{ $t("generic_delete_confirm") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AssessmentActivityForm from "./AssessmentActivityForm.vue";
export default {
  name: "AssessmentActivityList",
  components: {
    AssessmentActivityForm,
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("generic_table_header_id"),
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: this.$t("generic_table_header_name"), value: "name" },
        {
          text: this.$t("generic_table_header_description"),
          value: "description",
        },
        { text: this.$t("generic_table_header_assets"), value: "asset_name" },
        {
          text: this.$t("generic_table_header_edit"),
          value: "edit",
          sortable: false,
        },
        {
          text: this.$t("generic_table_header_delete"),
          value: "delete",
          sortable: false,
        },
      ];
    },
    //formData gets shaped in showCreateDialog and showEditDialog
    formData() {
      return {};
    },
  },
  props: ["assessmentActivities"],
  methods: {
    ...mapActions(["fetchAllAssessmentActivities", "deleteAssessmentActivity"]),
    ...mapGetters(["getAllAssessmentActivityAssetAssociations"]),
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    toggleSheet() {
      this.sheet = !this.sheet;
    },
    obtainAssetAssociations: function (id) {
      let allAssociations = this.getAllAssessmentActivityAssetAssociations();
      let associationsById = [];
      allAssociations.forEach((association) => {
        if (association.assessment_activity_id == id) {
          associationsById.push(association.asset_id);
        }
      });
      return associationsById;
    },
    showCreateDialog() {
      this.fetchAllAssessmentActivities();
      this.formData.title = this.$t("assessment_activity_form_create");
      this.formData.type = "Create";
      this.formData.assessmentActivity = {};
      this.formData.resetFormValidation = true;
      this.sheet = !this.sheet;
    },
    showEditDialog(activity) {
      this.fetchAllAssessmentActivities();
      this.formData.title = this.$t("assessment_activity_form_edit");
      this.formData.type = "Edit";
      this.formData.assessmentActivity = activity;
      this.formData.assessmentActivity.oldAssetsId =
        this.obtainAssetAssociations(activity.id);
      this.formData.assessmentActivity.newAssetsId =
        this.formData.assessmentActivity.oldAssetsId;
      this.formData.resetFormValidation = false;
      this.sheet = !this.sheet;
    },
    showDeleteDialog(element) {
      if (element) {
        this.deleteElements = element;
        this.overlay = !this.overlay;
      }
    },
    confirmDelete() {
      if (this.deleteElements.length) {
        for (const item of this.deleteElements) {
          this.deleteAssessmentActivity(item);
        }
        this.selected = [];
        this.overlay = !this.overlay;
        this.fetchAllAssessmentActivities();
      }
    },
  },
  data: () => ({
    sheet: false,
    search: "",
    selected: [],
    deleteElements: [],
    overlay: false,
    windowSize: {
      x: 0,
      y: 0,
    },
  }),
};
</script>

<style>
.max-width-chip.v-chip {
  max-width: calc(50%);
}

.max-width-chip .v-chip__content {
  line-height: 32px;
  padding-right: 30px !important;
  display: inline-block !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.max-width-chip .v-chip__close {
  position: absolute;
  top: 5px;
  right: 0;
  width: 24px;
}
</style>
