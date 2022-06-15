const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  main: {},
  created: false
};

const getters = {
  getMain: (state, rootState) => {
    if (state.created) {
      return state.main;
    } else {
      var last_id = 0;
      var sortedAssets = rootState.getAllAssets.sort(function(a, b) {
        return a.id - b.id;
      });
      for (var asset in sortedAssets) {
        state.main.report_assets[0].tasks.push({
          id: last_id,
          title: sortedAssets[asset].name,
          identifier: sortedAssets[asset].id,
          description: sortedAssets[asset].description,
          type: "Assets",
          type_name: i18n.t("reports.assets")
        });
        last_id += 1;
      }

      var sortedAssessmentActivities = rootState.getAllAssessmentActivities.sort(
        function(a, b) {
          return a.id - b.id;
        }
      );

      for (var activity in sortedAssessmentActivities) {
        state.main.report_activities[0].tasks.push({
          id: last_id,
          title: sortedAssessmentActivities[activity].name,
          identifier: sortedAssessmentActivities[activity].id,
          description: sortedAssessmentActivities[activity].description,
          type: "Activities",
          type_name: i18n.t("reports.activities")
        });
        last_id += 1;
      }

      var sortedThreats = rootState.getAllThreats.sort(function(a, b) {
        return a.id - b.id;
      });

      for (var threat in sortedThreats) {
        if (
          sortedThreats[threat].impact > 0 ||
          sortedThreats[threat].likelihood > 0
        ) {
          state.main.report_threats[0].tasks.push({
            id: last_id,
            title: sortedThreats[threat].name,
            identifier: sortedThreats[threat].id,
            description: sortedThreats[threat].description,
            type: "Threats",
            type_name: i18n.t("reports.threats")
          });
          last_id += 1;
        } else {
          state.main.threats[0].tasks.push({
            id: last_id,
            title: sortedThreats[threat].name,
            identifier: sortedThreats[threat].id,
            description: sortedThreats[threat].description,
            type: "Threats",
            type_name: i18n.t("reports.threats")
          });
          last_id += 1;
        }
      }

      var sortedVulnerabilities = rootState.getAllVulnerabilities.sort(function(
        a,
        b
      ) {
        return a.id - b.id;
      });

      for (var vulnerability in sortedVulnerabilities) {
        state.main.report_vulnerabilities[0].tasks.push({
          id: last_id,
          title: sortedVulnerabilities[vulnerability].name,
          identifier: sortedVulnerabilities[vulnerability].id,
          description: sortedVulnerabilities[vulnerability].description,
          type: "Vulnerabilities",
          type_name: i18n.t("reports.vulnerabilities")
        });
        last_id += 1;
      }

      var sortedRecommendations = rootState.getAllRecommendations.sort(function(
        a,
        b
      ) {
        return a.id - b.id;
      });

      for (var recommendation in sortedRecommendations) {
        state.main.report_recommendations[0].tasks.push({
          id: last_id,
          title: sortedRecommendations[recommendation].name,
          identifier: sortedRecommendations[recommendation].id,
          description: sortedRecommendations[recommendation].description,
          type: "Recommendations",
          type_name: i18n.t("reports.recommendations")
        });
        last_id += 1;
      }

      state.created = true;

      return state.main;
    }
  }
};

