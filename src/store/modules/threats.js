const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  threat_types: [],
  threats: [],
};

const getters = {
  getAllThreatTypes: (state) => state.threat_types,
  getAllThreats: (state) => state.threats,
  getAllMergedThreats: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    rootState.fetchAllAssets;
    let _threats = state.threats;
    let _threatTypes = state.threat_types;
    let _assets = rootState.getAllAssets;
    let _assetMap = {};
    let _threatTypeMap = {};

    _threatTypes.forEach(function (threatType) {
      _threatTypeMap[threatType.id] = threatType.name;
    });

    _assets.forEach(function (asset) {
      _assetMap[asset.id] = asset.name;
    });

    _threats.forEach(function (threat) {
      threat.threat_type_name = _threatTypeMap[threat.threat_type_id];
      threat.asset_name = _assetMap[threat.asset_id];
    });

    return _threats;
  },
};

const actions = {
  async fetchAllThreatTypes({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", ["threat_types"]);
    if (Number.isFinite(response)) {
      switch (response) {
        //Table does not exist
        case 1:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_1"),
            color: "error",
          });
          commit("backup", true);
          break;
        //File is not a DB
        case 26:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_26"),
            color: "error",
          });
          commit("backup", true);
          break;
        //Unkown error
        default:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_unkown"),
            color: "error",
          });
          commit("backup", true);
          break;
      }
    } else {
      commit("setThreatTypes", response);
    }
  },
  async addThreatType({ commit }, threat_type) {
    const response = await ipcRenderer.sendSync("insert", [
      "threat_types",
      threat_type,
    ]);
    commit("newThreatType", response);
  },
  async deleteThreatType({ commit }, threat_type) {
    const response = await ipcRenderer.sendSync("remove", [
      "threat_types",
      threat_type,
    ]);
    commit("removeThreatType", response);
  },
  async updateThreatType({ commit }, threat_type) {
    const response = await ipcRenderer.sendSync("update", [
      "threat_types",
      threat_type,
    ]);
    commit("changeThreatType", response);
  },
  async fetchAllThreats({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", ["threats"]);
    if (Number.isFinite(response)) {
      switch (response) {
        //Table does not exist
        case 1:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_1"),
            color: "error",
          });
          commit("backup", true);
          break;
        //File is not a DB
        case 26:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_26"),
            color: "error",
          });
          commit("backup", true);
          break;
        //Unkown error
        default:
          this.dispatch("setNotification", {
            text: i18n.t("database_import_error_unkown"),
            color: "error",
          });
          commit("backup", true);
          break;
      }
    } else {
      commit("setThreats", response);
    }
  },
  async addThreat({ commit }, threat) {
    const response = await ipcRenderer.sendSync("insert", ["threats", threat]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("threat_insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("threat_insert_success"),
      });
    }
    commit("newThreat", response);
  },
  async deleteThreat({ commit }, threat) {
    const response = await ipcRenderer.sendSync("remove", ["threats", threat]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("generic_delete_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("generic_delete_success"),
      });
    }
    commit("removeThreat", response);
  },
  async updateThreat({ commit }, threat) {
    const response = await ipcRenderer.sendSync("update", ["threats", threat]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("threat_edit_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("threat_edit_success"),
      });
    }
    commit("changeThreat", response);
  },
};

const mutations = {
  setThreatTypes: (state, threat_types) => (state.threat_types = threat_types),
  newThreatType: (state, threat_type) => state.threat_types.push(threat_type),
  removeThreatType: (state, id) =>
    state.threat_types.filter((threat_type) => threat_type.id !== id),
  changeThreatType: (state, updThreatType) => {
    const index = state.threat_types.findIndex(
      (threat_type) => threat_type.id === updThreatType.id
    );
    if (index !== -1) {
      state.threat_types.splice(index, 1, updThreatType);
    }
  },
  setThreats: (state, threats) => (state.threats = threats),
  newThreat: (state, threat) => state.threats.push(threat),
  removeThreat: (state, id) =>
    state.threats.filter((threat) => threat.id !== id),
  changeThreat: (state, updThreat) => {
    const index = state.threats.findIndex(
      (threat) => threat.id === updThreat.id
    );
    if (index !== -1) {
      state.threats.splice(index, 1, updThreat);
    }
  },
  backup: (rootState, value) => (rootState.backup = value),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
