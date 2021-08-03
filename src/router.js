import Vue from "vue";
import Router from "vue-router";
import i18n from "./i18n.js";
import Home from "./views/HomeView.vue";
import Assets from "./views/AssetsView.vue";
import Activities from "./views/ActivitiesView.vue";
import Threats from "./views/ThreatsView.vue";
import Vulnerabilities from "./views/VulnerabilitiesView.vue";
import Recommendations from "./views/RecommendationsView.vue";
import Sections from "./views/reports/sections/AssessmentReportSectionsView.vue";
import Report from "./views/reports/active reports/ReportView";
//import ActiveReport from "./views/ActiveReport.vue";

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
      path: "/sections",
      name: "sections",
      component: Sections,
    },
    {
      path: "/reports",
      name: "reports",
      component: Report,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (from.name == "reports") {
    if (window.confirm(i18n.t("report_confirm_leave"))) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

export default router;
