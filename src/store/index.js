import Vue from "vue";
import Vuex from "vuex";
import assets from "./modules/assets";
import assessment_activities from "./modules/assessment_activities";
import threats from "./modules/threats";
import vulnerabilities from "./modules/vulnerabilities";
import recommendations from "./modules/recommendations";
import assessment_reports from "./modules/assessment_reports";
import notification from "./modules/notification";
import home from "./modules/home";
import config from "./modules/config";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    assets,
    assessment_activities,
    threats,
    vulnerabilities,
    recommendations,
    assessment_reports,
    notification,
    home,
    config,
  },
});