const actions = {
  async initializeMain({ commit }) {
    commit("mutationMain");
  },
  async pushReportAsset({ commit }, asset) {
    commit("mutationPushReportAsset", asset);
  },
  async pushReportActivity({ commit }, activity) {
    commit("mutationPushReportActivity", activity);
  },
  async pushReportThreat({ commit }, threat) {
    commit("mutationPushReportThreat", threat);
  },
  async pushReportVulnerability({ commit }, vulnerability) {
    commit("mutationPushReportVulnerability", vulnerability);
  },
  async pushReportRecommendation({ commit }, recommendation) {
    commit("mutationPushReportRecommendation", recommendation);
  },
  async spliceReportAsset({ commit }, asset, index) {
    commit("mutationSpliceReportAsset", asset, index);
  },
  async spliceReportActivity({ commit }, activity, index) {
    commit("mutationSpliceReportActivity", activity, index);
  },
  async spliceReportThreat({ commit }, threat, index) {
    commit("mutationSpliceReportThreat", threat, index);
  },
  async spliceReportVulnerability({ commit }, vulnerability, index) {
    commit("mutationSpliceReportVulnerability", vulnerability, index);
  },
  async spliceReportRecommendation({ commit }, recommendation, index) {
    commit("mutationSpliceReportRecommendation", recommendation, index);
  },
  async pushAllReportAsset({ commit }, assets) {
    commit("mutationPushAllReportAsset", assets);
  },
  async pushAllReportActivity({ commit }, activities) {
    commit("mutationPushAllReportActivity", activities);
  },
  async pushAllReportThreat({ commit }, threats) {
    commit("mutationPushAllReportThreat", threats);
  },
  async pushAllReportVulnerability({ commit }, vulnerabilities) {
    commit("mutationPushAllReportVulnerability", vulnerabilities);
  },
  async pushAllReportRecommendation({ commit }, recommendations) {
    commit("mutationPushAllReportRecommendation", recommendations);
  },
  async removeAllReportAsset({ commit }, assets) {
    commit("mutationRemoveAllReportAsset", assets);
  },
  async removeAllReportActivity({ commit }, activities) {
    commit("mutationRemoveAllReportActivity", activities);
  },
  async removeAllReportThreat({ commit }, threats) {
    commit("mutationRemoveAllReportThreat", threats);
  },
  async removeAllReportVulnerability({ commit }, vulnerabilities) {
    commit("mutationRemoveAllReportVulnerability", vulnerabilities);
  },
  async removeAllReportRecommendation({ commit }, recommendations) {
    commit("mutationRemoveAllReportRecommendation", recommendations);
  },
  async exportReport({ dispatch }, report) {
    const response = await ipcRenderer.sendSync("export", report);
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("reports.export_error"),
        color: "error"
      });
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("reports.export_success")
        });
      }
    }
  }
};

