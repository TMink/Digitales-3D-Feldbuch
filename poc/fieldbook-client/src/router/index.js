import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesOverview from "@/views/ActivitiesOverview.vue";
import PlacesOverview from "@/views/PlacesOverview.vue";
import PlaceForm from "@/views/PlaceForm.vue";
import PositionsOverview from "@/views/PositionsOverview.vue";
import PositionForm from "@/views/PositionForm.vue";
import Viewer from "@/views/3DView.vue";
import OnlineSync from "@/views/OnlineSync.vue";
import DataExport from "@/views/DataExport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "ActivitiesOverview",
      component: ActivitiesOverview,
    },
    {
      path: "/activities/:activityID",
      name: "ActivityCreation",
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
      component: Viewer,
    },
    {
      path: "/onlineSync",
      name: "OnlineSync",
      component: OnlineSync,
    },
    {
      path: "/dataExport",
      name: "DataExport",
      component: DataExport,
    },
  ],
});

export default router
