<template>
  <div v-resize="onResize" style="padding: 15px">
    <v-row>
      <v-col cols="auto" align-self="center">
        <v-card class="pa-1" elevation="0">
          <v-card-title>
            {{ $t("threats.title") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("threats.subtitle") }}
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="auto" align-self="center" class="pl-1">
        <v-btn
          medium
          color="primary"
          class="black--text font-weight-regular"
          @click="showCreateDialog()"
          >{{ $t("global.add_element") }}</v-btn
        >
      </v-col>
      <v-col cols="auto" align-self="center" class="pl-1">
        <v-btn
          :aria-label="
            $t('threats.risk_matrix.show') +
            '. ' +
            $t('global.risk_matrix_accessibility')
          "
          ref="rm"
          medium
          color="primary"
          class="black--text font-weight-regular"
          @click="
            showCreateMatrix();
            focusOn('nrm');
          "
          >{{ $t("threats.risk_matrix.show") }}</v-btn
        >
      </v-col>
      <v-col cols="auto" align-self="center" class="pl-1">
        <v-btn
          v-if="selected.length"
          medium
          color="error"
          class="white--text font-weight-medium"
          ref="multi-delete"
          @click="showDeleteDialog(selected)"
          >{{ $t("threats.delete_multiple") }}
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
          :items="threats"
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
              :style="`max-width: ${(windowSize.x * 12) / 100}px`"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </template>

          <template v-slot:[`item.description`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 12) / 100}px`"
              :title="item.description"
            >
              {{ item.description }}
            </span>
          </template>

          <template v-slot:[`item.threat_type_name`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 10) / 100}px`"
              :title="item.threat_type_name"
            >
              {{ item.threat_type_name }}
            </span>
          </template>

          <template v-slot:[`item.asset_name`]="{ item }">
            <span
              class="d-inline-block text-truncate"
              :style="`max-width: ${(windowSize.x * 10) / 100}px`"
              :title="item.asset_name"
            >
              {{ item.asset_name }}
            </span>
          </template>

          <template v-slot:[`item.impact`]="{ item }">
            <span :title="item.impact">
              {{ item.impact }}
            </span>
          </template>

          <template v-slot:[`item.likelihood`]="{ item }">
            <span :title="item.likelihood">
              {{ item.likelihood }}
            </span>
          </template>

          <template v-slot:[`item.actions`]="props">
            <v-btn
              text
              icon
              color="accent"
              @click="showEditDialog(props.item)"
              v-bind:ref="`ref-${props.item.id}`"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              text
              icon
              color="accent"
              @click="showDeleteDialog([props.item])"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              text
              icon
              color="accent"
              @click="selectActiveThreatH(props.item)"
            >
              <v-icon>mdi-history</v-icon>
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
          <threat-form
            v-bind:formData="formData"
            @toggle="toggleSheet"
          ></threat-form>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <v-overlay :value="matrix">
      <v-card class="mx-auto">
        <v-card-title>
          {{ $t("threats.risk_matrix.vcard_name") }}
          <v-spacer></v-spacer>
          <v-btn
            ref="nrm"
            text
            color="primary"
            @click="
              matrix = !matrix;
              focusOn('rm');
            "
          >
            <v-icon>mdi-close</v-icon>
            {{ $t("global.close_sheet") }}
          </v-btn>
        </v-card-title>

        <GChart
          :settings="{ packages: ['corechart'] }"
          type="BubbleChart"
          @ready="onChartReady"
          style="width: 500px; height: 500px"
        />

        <v-spacer></v-spacer>

        <v-card-actions class="justify-center">
          <v-btn
            ref="svi"
            text
            color="primary"
            @click="callExportImage(), focusOn('svi')"
          >
            {{ $t("threats.risk_matrix.export_message") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

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
              {{ $t("threats.delete_confirm") }}
            </div>
            <div v-if="deleteElements.length > 1" class="text--primary">
              {{ $t("threats.delete_multiple_confirm") }}
            </div>
            <div v-for="element in deleteElements" :key="element.id">
              <div class="ml-5 text--primary">
                (ID: {{ element.id }}) - {{ element.name }}
              </div>
              <v-card-actions v-if="deleteElements.length == 1">
                <v-btn
                  class="mr-5"
                  text
                  color="error"
                  @click="deleteAudits()"
                  ><v-icon class="mr-1">mdi-history</v-icon>
                  {{ $t("global.delete_history") }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  class="ml-5"
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
            <div>
              <v-card-actions v-if="deleteElements.length > 1">
                <v-btn
                  class="mr-5"
                  text
                  color="error"
                  @click="deleteAudits()"
                  ><v-icon class="mr-1">mdi-history</v-icon>
                  {{ $t("global.delete_history") }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  class="ml-5"
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
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { GChart } from "vue-google-charts";
import ThreatForm from "./ThreatForm.vue";

export default {
  updated() {
    if (
      this.$refs.confirmation_modal != undefined &&
      this.$refs.confirmation_modal.length > 0
    ) {
      this.$refs.confirmation_modal[0].$el.focus();
    }
  },
  name: "ThreatList",
  components: {
    GChart,
    ThreatForm,
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
          text: this.$t("global.threat_type"),
          value: "threat_type_name",
        },
        {
          text: this.$t("global.asset"),
          value: "asset_name",
        },
        {
          text: this.$t("global.impact"),
          value: "impact",
        },
        {
          text: this.$t("global.likelihood"),
          value: "likelihood",
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
  props: ["threats"],
  methods: {
    ...mapActions([
      "fetchAllThreats",
      "deleteThreat",
      "changeActiveThreatHistory",
      "deleteAuditElements",
      "exportImage",
    ]),
    onChartReady(chart, google) {
      // Initialize Risk matrix and Counter Matrix
      var matrix = [];
      var counter = [];

      // Get locale for axis
      this.chart_options.hAxis.title = this.$t("threats.risk_matrix.h_axis");
      this.chart_options.vAxis.title = this.$t("threats.risk_matrix.v_axis");

      // Both are size [11][11] props to JS team.
      for (var i = 0; i <= 10; i++) {
        matrix[i] = new Array(11);
        counter[i] = new Array(11);
      }

      // Fill with zeros
      for (var i = 0; i <= 10; i++) {
        for (var j = 0; j <= 10; j++) {
          matrix[i][j] = 0;
          counter[i][j] = 0;
        }
      }

      // Fill data
      for (var i = 0; i < this.threats.length; i++) {
        matrix[this.threats[i].likelihood][this.threats[i].impact] += 1;
      }

      // This first row should solve column message error in line 396
      const data = [
        [
          { type: "string", label: "ID" },
          { type: "number", label: this.$t("threats.risk_matrix.h_axis") },
          { type: "number", label: this.$t("threats.risk_matrix.v_axis") },
          { type: "number", label: this.$t("threats.risk_matrix.value") },
          { type: "number", label: this.$t("threats.risk_matrix.name") },
        ],
      ];

      for (var i = 0; i < this.threats.length; i++) {
        data.push([
          String(this.threats[i].id),
          {
            v: this.getCircleX(
              this.threats[i].likelihood,
              0.5,
              counter[this.threats[i].likelihood][this.threats[i].impact],
              matrix[this.threats[i].likelihood][this.threats[i].impact]
            ),
            f: this.threats[i].likelihood,
          },
          {
            v: this.getCircleY(
              this.threats[i].impact,
              0.5,
              counter[this.threats[i].likelihood][this.threats[i].impact],
              matrix[this.threats[i].likelihood][this.threats[i].impact]
            ),
            f: this.threats[i].impact,
          },
          this.threats[i].impact * this.threats[i].likelihood,
          {
            v: 2,
            f: this.threats[i].name,
          },
        ]);
        counter[this.threats[i].likelihood][this.threats[i].impact] += 1;
      }

      // Transform the Array into a proper DataTable
      var chart_data = new google.visualization.arrayToDataTable(data, false);

      // Remove notification error for columns
      // This could be fixed in the future by vue-google-charts team
      google.visualization.events.addListener(
        chart,
        "error",
        function (googleError) {
          google.visualization.errors.removeError(googleError.id);
        }
      );

      chart.draw(chart_data, this.chart_options);

      this.base64Data = chart
        .getImageURI()
        .replace(/^data:image\/png;base64,/, "");
    },
    callExportImage() {
      this.exportImage([
        "png",
        this.base64Data,
        this.$t("threats.risk_matrix.export_title"),
        this.$t("threats.risk_matrix.export_subtitle"),
      ]);
    },
    getCircleX(cx, r, k, n) {
      return cx + Math.min(1, n - 1) * r * Math.cos((2 * Math.PI * k) / n);
    },
    getCircleY(cy, r, k, n) {
      return cy + Math.min(1, n - 1) * r * Math.sin((2 * Math.PI * k) / n);
    },
    onResize() {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight };
    },
    toggleSheet() {
      this.sheet = !this.sheet;
    },
    toggleMatrix() {
      this.matrix = !this.matrix;
    },
    showCreateMatrix() {
      this.matrix = !this.matrix;
    },
    showCreateDialog() {
      this.fetchAllThreats();
      this.formData.title = this.$t("threats.form_create");
      this.formData.type = "Create";
      this.formData.threat = {};
      this.formData.threat.impact = 0;
      this.formData.threat.likelihood = 0;
      this.formData.resetFormValidation = true;
      this.sheet = !this.sheet;
    },
    showEditDialog(threat) {
      this.fetchAllThreats();
      this.formData.title = this.$t("threats.form_edit");
      this.formData.type = "Edit";
      this.formData.threat = threat;
      this.formData.threat_aux = Object.assign({}, threat);
      this.formData.resetFormValidation = false;
      this.sheet = !this.sheet;
    },
    showDeleteDialog(element) {
      if (element) {
        this.deleteElements = element;
        this.overlay = !this.overlay;
      }
    },
    async selectActiveThreatH(threat) {
      await this.changeActiveThreatHistory(threat);
      await this.$router.push("/threats/history");
    },
    confirmDelete() {
      if (this.deleteElements.length) {
        for (const item of this.deleteElements) {
          this.deleteThreat(item);
        }
        this.selected = [];
        this.overlay = !this.overlay;
        this.fetchAllThreats();
      }
    },
    focusOn(elemento) {
      if (elemento == "nrm") {
        setTimeout(() => {
          this.$refs.nrm.$el.focus();
        }, 0);
      } else if (elemento == "rm") {
        setTimeout(() => {
          this.$refs.rm.$el.focus();
        }, 0);
      } else if (elemento == "svi") {
        setTimeout(() => {
          this.$refs.svi.$el.focus();
        }, 0);
      }
    },
    deleteAudits(){
      this.deleteElements.forEach((element) => {
        this.deleteAuditElements(element);
      });
      this.overlay = !this.overlay;
    },
    focusOnEdit(focus_on) {
      this.$refs["ref-" + focus_on].$el.focus();
    },
    focusOnDelete() {
      this.$refs["multi-delete"].$el.focus();
    },
  },
  data: () => ({
    base64Data: "",
    chart_options: {
      titleTextStyle: {
        color: "#FFF",
      },
      explorer: {
        zoomDelta: 0.5,
        actions: ["dragToZoom", "rightClickToReset"],
        keepInBounds: true,
      },
      chartArea: {
        left: 50,
        top: 30,
        bottom: 50,
        right: 10,
      },
      colorAxis: {
        legend: {
          position: "top",
        },
        colors: ["yellow", "red"],
      },
      hAxis: {
        title: "probabilidad",
        viewWindowMode: "maximized",
        ticks: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      vAxis: {
        title: "impacto",
        ticks: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      bubble: {
        textStyle: {
          fontSize: 15,
        },
      },
      sizeAxis: {
        maxSize: 17,
        minSize: 2,
      },
      title: ".",
    },
    matrix: false,
    sheet: false,
    search: "",
    selected: [],
    deleteElements: [],
    overlay: false,
    alertType: null,
    windowSize: {
      x: 0,
      y: 0,
    },
  }),
};
</script>

<style scoped></style>