const mutations = {
  mutationMain: state => {
    state.created = false;
    state.main = {
      report_assets: [
        {
          title: i18n.t("reports.report_assets"),
          showClass: "reportAssets",
          tasks: []
        }
      ],
      report_activities: [
        {
          title: i18n.t("reports.report_activities"),
          showClass: "reportActivities",
          tasks: []
        }
      ],
      report_recommendations: [
        {
          title: i18n.t("reports.report_recommendations"),
          showClass: "reportRecommendations",
          tasks: []
        }
      ],
      report_vulnerabilities: [
        {
          title: i18n.t("reports.report_vulnerabilities"),
          showClass: "reportVulnerabilities",
          tasks: []
        }
      ],
      report_threats: [
        {
          title: i18n.t("reports.report_threats"),
          showClass: "reportThreats",
          tasks: []
        }
      ],
      assets: [
        {
          title: i18n.t("reports.assets"),
          showClass: "Assets",
          tasks: []
        }
      ],
      activities: [
        {
          title: i18n.t("reports.activities"),
          showClass: "Activities",
          tasks: []
        }
      ],
      recommendations: [
        {
          title: i18n.t("reports.recommendations"),
          showClass: "Recommendations",
          tasks: []
        }
      ],
      vulnerabilities: [
        {
          title: i18n.t("reports.vulnerabilities"),
          showClass: "Vulnerabilities",
          tasks: []
        }
      ],
      threats: [
        {
          title: i18n.t("reports.threats"),
          showClass: "Threats",
          tasks: []
        }
      ]
    };
  },
  mutationPushReportAsset: (state, asset) => {
    if (!state.main.report_assets[0].tasks.some(e => e.id === asset.id)) {
      state.main.report_assets[0].tasks.push(asset);
      state.main.assets[0].tasks = state.main.assets[0].tasks.filter(
        e => e.id !== asset.id
      );
    }
  },
  mutationPushReportActivity: (state, activity) => {
    if (
      !state.main.report_activities[0].tasks.some(e => e.id === activity.id)
    ) {
      state.main.report_activities[0].tasks.push(activity);
      state.main.activities[0].tasks = state.main.activities[0].tasks.filter(
        e => e.id !== activity.id
      );
    }
  },
  mutationPushReportThreat: (state, threat) => {
    if (!state.main.report_threats[0].tasks.some(e => e.id === threat.id)) {
      state.main.report_threats[0].tasks.push(threat);
      state.main.threats[0].tasks = state.main.threats[0].tasks.filter(
        e => e.id !== threat.id
      );
    }
  },
  mutationPushReportVulnerability: (state, vulnerability) => {
    if (
      !state.main.report_vulnerabilities[0].tasks.some(
        e => e.id === vulnerability.id
      )
    ) {
      state.main.report_vulnerabilities[0].tasks.push(vulnerability);
      state.main.vulnerabilities[0].tasks = state.main.vulnerabilities[0].tasks.filter(
        e => e.id !== vulnerability.id
      );
    }
  },
  mutationPushReportRecommendation: (state, recommendation) => {
    if (
      !state.main.report_recommendations[0].tasks.some(
        e => e.id === recommendation.id
      )
    ) {
      state.main.report_recommendations[0].tasks.push(recommendation);
      state.main.recommendations[0].tasks = state.main.recommendations[0].tasks.filter(
        e => e.id !== recommendation.id
      );
    }
  },
  mutationPushAllReportAsset: (state, assets) => {
    state.main.report_assets[0].tasks = state.main.report_assets[0].tasks.concat(
      assets
    );
    state.main.assets[0].tasks = [];
  },
  mutationPushAllReportActivity: (state, activities) => {
    state.main.report_activities[0].tasks = state.main.report_activities[0].tasks.concat(
      activities
    );
    state.main.activities[0].tasks = [];
  },
  mutationPushAllReportThreat: (state, threats) => {
    state.main.report_threats[0].tasks = state.main.report_threats[0].tasks.concat(
      threats
    );
    state.main.threats[0].tasks = [];
  },
  mutationPushAllReportVulnerability: (state, vulnerabilities) => {
    state.main.report_vulnerabilities[0].tasks = state.main.report_vulnerabilities[0].tasks.concat(
      vulnerabilities
    );
    state.main.vulnerabilities[0].tasks = [];
  },
  mutationPushAllReportRecommendation: (state, recommendations) => {
    state.main.report_recommendations[0].tasks = state.main.report_recommendations[0].tasks.concat(
      recommendations
    );
    state.main.recommendations[0].tasks = [];
  },
  mutationSpliceReportAsset: (state, index) => {
    let removed = state.main.report_assets[0].tasks.splice(index, 1);
    state.main.assets[0].tasks.push(removed[0]);
  },
  mutationSpliceReportActivity: (state, index) => {
    let removed = state.main.report_activities[0].tasks.splice(index, 1);
    state.main.activities[0].tasks.push(removed[0]);
  },
  mutationSpliceReportThreat: (state, index) => {
    let removed = state.main.report_threats[0].tasks.splice(index, 1);
    state.main.threats[0].tasks.push(removed[0]);
  },
  mutationSpliceReportVulnerability: (state, index) => {
    let removed = state.main.report_vulnerabilities[0].tasks.splice(index, 1);
    state.main.vulnerabilities[0].tasks.push(removed[0]);
  },
  mutationSpliceReportRecommendation: (state, index) => {
    let removed = state.main.report_recommendations[0].tasks.splice(index, 1);
    state.main.recommendations[0].tasks.push(removed[0]);
  },
  mutationRemoveAllReportAsset: (state, assets) => {
    state.main.assets[0].tasks = state.main.assets[0].tasks.concat(assets);
    state.main.report_assets[0].tasks = [];
  },
  mutationRemoveAllReportActivity: (state, activities) => {
    state.main.activities[0].tasks = state.main.activities[0].tasks.concat(
      activities
    );
    state.main.report_activities[0].tasks = [];
  },
  mutationRemoveAllReportThreat: (state, threats) => {
    state.main.threats[0].tasks = state.main.threats[0].tasks.concat(threats);
    state.main.report_threats[0].tasks = [];
  },
  mutationRemoveAllReportVulnerability: (state, vulnerabilities) => {
    state.main.vulnerabilities[0].tasks = state.main.vulnerabilities[0].tasks.concat(
      vulnerabilities
    );
    state.main.report_vulnerabilities[0].tasks = [];
  },
  mutationRemoveAllReportRecommendation: (state, recommendations) => {
    state.main.recommendations[0].tasks = state.main.recommendations[0].tasks.concat(
      recommendations
    );
    state.main.report_recommendations[0].tasks = [];
  },
  backup: (rootState, value) => (rootState.backup = value)
};

export default {
  state,
  getters,
  actions,
  mutations
};
