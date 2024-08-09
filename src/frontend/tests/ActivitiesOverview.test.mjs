import { describe, it, test, expect, vi, beforeAll } from 'vitest';
import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill'
/* currently throws an error, because Vitest 
doesn't recognize the vuetify components */
import ActivitiesOverview from "../src/views/ActivitiesOverview.vue";

import { fromOfflineDB } from '../src/ConnectionToOfflineDB.js'


import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

import { createI18n } from "vue-i18n";
import fieldbook_en from "../src/locales/en.mjs";
import fieldbook_de from "../src/locales/de.mjs";
import { createPinia } from 'pinia';


// init used plugins for the component that is being tested
const vuetify = createVuetify({ components, labsComponents, directives });

//Tests if the Navigation element renders correct
describe('ActivitesOverview', () => {
  const vuetify = createVuetify({
    components,
    labsComponents,
    directives,
  });

  beforeAll(() => {
      global.ResizeObserver = ResizeObserver
  });

  test('should render correctly', () => {
      const wrapper = mount(components.VApp, {
        slots: {
          default: ActivitiesOverview,
        },
        global: {
          plugins: [vuetify, createPinia()],
        },
      });

      expect(wrapper.exists()).toBe(true)
  })

  

  test('load new activity components', async () => {
      const wrapper = mount(components.VApp, {
        slots: {
          default: ActivitiesOverview,
        },
        global: {
          plugins: [vuetify],
        },
      });

      /* const spy = vi.spyOn(wrapper.vm, 'addActivity')
      await wrapper.vm.addActivity()

      expect(spy).toHaveBeenCalled()
      expect(wrapper.find('#editActivity').exists()).toBe(true)
      vi.restoreAllMocks() */
  })

/*     test('edit components generated', async () => {
        const wrapper = mount(ActivitiesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const spy = vi.spyOn(wrapper.vm, 'addActivity')
        await wrapper.vm.addActivity()

        expect(spy).toHaveBeenCalled()
        expect(wrapper.find('#activityBranchOffice').exists()).toBe(true)
        expect(wrapper.find('#activityYear').exists()).toBe(true)
        expect(wrapper.find('#activityNumber').exists()).toBe(true)
    })

    test('save new activity correctly', async () => {
        const wrapper = mount(ActivitiesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const testActivity = {
            branchOffice : "Gummersbach",
            year : "2023",
            number : "2504"
        }
        
        const spy = vi.spyOn(wrapper.vm, 'saveActivity')
        await fromOfflineDB.syncLocalDBs()
        await wrapper.vm.saveActivity(testActivity)
        expect(spy).toHaveBeenCalled()

        //tests, if the activity in the activities-array has the same data as the testActivity
        const activity = wrapper.vm.activities[0]
        expect(activity.branchOffice).toBe("Gummersbach")
        expect(activity.year).toBe("2023")
        expect(activity.number).toBe("2504")
    })

    test('delete new activity correctly', async () => {
        const wrapper = mount(ActivitiesOverview, {
            global: {
                plugins: [vuetify, i18n],
            },
        });

        const testActivity = {
            branchOffice : "Köln",
            year : "2023",
            number : "2345"
        }
        
        const spySave = vi.spyOn(wrapper.vm, 'saveActivity')
        await fromOfflineDB.syncLocalDBs()
        await wrapper.vm.saveActivity(testActivity)
        expect(spySave).toHaveBeenCalled()

        const spyDelete = vi.spyOn(wrapper.vm, 'deleteActivity')
        await fromOfflineDB.syncLocalDBs()
        await wrapper.vm.deleteActivity(wrapper.vm.activities[1])
        expect(spyDelete).toHaveBeenCalled()
        expect(wrapper.vm.activities[1]).toMatchObject(undefined);
    }) */
    

})