const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  assessment_activities: [],
  assessment_activity_asset_associations: [],
};

const getters = {
  getAllAssessmentActivities: (state) => state.assessment_activities,
  getFirstAssessmentActivity: (state) => state.assessment_activities[0],
  getAllAssessmentActivityAssetAssociations: (state) =>
    state.assessment_activity_asset_associations,
  getAllMergedAssessmentActivities: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    rootState.fetchAllAssets;

    let _assessmentActivities = state.assessment_activities;
    let _assessmentActivityAssetAssociation =
      state.assessment_activity_asset_associations;
    let _assets = rootState.getAllAssets;
    let _assetMap = {};
    let _assessmentActivityMap = {};

    _assets.forEach(function (asset) {
      _assetMap[asset.id] = asset.name;
    });

    _assessmentActivityAssetAssociation.forEach(function (association) {
      let value = _assetMap[association.asset_id];
      if (value) {
        if (
          _assessmentActivityMap[association.assessment_activity_id] == null
        ) {
          _assessmentActivityMap[association.assessment_activity_id] = [value];
        } else {
          _assessmentActivityMap[association.assessment_activity_id].push(
            value
          );
        }
      }
    });

    _assessmentActivities.forEach(function (activity) {
      activity.asset_name = _assessmentActivityMap[activity.id];
    });

    return _assessmentActivities;
  },
};

const actions = {
  async fetchAllAssessmentActivities({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "assessment_activities",
    ]);
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
      commit("setAssessmentActivities", response);
    }
  },
  async addAssessmentActivity({ commit }, assessment_activity) {
    const response = await ipcRenderer.sendSync("insert", [
      "assessment_activities",
      assessment_activity,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("assessment_activity_insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("assessment_activity_insert_success"),
      });
    }
    commit("newAssessmentActivity", response);
  },
  async deleteAssessmentActivity({ commit }, assessment_activity) {
    const response = await ipcRenderer.sendSync("remove", [
      "assessment_activities",
      assessment_activity,
    ]);
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
    commit("removeAssessmentActivity", response);
  },
  async updateAssessmentActivity({ commit }, assessment_activity) {
    const response = await ipcRenderer.sendSync("update", [
      "assessment_activities",
      assessment_activity,
    ]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("assessment_activity_edit_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("assessment_activity_edit_success"),
      });
    }
    commit("changeAssessmentActivity", response);
  },
  async fetchAllAssessmentActivityAssetAssociations({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "assessment_activity_asset_associations",
    ]);
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
      commit("setAssessmentActivityAssetAssociations", response);
    }
  },
  async addAssessmentActivityAssetAssociation(
    { commit },
    assessment_activity_asset_association
  ) {
    const response = await ipcRenderer.sendSync("insert", [
      "assessment_activity_asset_associations",
      assessment_activity_asset_association,
    ]);
    commit("newAssessmentActivityAssetAssociation", response);
  },
  async deleteAssessmentActivityAssetAssociation(
    { commit },
    assessment_activity_asset_association
  ) {
    const response = await ipcRenderer.sendSync("remove", [
      "assessment_activity_asset_associations",
      assessment_activity_asset_association,
    ]);
    commit("removeAssessmentActivityAssetAssociation", response);
  },
};

const mutations = {
  setAssessmentActivities: (state, assessment_activities) =>
    (state.assessment_activities = assessment_activities),
  newAssessmentActivity: (state, assessment_activity) =>
    state.assessment_activities.push(assessment_activity),
  removeAssessmentActivity: (state, id) =>
    state.assessment_activities.filter(
      (assessment_activity) => assessment_activity.id !== id
    ),
  changeAssessmentActivity: (state, updAssessmentActivity) => {
    const index = state.assessment_activities.findIndex(
      (AssessmentActivity) => AssessmentActivity.id === updAssessmentActivity.id
    );
    if (index !== -1) {
      state.assessment_activities.splice(index, 1, updAssessmentActivity);
    }
  },
  setAssessmentActivityAssetAssociations: (
    state,
    assessment_activity_asset_associations
  ) =>
    (state.assessment_activity_asset_associations =
      assessment_activity_asset_associations),
  newAssessmentActivityAssetAssociation: (
    state,
    assessment_activity_asset_association
  ) =>
    state.assessment_activity_asset_associations.push(
      assessment_activity_asset_association
    ),
  removeAssessmentActivityAssetAssociation: (state, id) =>
    state.assessment_activity_asset_associations.filter(
      (association) =>
        association.assessment_activity_id !== id[0] &&
        association.asset_id !== id[1]
    ),
  backup: (rootState, value) => (rootState.backup = value),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
