import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Viewer from '@/components/3dView'
import ProjectsOverview from '@/components/ProjectsOverview'
import ProjectForm from "@/components/ProjectForm";
import CutForm from "@/components/CutForm";
import ExcavationsOverview from '@/components/ExcavationsOverview'
import CutsOverview from '@/components/CutsOverview'
import ArtifactsOverview from '@/components/ArtifactsOverview'
import FeaturesOverview from '@/components/FeaturesOverview'
import SamplesOverview from '@/components/SamplesOverview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      alias: '',
      component: Home
    },
    {
      path: '/3dview',
      name: '3D-Ansicht',
      alias: '',
      component: Viewer
    },
    {
      path: '/projects',
      name: 'ProjectsOverview',
      alias: '',
      component: ProjectsOverview
    },
    {
      path: '/projectform',
      name: 'ProjectCreation',
      alias: '',
      component: ProjectForm
    },
    {
      path: '/cutform',
      name: 'CutCreation',
      alias: '',
      component: CutForm
    },
    {
      path: '/excavations',
      name: 'ExcavationsOverview',
      alias: '',
      component: ExcavationsOverview
    },
    {
      path: '/cutsoverview',
      name: 'CutsOverview',
      alias: '',
      component: CutsOverview
    },
    {
      path: '/featuresoverview',
      name: 'FeaturesOverview',
      alias: '',
      component: FeaturesOverview
    },
    {
      path: '/artifactsoverview',
      name: 'ArtifactsOverview',
      alias: '',
      component: ArtifactsOverview
    },
    {
      path: '/samplesoverview',
      name: 'SamplesOverview',
      alias: '',
      component: SamplesOverview
    }
  ]
});
