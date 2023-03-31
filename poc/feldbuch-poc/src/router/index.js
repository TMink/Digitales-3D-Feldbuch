import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Viewer from '@/components/3dView'
import ProjectsOverview from '@/components/ProjectsOverview'
import ExcavationsOverview from '@/components/ExcavationsOverview'


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
      path: '/excavations',
      name: 'ExcavationsOverview',
      alias: '',
      component: ExcavationsOverview
    }
  ]
})
