import Vue from 'vue'
import VueCookies from 'vue-cookies';
import Router from 'vue-router'
import Viewer from '@/components/3dView'
import ActivitiesOverview from '@/components/ActivitiesOverview'
import PlacesOverview from '@/components/PlacesOverview'
import PlaceForm from '@/components/PlaceForm';
import PositionsOverview from '@/components/PositionsOverview'
import PositionForm from '@/components/PositionForm';
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
      redirect: { path: '/activities' }
    },
    {
      path: '/activities',
      name: 'ActivitiesOverview',
      alias: '',
      component: ActivitiesOverview
    },
    {
      path: '/activities/:activity_id',
      name: 'ActivityCreation',
      alias: ''
    },
    {
      path: '/positionform/:position_id',
      name: 'PositionCreation',
      alias: '',
      component: PositionForm
    },
    {
      path: '/places',
      name: 'PlacesOverview',
      alias: '',
      component: PlacesOverview
    },
    {
      path: '/places',
      name: 'PlaceCreation',
      alias: '',
      component: PlaceForm
    },
    {
      path: '/positionsoverview',
      name: 'PositionsOverview',
      alias: '',
      component: PositionsOverview
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
