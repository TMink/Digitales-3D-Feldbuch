/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 24.09.2024 13:14:40
 * Modified By: Julian Hardtung
 * 
 * Description: Router paths to the different vue pages
 */


import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import ActivitiesOverview from "@/views/ActivitiesOverview.vue";
import ActivityForm from '../views/ActivityForm.vue';
import PlacesOverview from "@/views/PlacesOverview.vue";
import PlaceForm from "@/views/PlaceForm.vue";
import PositionsOverview from "@/views/PositionsOverview.vue";
import PositionForm from "@/views/PositionForm.vue";
import ModelViewer from "@/views/3DView.vue";
import OnlineSync from "@/views/OnlineSync.vue";
import DataExport from "@/views/DataExport.vue";
import DataBackup from "@/components/DataBackup.vue";
import LandingPage from "@/views/LandingPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegistrationPage from "@/views/RegistrationPage.vue";
import StratiTool from "@/views/StratiTool.vue";

const router = createRouter({
  history: createWebHashHistory(),
  //history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: LandingPage,
    },
    {
      path: "/activities",
      name: "ActivitiesOverview",
      component: ActivitiesOverview,
    },
    {
      path: "/activities/:activityID",
      name: "ActivityCreation",
      component: ActivityForm,
    },
    {
      path: "/positions",
      name: "PositionsOverview",
      component: PositionsOverview,
    },
    {
      path: "/positions/:positionID",
      name: "PositionCreation",
      component: PositionForm,
    },
    {
      path: "/places",
      name: "PlacesOverview",
      component: PlacesOverview,
    },
    {
      path: "/places/:placeID",
      name: "PlaceCreation",
      component: PlaceForm,
    },
    {
      path: "/3DView",
      name: "3D-Ansicht",
      component: ModelViewer,
    },
    /* {
      path: "/onlineSync",
      name: "OnlineSync",
      component: OnlineSync,
    }, */
    {
      path: "/dataExport",
      name: "DataExport",
      component: DataExport,
    },
    {
      path: "/dataBackup",
      name: "DataBackup",
      component: DataBackup,
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
    },
    {
      path: "/registration",
      name: "RegistrationPage",
      component: RegistrationPage,
    },
    {
      path: "/StratiTool",
      name: "Stratification-Tool",
      component: StratiTool
    },
  ],
});

export default router
