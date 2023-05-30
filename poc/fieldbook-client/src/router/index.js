import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesOverview from "@/views/ActivitiesOverview.vue";
import PlacesOverview from "@/views/PlacesOverview.vue";
import PlaceForm from "@/views/PlaceForm.vue";
import PositionsOverview from "@/views/PositionsOverview.vue";
import PositionForm from "@/views/PositionForm.vue";
import Viewer from "@/views/3dview.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "ActivitiesView",
      component: ActivitiesOverview,
    },
    {
      path: "/activities/:activity_id",
      name: "ActivityCreation",
    },
    {
      path: "/positions",
      name: "PositionsOverview",
      component: PositionsOverview,
    },
    {
      path: "/positionform/:position_id",
      name: "PositionCreation",
      component: PositionForm,
    },
    {
      path: "/places",
      name: "PlacesOverview",
      component: PlacesOverview,
    },
    {
      path: "/places/:place_id",
      name: "PlaceCreation",
      component: PlaceForm,
    },
    {
      path: "/3dview",
      name: "3D-Ansicht",
      component: Viewer,
    },
  ],
});

export default router
