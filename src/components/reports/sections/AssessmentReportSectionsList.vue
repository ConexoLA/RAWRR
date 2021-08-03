<template>
  <div v-resize="onResize" style="padding: 30px">
    <v-card-title>
      <v-row>
        <v-col md="auto">
          <v-card class="pa-2" elevation="0">
            {{ $t("assessment_report_sections_table_title") }}
          </v-card>
        </v-col>
        <v-col md="auto">
          <v-card class="pa-2" elevation="0">
            <v-btn medium color="primary" @click="showCreateDialog()">{{
              $t("generic_table_add_element")
            }}</v-btn>
          </v-card>
        </v-col>
        <v-col md="auto">
          <v-card class="pa-2" elevation="0">
            <v-btn
              v-if="selected.length"
              medium
              color="error"
              class="ml-2"
              @click="showDeleteDialog(selected)"
              >{{
                $t("assessment_report_section_table_delete_multiple_button")
              }}
            </v-btn>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-card elevation="0">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('generic_table_search_bar_title')"
              clearable
              single-line
              hide-details
            ></v-text-field>
          </v-card>
        </v-col>
      </v-row>
    </v-card-title>

    <!-- 64: header, 24: table padding, 59: table footer, 36: page footer, 130: arbitrary value-->
    <v-data-table
      fixed-header
      :height="windowSize.y - 64 - 24 - 59 - 36 - 130"
      v-model="selected"
      :headers="headers"
      :items="assessmentReportSections"
      item-key="id"
      :items-per-page="5"
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
          :style="`max-width: ${(windowSize.x * 30) / 100}px`"
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

      <template v-slot:[`item.edit`]="props">
        <v-btn text icon color="accent" @click="showEditDialog(props.item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.delete`]="props">
        <v-btn text icon color="accent" @click="showDeleteDialog([props.item])">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

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
          <assessment-report-sections-form
            v-bind:formData="formData"
          ></assessment-report-sections-form>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-overlay :value="overlay">
      <v-card color="#FFFFFF" outlined>
        <v-card-text>
          <p class="display-1 text--primary">
            {{ $t("generic_delete_item_confirmation") }}
          </p>
          <div v-if="deleteElements.length == 1" class="text--primary">
            {{ $t("assessment_report_section_delete_description") }}
          </div>
          <div v-if="deleteElements.length > 1" class="text--primary">
            {{ $t("assessment_report_section_multiple_delete_description") }}
          </div>
          <div
            style="margin-left: 20px"
            v-for="element in deleteElements"
            :key="element.id"
            class="text--primary"
          >
            (ID: {{ element.id }}) - {{ element.name }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="confirmDelete()">
            {{ $t("generic_delete_confirm") }}
          </v-btn>
          <v-btn @click="overlay = false" text color="error">
            {{ $t("generic_delete_cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AssessmentReportSectionsForm from "./AssessmentReportSectionsForm.vue";
export default {
  name: "AssessmentActivityList",
  components: {
    AssessmentReportSectionsForm,
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
  props: ["assessmentReportSections"],
  methods: {
    ...mapActions([
      "fetchAllAssessmentReportSections",
      "deleteAssessmentReportSection",
    ]),
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    showCreateDialog() {
      this.fetchAllAssessmentReportSections();
      this.formData.title = this.$t("assessment_report_section_form_create");
      this.formData.type = "Create";
      this.formData.assessmentReportSection = {};
      this.formData.resetFormValidation = true;
      this.sheet = !this.sheet;
    },
    showEditDialog(section) {
      this.fetchAllAssessmentReportSections();
      this.formData.title = this.$t("assessment_report_section_form_edit");
      this.formData.type = "Edit";
      this.formData.assessmentReportSection = section;
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
          this.deleteAssessmentReportSection(item);
        }
        this.selected = [];
        this.overlay = !this.overlay;
        this.fetchAllAssessmentReportSections();
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
