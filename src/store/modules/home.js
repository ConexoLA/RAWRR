const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  home: {},
  backup: false,
};

const getters = {
  getBackup: (state) => state.backup,
};

const actions = {
  setBackup({ commit }, value) {
    commit("backup", value);
  },
  async exportDatabase({ dispatch }, database) {
    const response = await ipcRenderer.sendSync("export", database);
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("home.export_error"),
        color: "error",
      });
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("home.export_success"),
        });
      }
    }
  },
  async importDatabase({ dispatch }, database) {
    const response = await ipcRenderer.sendSync("import", database);
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("home.import_error"),
        color: "error",
      });
    } else {
      if (response[0] === "ignore") {
        return "ignore";
      } else {
        if (!database[3]) {
          dispatch("setNotification", {
            text: i18n.t("home.import_success"),
            timeout: "2000",
          });
        }
      }
    }
  },
  async loadTestValues({ dispatch }) {
    const response = await ipcRenderer.sendSync("loadTestValues");
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("home.test_error"),
        color: "error",
      });
      return "error";
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("home.test_success"),
          timeout: "2000",
        });
      }
    }
  },
  async backupDatabase({ dispatch }) {
    const response = await ipcRenderer.sendSync("backupDatabase");
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("home.test_error"), // TODO: ADD MESSAGE OF BACKUP
        color: "error",
      });
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("home.test_success"),
          timeout: "2000",
        });
      }
    }
  },
  async deleteDatabase({ dispatch }) {
    const response = await ipcRenderer.sendSync("deleteDatabase");
    if (response[0] === "error" || response[0] === "reject") {
      dispatch("setNotification", {
        text: i18n.t("home.delete_error"),
        color: "error",
      });
    } else {
      if (response[1]) {
        dispatch("setNotification", {
          text: i18n.t("home.delete_success"),
          timeout: "2000",
        });
      }
    }
  },
};

const mutations = {
  backup: (state, value) => (state.backup = value),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
