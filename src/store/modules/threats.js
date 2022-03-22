const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  threat_types: [],
  threats: [],
  active_threat_history: null,
  audits: null,
};

const getters = {
  getAllThreatTypes: (state) => {
    let _threat_types = state.threat_types;
    let tempObj;
    switch (i18n.locale) {
      case "es":
        _threat_types.forEach((element) => {
          tempObj = JSON.parse(element.name);
          element.name_translation = tempObj.es;
        });
        break;
      case "pt-br":
        _threat_types.forEach((element) => {
          tempObj = JSON.parse(element.name);
          element.name_translation = tempObj["pt-br"];
        });
        break;
      //Add language case here
      default:
        _threat_types.forEach((element) => {
          tempObj = JSON.parse(element.name);
          element.name_translation = tempObj.en;
        });
        break;
    }
    return _threat_types;
  },
  getAllThreats: (state) => state.threats,
  getAllMergedThreats: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    rootState.fetchAllAssets;
    let _threats = state.threats;
    let _threatTypes = rootState.getAllThreatTypes;
    let _assets = rootState.getAllAssets;
    let _assetMap = {};
    let _threatTypeMap = {};

    _threatTypes.forEach(function (threatType) {
      _threatTypeMap[threatType.id] = threatType.name_translation;
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
  getActiveThreatHistory: (state) => state.active_threat_history,
  getActiveThreatAudits: (state) => state.audits,
};

const actions = {
  async fetchAllThreatTypes({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", ["threat_types"]);
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
      commit("setThreats", response);
    }
  },
  async addThreat({ commit }, threat) {
    const response = await ipcRenderer.sendSync("insert", ["threats", threat]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("threats.insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("threats.insert_success"),
      });
    }
    commit("newThreat", response);
  },
  async deleteThreat({ commit }, threat) {
    const response = await ipcRenderer.sendSync("remove", ["threats", threat]);
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
    commit("removeThreat", response);
  },
  async updateThreat({ commit }, threat) {
    const threat_response = await ipcRenderer.sendSync("getOne", [
      "threats",
      threat,
    ]);
    const asset_response = await ipcRenderer.sendSync("getOne", [
      "assets",
      threat,
    ]);
    const response = await ipcRenderer.sendSync("update", ["threats", threat]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("threats.edit_error"),
        color: "error",
      });
    } else {
      var audit_threat_json = {};

      if (threat_response.name != threat.name) {
        audit_threat_json["name"] = {
          old_data: threat_response.name,
          new_data: threat.name,
        };
      }
      if (threat_response.description != threat.description) {
        audit_threat_json["description"] = {
          old_data: threat_response.description,
          new_data: threat.description,
        };
      }
      if (threat_response.impact != threat.impact) {
        audit_threat_json["impact"] = {
          old_data: threat_response.impact,
          new_data: threat.impact,
        };
      }
      if (threat_response.likelihood != threat.likelihood) {
        audit_threat_json["likelihood"] = {
          old_data: threat_response.likelihood,
          new_data: threat.likelihood,
        };
      }

      if (threat_response.threat_type_id != threat.threat_type_id) {
        audit_threat_json["threat_type_name"] = {
          old_data: threat_response.threat_type_id,
          new_data: threat.threat_type_id,
        };
      }
      if (threat_response.asset_id != threat.asset_id) {
        if (!asset_response) {
          audit_threat_json["asset_name"] = {
            old_data: threat.asset_name,
            new_data: null,
          };
        } else {
          audit_threat_json["asset_name"] = {
            old_data: threat.asset_name,
            new_data: asset_response.name,
          };
        }
      }
      var threat_audit = {
        threat_id: threat.id,
        changed_fields: JSON.stringify(audit_threat_json),
      };
      const threat_audit_response = await ipcRenderer.sendSync("insert", [
        "threats_audits",
        threat_audit,
      ]);

      this.dispatch("setNotification", {
        text: i18n.t("threats.edit_success"),
      });
    }
    commit("changeThreat", response);
  },
  async changeActiveThreatHistory({ commit }, threat) {
    const audits_response = await ipcRenderer.sendSync("allAudits", [
      "threats_audits",
      threat,
    ]);
    var audits_array = [];
    for (var i = 0; i < audits_response.length; i++) {
      var jsonData = {};
      var iter_json = JSON.parse(audits_response[i]["changed_fields"]);
      var iter_json_keys = Object.keys(iter_json);

      for (var j = 0; j < iter_json_keys.length; j++) {
        jsonData[iter_json_keys[j] + "_old"] =
          iter_json[iter_json_keys[j]]["old_data"];
        jsonData[iter_json_keys[j] + "_new"] =
          iter_json[iter_json_keys[j]]["new_data"];
      }
      jsonData["created"] = audits_response[i]["created"];
      audits_array.push(jsonData);
    }
    commit("setActiveThreatHistory", threat);
    commit("setActiveThreatAudits", audits_array);
  },
  async exportImage({ dispatch }, imageBase64) {
    const response = await ipcRenderer.sendSync("export", imageBase64);
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("threats.risk_matrix.export_error"),
        color: "error",
      });
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("threats.risk_matrix.export_success"),
        });
      }
    }
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
  setActiveThreatHistory: (state, active_threat_history) =>
    (state.active_threat_history = active_threat_history),
  setActiveThreatAudits: (state, audits) => (state.audits = audits),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
