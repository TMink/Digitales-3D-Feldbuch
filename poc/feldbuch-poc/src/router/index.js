import Vue from 'vue'
import VueCookies from 'vue-cookies';
import Router from 'vue-router'
import Viewer from '@/components/3dView'
import ProjectsOverview from '@/components/ProjectsOverview'
import ProjectForm from '@/components/ProjectForm';
import ExcavationsOverview from '@/components/ExcavationsOverview'
import ExcavationForm from '@/components/ExcavationForm';
import SectionsOverview from '@/components/SectionsOverview'
import SectionForm from '@/components/SectionForm';
import ArtifactsOverview from '@/components/ArtifactsOverview'
import ArtifactForm from '@/components/ArtifactForm'
import FeaturesOverview from '@/components/FeaturesOverview'
import FeatureForm from '@/components/FeatureForm'
import SamplesOverview from '@/components/SamplesOverview'
import SamplesForm from '@/components/SamplesForm'
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
      path: '/sections/:section_id',
      name: 'SectionCreation',
      alias: '',
      component: SectionForm
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
      path: '/sections',
      name: 'SectionsOverview',
      alias: '',
      component: SectionsOverview
    },
    {
      path: '/artifactsoverview',
      name: 'ArtifactsOverview',
      alias: '',
      component: ArtifactsOverview
    },
    {
      path: '/artifactform',
      name: 'ArtifactCreation',
      alias: '',
      component: ArtifactForm
    },
    {
      path: '/samplesoverview',
      name: 'SamplesOverview',
      alias: '',
      component: SamplesOverview
    },
    {
      path: '/samples/:sample_id',
      name: 'SampleCreation',
      alias: '',
      component: SamplesForm
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
    },
    {
      path: '/featuresoverview',
      name: 'FeaturesOverview',
      alias: '',
      component: FeaturesOverview
    },
    {
      path: '/featureform',
      name: 'FeatureCreation',
      alias: '',
      component: FeatureForm
    },
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
