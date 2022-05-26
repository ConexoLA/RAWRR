import Vue from "vue";
import Router from "vue-router";
import i18n from "./i18n.js";
import Home from "./views/HomeView.vue";
import Assets from "./views/AssetsView.vue";
import Activities from "./views/ActivitiesView.vue";
import Threats from "./views/ThreatsView.vue";
import ThreatsHistory from "./views/ThreatHistoryView.vue";
import Vulnerabilities from "./views/VulnerabilitiesView.vue";
import Recommendations from "./views/RecommendationsView.vue";
import Report from "./views/reports/active reports/ReportView";

Vue.use(Router);

const router = new Router({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/assets",
      name: "assets",
      component: Assets,
    },
    {
      path: "/activities",
      name: "activities",
      component: Activities,
    },
    {
      path: "/threats",
      name: "threats",
      component: Threats,
    },
    {
      path: "/threats/history",
      name: "threatsHistory",
      component: ThreatsHistory,
    },
    {
      path: "/vulnerabilities",
      name: "vulnerabilities",
      component: Vulnerabilities,
    },
    {
      path: "/recommendations",
      name: "recommendations",
      component: Recommendations,
    },
    {
      path: "/reports",
      name: "reports",
      component: Report,
    },
  ],
});

export default router;
