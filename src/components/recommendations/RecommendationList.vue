<template>
  <div v-resize="onResize" style="padding: 15px">
    <v-row>
      <v-col cols="auto" align-self="center">
        <v-card class="pa-1" elevation="0">
          <v-card-title>
            {{ $t("recommendations.title") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("recommendations.subtitle") }}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="auto" align-self="center" class="pl-0">
        <v-btn
          medium
          color="primary"
          class="black--text font-weight-regular"
          @click="showCreateDialog()"
          >{{ $t("global.add_element") }}</v-btn
        >
      </v-col>
      <v-col cols="auto" align-self="center" class="pl-0">
        <v-btn
          v-if="selected.length"
          medium
          color="error"
          class="ml-2 white--text font-weight-medium"
          ref="multi-delete"
          @click="showDeleteDialog(selected)"
          >{{ $t("recommendations.delete_multiple") }}
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2" align-self="center" class="pr-10">
        <v-text-field
          color="accent"
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('global.search')"
          clearable
          single-line
          hide-details
          :aria-placeholder="$t('global.search_bar_accessibility')"
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
          :items="recommendations"
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
              :style="`max-width: ${(windowSize.x * 6) / 100}px`"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </template>

          <template v-slot:[`item.description`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 7) / 100}px`"
              :title="item.description"
            >
              {{ item.description }}
            </span>
          </template>

          <template v-slot:[`item.implementation_cost`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 15) / 100}px`"
              :title="item.implementation_cost"
            >
              {{ item.implementation_cost }}
            </span>
          </template>

          <template v-slot:[`item.implementation_time`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 16) / 100}px`"
              :title="item.implementation_time"
            >
              {{ item.implementation_time }}
            </span>
          </template>

          <template v-slot:[`item.vulnerability_name`]="{ item }">
            <v-responsive
              :style="`max-width: ${(windowSize.x * 18) / 100}px`"
              max-height="100px"
              style="display: block; overflow: auto"
            >
              <v-chip
                v-for="element in item.vulnerability_name"
                :key="element"
                :title="element"
              >
                <span class="d-inline-block text-truncate">
                  {{ element }}
                </span>
              </v-chip>
            </v-responsive>
          </template>

          <template v-slot:[`item.actions`]="props">
            <v-btn
              text
              icon
              color="accent"
              @click="showEditDialog(props.item)"
              :aria-placeholder="$t('global.edit') + ': ' + `${props.item.name}`"
              v-bind:ref="`ref-${props.item.id}`"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              text
              icon
              color="accent"
              :aria-placeholder="$t('global.delete') + ': ' + `${props.item.name}`"
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
          ><v-icon>mdi-close</v-icon>{{ $t("global.close_sheet") }}</v-btn
        >
        <div class="my-3">
          <recommendation-form
            :formData="formData"
            @toggle="toggleSheet"
          ></recommendation-form>
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
              {{ $t("global.delete_confirm") }}
            </p>
            <div v-if="deleteElements.length == 1" class="text--primary">
              {{ $t("recommendations.delete_confirm") }}
            </div>
            <div v-if="deleteElements.length > 1" class="text--primary">
              {{ $t("recommendations.delete_multiple_confirm") }}
            </div>
            <div
              v-for="element in deleteElements"
              :key="element.id"
              class="ml-5 text--primary"
            >
              (ID: {{ element.id }}) - {{ element.name }}
              <v-card-actions v-if="deleteElements.length == 1">
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="accent"
                  @click="
                    overlay = false;
                    focusOnEdit(element.id);
                  "
                  ref="confirmation_modal"
                >
                  {{ $t("global.cancel") }}
                </v-btn>
                <v-btn color="error" @click="confirmDelete()">
                  {{ $t("global.delete") }}
                </v-btn>
              </v-card-actions>
            </div>
            <v-card-actions v-if="deleteElements.length > 1">
              <v-spacer></v-spacer>
              <v-btn
                text
                color="accent"
                @click="
                  overlay = false;
                  focusOnDelete();
                "
                ref="confirmation_modal"
              >
                {{ $t("global.cancel") }}
              </v-btn>
              <v-btn color="error" @click="confirmDelete()">
                {{ $t("global.delete") }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RecommendationForm from "./RecommendationForm.vue";
export default {
  updated() {
    if (
      this.$refs.confirmation_modal != undefined &&
      this.$refs.confirmation_modal.length > 0
    ) {
      this.$refs.confirmation_modal[0].$el.focus();
    }
  },
  name: "RecommendationList",
  components: {
    RecommendationForm,
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("global.id"),
          align: "start",
          value: "id",
        },
        { text: this.$t("global.name"), value: "name" },
        {
          text: this.$t("global.description"),
          value: "description",
        },
        {
          text: this.$t("global.implementation_cost"),
          value: "implementation_cost",
        },
        {
          text: this.$t("global.implementation_time"),
          value: "implementation_time",
        },
        {
          text: this.$t("global.vulnerabilities"),
          value: "vulnerability_name",
        },
        {
          text: this.$t("global.actions"),
          value: "actions",
          sortable: false,
        },
      ];
    },
    //formData gets shaped in showCreateDialog and showEditDialog
    formData() {
      return {};
    },
  },
  props: ["recommendations"],
  methods: {
    ...mapActions(["fetchAllRecommendations", "deleteRecommendation"]),
    ...mapGetters(["getAllRecommendationVulnerabilityAssociations"]),
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    toggleSheet() {
      this.sheet = !this.sheet;
    },
    obtainVulnerabilityAssociations: function (id) {
      let allAssociations =
        this.getAllRecommendationVulnerabilityAssociations();
      let associationsById = [];
      allAssociations.forEach((association) => {
        if (association.recommendation_id == id) {
          associationsById.push(association.vulnerability_id);
        }
      });
      return associationsById;
    },
    showCreateDialog() {
      this.fetchAllRecommendations();
      this.formData.title = this.$t("recommendations.form_create");
      this.formData.type = "Create";
      this.formData.recommendation = {};
      this.formData.resetFormValidation = true;
      this.sheet = !this.sheet;
    },
    showEditDialog(recommendation) {
      this.fetchAllRecommendations();
      this.formData.title = this.$t("recommendations.form_edit") + ": " + recommendation.name;
      this.formData.type = "Edit";
      this.formData.recommendation = recommendation;
      this.formData.recommendation_aux = Object.assign({}, recommendation);
      this.formData.recommendation.oldVulnerabilitiesId =
        this.obtainVulnerabilityAssociations(recommendation.id);
      this.formData.recommendation.newVulnerabilitiesId =
        this.formData.recommendation.oldVulnerabilitiesId;
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
          this.deleteRecommendation(item);
        }
        this.selected = [];
        this.overlay = !this.overlay;
        this.fetchAllRecommendations();
      }
    },
    focusOnEdit(focus_on) {
      this.$refs["ref-" + focus_on].$el.focus();
    },
    focusOnDelete() {
      this.$refs["multi-delete"].$el.focus();
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
.v-datatable .v-datatable__actions {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
