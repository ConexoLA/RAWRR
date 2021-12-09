const { ipcRenderer } = window.require("electron");
import i18n from "../../i18n.js";

const state = {
  assets: [],
  assetCategories: [],
};

const getters = {
  getAllAssets: (state) => state.assets,
  getAllAssetCategories: (state) => {
    let _assetCategories = state.assetCategories;
    let tempObj;
    switch (i18n.locale) {
      case "es":
        _assetCategories.forEach((element) => {
          tempObj = JSON.parse(element.name);
          element.name_translation = tempObj.es;
        });
        break;
      default:
        _assetCategories.forEach((element) => {
          tempObj = JSON.parse(element.name);
          element.name_translation = tempObj.en;
        });
        break;
    }
    return _assetCategories;
  },
  getAllMergedAssets: (state, rootState) => {
    //This performs a join operation, this should be removed and replaced with proper db queries in the future.
    let _assets = state.assets;
    let _assetCategories = rootState.getAllAssetCategories;
    let _assetCategoryMap = {};

    _assetCategories.forEach(function (assetCategory) {
      _assetCategoryMap[assetCategory.id] = assetCategory.name_translation;
    });

    _assets.forEach(function (asset) {
      asset.asset_category_name = _assetCategoryMap[asset.asset_category_id];
    });

    return _assets;
  },
};

const actions = {
  async fetchAllAssets({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", ["assets"]);
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
      commit("setAssets", response);
    }
  },
  async addAsset({ commit }, asset) {
    const response = await ipcRenderer.sendSync("insert", ["assets", asset]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("assets.insert_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("assets.insert_success"),
      });
    }
    commit("newAsset", response);
  },
  async deleteAsset({ commit }, asset) {
    const response = await ipcRenderer.sendSync("remove", ["assets", asset]);
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
    commit("removeAsset", response);
  },
  async updateAsset({ commit }, asset) {
    const response = await ipcRenderer.sendSync("update", ["assets", asset]);
    if (response.length == 0) {
      this.dispatch("setNotification", {
        text: i18n.t("assets.edit_error"),
        color: "error",
      });
    } else {
      this.dispatch("setNotification", {
        text: i18n.t("assets.edit_success"),
      });
    }
    commit("changeAsset", response);
  },
  async fetchAllAssetCategories({ commit }) {
    const response = await ipcRenderer.sendSync("queryAll", [
      "asset_categories",
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
      commit("setAssetCategories", response);
    }
  },
  async addAssetCategory({ commit }, asset_category) {
    const response = await ipcRenderer.sendSync("insert", [
      "asset_categories",
      asset_category,
    ]);
    commit("newAssetCategory", response);
  },
  async deleteAssetCategory({ commit }, asset_category) {
    const response = await ipcRenderer.sendSync("remove", [
      "asset_categories",
      asset_category,
    ]);
    commit("removeAssetCategory", response);
  },
  async updateAssetCategory({ commit }, asset_category) {
    const response = await ipcRenderer.sendSync("update", [
      "asset_categories",
      asset_category,
    ]);
    commit("changeAssetCategory", response);
  },
};

const mutations = {
  setAssets: (state, assets) => (state.assets = assets),
  newAsset: (state, asset) => state.assets.push(asset),
  removeAsset: (state, id) => state.assets.filter((asset) => asset.id !== id),
  changeAsset: (state, updAsset) => {
    const index = state.assets.findIndex((asset) => asset.id === updAsset.id);
    if (index !== -1) {
      state.assets.splice(index, 1, updAsset);
    }
  },
  setAssetCategories: (state, asset_categories) =>
    (state.assetCategories = asset_categories),
  newAssetCategory: (state, asset_category) =>
    state.assetCategories.push(asset_category),
  removeAssetCategory: (state, id) =>
    state.assetCategories.filter((asset_category) => asset_category.id !== id),
  changeAssetCategory: (state, updAssetCategory) => {
    const index = state.assetCategories.findIndex(
      (asset_category) => asset_category.id === updAssetCategory.id
    );
    if (index !== -1) {
      state.assetCategories.splice(index, 1, updAssetCategory);
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
