import Vue from 'vue'
import VueCookies from 'vue-cookies';
import Router from 'vue-router'
import Viewer from '@/components/3dView'
import ProjectsOverview from '@/components/ProjectsOverview'
import ProjectForm from '@/components/ProjectForm';
import CutForm from '@/components/CutForm';
import ExcavationsOverview from '@/components/ExcavationsOverview'
import ExcavationForm from '@/components/ExcavationForm';
import CutsOverview from '@/components/CutsOverview'
import ArtifactsOverview from '@/components/ArtifactsOverview'
import FeaturesOverview from '@/components/FeaturesOverview'
import SamplesOverview from '@/components/SamplesOverview'
import ContactForm from '@/components/DocContactForm';

Vue.use(Router);

const router =  new Router({
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
      path: '/projects/:project_id',
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
      path: '/excavations/:excavation_id',
      name: 'ExcavationCreation',
      alias: '',
      component: ExcavationForm
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
    },
    {
      path: '/contacts/:contact_id',
      name: 'ContactCreation',
      alias: '',
      component: ContactForm
    },
    {
      path: '/3dview',
      name: '3D-Ansicht',
      alias: '',
      component: Viewer
    }
  ]
});

/**
 * Set routing path history
 */
router.afterEach(to => {
  VueCookies.set('LAST_ROUTE_KEY', VueCookies.get('ROUTE_KEY'));
  VueCookies.set('ROUTE_KEY', to.path);
});

export default router;
