const state = {
  notification: {},
};

const actions = {
  setNotification({ commit }, notification) {
    notification.color = notification.color || "success";
    notification.timeout = notification.timeout || 3000;
    notification.showing = true;
    commit("SET_NOTIFICATION", notification);
  },
};

const mutations = {
  SET_NOTIFICATION(state, notification) {
    state.notification = notification;
  },
};

export default {
  state,
  actions,
  mutations,
};
