const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  config: [],
};

const getters = {
  getAllConfig: (state) => state.config,
};

const actions = {
  async fetchAllConfig({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", ["config"]);
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
      commit("setConfig", response[0].data);
    }
  },
  async updateConfig({ commit }, config) {
    const response = await ipcRenderer.sendSync("update", [
      "config",
      [config, "1"],
    ]);
    commit("setConfig", response);
  },
};

const mutations = {
  setConfig: (state, config) => (state.config = config),
  backup: (rootState, value) => (rootState.backup = value),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
