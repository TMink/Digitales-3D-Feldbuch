import Vue from 'vue'
import Router from 'vue-router'
import Viewer from '@/components/3dView'
import ProjectsOverview from '@/components/ProjectsOverview'
import ProjectForm from '@/components/ProjectForm';
//import CutForm from '@/components/CutForm';
import ExcavationsOverview from '@/components/ExcavationsOverview'
import ExcavationForm from '@/components/ExcavationForm';
//import CutsOverview from '@/components/CutsOverview'
import ArtifactsOverview from '@/components/ArtifactsOverview'
import FeaturesOverview from '@/components/FeaturesOverview'
import SamplesOverview from '@/components/SamplesOverview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { path: '/projects' }
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
    /*
    {
      path: '/cutform',
      name: 'CutCreation',
      alias: '',
      component: CutForm
    },
    */
    {
      path: '/excavations',
      name: 'ExcavationsOverview',
      alias: '',
      component: ExcavationsOverview
    },
    {
      path: '/excavationform',
      name: 'ExcavationCreation',
      alias: '',
      component: ExcavationForm
    },
    /*
    {
      path: '/cutsoverview',
      name: 'CutsOverview',
      alias: '',
      component: CutsOverview
    },
    */
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
    },
    {
      path: '/3dview',
      name: '3D-Ansicht',
      alias: '',
      component: Viewer
    }
  ]
});
