const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  vulnerabilities: [],
  vulnerability_threat_associations: [],
};

const getters = {
  getAllVulnerabilities: (state) => state.vulnerabilities,
  getFirstVulnerability: (state) => state.vulnerabilities[0],
  getAllVulnerabilityThreatAssociations: (state) =>
    state.vulnerability_threat_associations,
  getAllMergedVulnerabilities: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    rootState.fetchAllAssessmentActivities;
    rootState.fetchAllAssets;
    rootState.fetchAllThreats;

    let _vulnerabilities = state.vulnerabilities;
    let _vulnerabilityThreatAssociations =
      state.vulnerability_threat_associations;
    let _assessmentActivities = rootState.getAllAssessmentActivities;
    let _assets = rootState.getAllAssets;
    let _threats = rootState.getAllThreats;
    let _assessmentActivityMap = {};
    let _assetMap = {};
    let _threatMap = {};
    let _associationMap = {};

    _assessmentActivities.forEach(function (assessmentActivity) {
      _assessmentActivityMap[assessmentActivity.id] = assessmentActivity.name;
    });

    _assets.forEach(function (asset) {
      _assetMap[asset.id] = asset.name;
    });

    _threats.forEach(function (threat) {
      _threatMap[threat.id] = threat.name;
    });

    _vulnerabilityThreatAssociations.forEach(function (association) {
      let value = _threatMap[association.threat_id];

      if (value) {
        if (_associationMap[association.vulnerability_id] == null) {
          _associationMap[association.vulnerability_id] = [value];
        } else {
          _associationMap[association.vulnerability_id].push(value);
        }
      }
    });

    _vulnerabilities.forEach(function (vulnerability) {
      vulnerability.assessment_activity_name =
        _assessmentActivityMap[vulnerability.assessment_activity_id];
      vulnerability.asset_name = _assetMap[vulnerability.asset_id];
      vulnerability.threat_name = _associationMap[vulnerability.id];
    });

    return _vulnerabilities;
  },
};

const actions = {
  async fetchAllVulnerabilities({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "vulnerabilities",
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
      commit("setVulnerabilities", response);
    }
  },
  async addVulnerability({ commit }, vulnerability) {
    const response = await ipcRenderer.sendSync("insert", [
      "vulnerabilities",
      vulnerability,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("vulnerabilities.insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("vulnerabilities.insert_success"),
      });
    }
    commit("newVulnerability", response);
  },
  async deleteVulnerability({ commit }, vulnerability) {
    const response = await ipcRenderer.sendSync("remove", [
      "vulnerabilities",
      vulnerability,
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
    commit("removeVulnerability", response);
  },
  async updateVulnerability({ commit }, vulnerability) {
    const response = await ipcRenderer.sendSync("update", [
      "vulnerabilities",
      vulnerability,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("vulnerabilities.edit_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("vulnerabilities.edit_success"),
      });
    }
    commit("changeVulnerability", response);
  },

  async fetchAllVulnerabilityThreatAssociations({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "vulnerability_threat_associations",
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
      commit("setVulnerabilityThreatAssociations", response);
    }
  },
  async addVulnerabilityThreatAssociation(
    { commit },
    vulnerability_threat_association
  ) {
    const response = await ipcRenderer.sendSync("insert", [
      "vulnerability_threat_associations",
      vulnerability_threat_association,
    ]);
    commit("newVulnerabilityThreatAssociation", response);
  },
  async deleteVulnerabilityThreatAssociation(
    { commit },
    vulnerability_threat_association
  ) {
    const response = await ipcRenderer.sendSync("remove", [
      "vulnerability_threat_associations",
      vulnerability_threat_association,
    ]);
    commit("removeVulnerabilityThreatAssociation", response);
  },
};

const mutations = {
  setVulnerabilities: (state, vulnerabilities) =>
    (state.vulnerabilities = vulnerabilities),
  newVulnerability: (state, vulnerability) =>
    state.vulnerabilities.push(vulnerability),
  removeVulnerability: (state, id) =>
    state.vulnerabilities.filter((vulnerability) => vulnerability.id !== id),
  changeVulnerability: (state, updVulnerability) => {
    const index = state.vulnerabilities.findIndex(
      (vulnerability) => vulnerability.id === updVulnerability.id
    );
    if (index !== -1) {
      state.vulnerabilities.splice(index, 1, updVulnerability);
    }
  },
  setVulnerabilityThreatAssociations: (
    state,
    vulnerability_threat_associations
  ) =>
    (state.vulnerability_threat_associations =
      vulnerability_threat_associations),
  newVulnerabilityThreatAssociation: (
    state,
    vulnerability_threat_association
  ) =>
    state.vulnerability_threat_associations.push(
      vulnerability_threat_association
    ),
  removeVulnerabilityThreatAssociation: (state, id) =>
    state.vulnerability_threat_associations.filter(
      (association) =>
        association.threat_id !== id[0] &&
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
