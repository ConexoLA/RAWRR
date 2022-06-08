const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  recommendations: [],
  recommendation_vulnerability_associations: [],
};

const getters = {
  getAllRecommendations: (state) => state.recommendations,
  getFirstRecommendation: (state) => state.recommendations[0],
  getAllRecommendationVulnerabilityAssociations: (state) =>
    state.recommendation_vulnerability_associations,
  getAllMergedRecommendations: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    rootState.fetchAllVulnerabilities;

    let _recommendations = state.recommendations;
    let _recommendationVulnerabilityAssociations =
      state.recommendation_vulnerability_associations;
    let _vulnerabilities = rootState.getAllVulnerabilities;
    let _vulnerabilityMap = {};
    let _associationMap = {};

    _vulnerabilities.forEach(function (vulnerability) {
      _vulnerabilityMap[vulnerability.id] = vulnerability.name;
    });

    _recommendationVulnerabilityAssociations.forEach(function (association) {
      let value = _vulnerabilityMap[association.vulnerability_id];
      if (value) {
        if (_associationMap[association.recommendation_id] == null) {
          _associationMap[association.recommendation_id] = [value];
        } else {
          _associationMap[association.recommendation_id].push(value);
        }
      }
    });

    _recommendations.forEach(function (recommendation) {
      recommendation.vulnerability_name = _associationMap[recommendation.id];
    });

    return _recommendations;
  },
};

const actions = {
  async fetchAllRecommendations({ commit }) {
    const response = await ipcRenderer.sendSync("queryAllById", [
      "recommendations",
    ]);
    if (Number.isFinite(response)) {
      switch (response) {
        //Table does not exist
        case 1:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_1"),
            color: "error",
          });
          commit("backup", true);
          break;
        //File is not a DB
        case 26:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_26"),
            color: "error",
          });
          commit("backup", true);
          break;
        //Unkown error
        default:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_unkown"),
            color: "error",
          });
          commit("backup", true);
          break;
      }
    } else {
      commit("setRecommendations", response);
    }
  },
  async addRecommendation({ commit }, recommendation) {
    const response = await ipcRenderer.sendSync("insert", [
      "recommendations",
      recommendation,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("recommendations.insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("recommendations.insert_success"),
      });
    }
    commit("newRecommendation", response);
  },
  async deleteRecommendation({ commit }, recommendation) {
    const response = await ipcRenderer.sendSync("remove", [
      "recommendations",
      recommendation,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("global.delete_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("global.delete_success"),
      });
    }
    commit("removeRecommendation", response);
  },
  async updateRecommendation({ commit }, recommendation) {
    const response = await ipcRenderer.sendSync("update", [
      "recommendations",
      recommendation,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("recommendations.edit_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("recommendations.edit_success"),
      });
    }
    commit("changeRecommendation", response);
  },
  async fetchAllRecommendationVulnerabilityAssociations({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "recommendation_vulnerability_associations",
    ]);
    if (Number.isFinite(response)) {
      switch (response) {
        //Table does not exist
        case 1:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_1"),
            color: "error",
          });
          commit("backup", true);
          break;
        //File is not a DB
        case 26:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_26"),
            color: "error",
          });
          commit("backup", true);
          break;
        //Unkown error
        default:
          this.dispatch("setNotification", {
            text: i18n.t("home.import_error_unkown"),
            color: "error",
          });
          commit("backup", true);
          break;
      }
    } else {
      commit("setRecommendationVulnerabilityAssociations", response);
    }
  },
  async addRecommendationVulnerabilityAssociation(
    { commit },
    recommendation_vulnerability_association
  ) {
    const response = await ipcRenderer.sendSync("insert", [
      "recommendation_vulnerability_associations",
      recommendation_vulnerability_association,
    ]);
    commit("newRecommendationVulnerabilityAssociation", response);
  },
  async deleteRecommendationVulnerabilityAssociation(
    { commit },
    recommendation_vulnerability_association
  ) {
    const response = await ipcRenderer.sendSync("remove", [
      "recommendation_vulnerability_associations",
      recommendation_vulnerability_association,
    ]);
    commit("removeRecommendationVulnerabilityAssociation", response);
  },
};

const mutations = {
  setRecommendations: (state, recommendations) =>
    (state.recommendations = recommendations),
  newRecommendation: (state, recommendation) =>
    state.recommendations.push(recommendation),
  removeRecommendation: (state, id) =>
    state.recommendations.filter((recommendation) => recommendation.id !== id),
  changeRecommendation: (state, updRecommendation) => {
    const index = state.recommendations.findIndex(
      (recommendation) => recommendation.id === updRecommendation.id
    );
    if (index !== -1) {
      state.recommendations.splice(index, 1, updRecommendation);
    }
  },
  setRecommendationVulnerabilityAssociations: (
    state,
    recommendation_vulnerability_associations
  ) =>
    (state.recommendation_vulnerability_associations =
      recommendation_vulnerability_associations),
  newRecommendationVulnerabilityAssociation: (
    state,
    recommendation_vulnerability_association
  ) =>
    state.recommendation_vulnerability_associations.push(
      recommendation_vulnerability_association
    ),
  removeRecommendationVulnerabilityAssociation: (state, id) =>
    state.recommendation_vulnerability_associations.filter(
      (association) =>
        association.recommendation_id !== id[0] &&
        association.vulnerability_id !== id[1]
    ),
  backup: (rootState, value) => (rootState.backup = value),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
