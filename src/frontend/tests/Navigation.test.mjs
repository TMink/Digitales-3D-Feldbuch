import { describe, test, expect, vi, beforeAll, beforeEach } from 'vitest';
import { mount, config, shallowMount } from '@vue/test-utils';
import { createTestingPinia } from "@pinia/testing";
import ResizeObserver from 'resize-observer-polyfill'
import Navigation from "../src/components/Navigation.vue";

import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

import { VueRouterMock, createRouterMock, injectRouterMock } from 'vue-router-mock'


config.plugins.VueWrapper.install(VueRouterMock)

//Tests if the Navigation element renders correct
describe('Navigation', () => {
  const vuetify = createVuetify({
    components,
    labsComponents,
    directives,
  });

  const router = createRouterMock({
    spy: {
      create: fn => vi.fn(fn),
      reset: spy => spy.mockReset(),
    }
  })

  beforeAll(() => {
    global.ResizeObserver = ResizeObserver
    //injectRouterMock(router)
  });

  beforeEach(() => {
    injectRouterMock(router);
  })

  test('should render correctly', async () => {
    const wrapper = mount(components.VApp, {
      slots: {
        default: Navigation
      },
      global: {
        plugins: [vuetify, createTestingPinia({
          initialState:{
            authenticated: false,
            user: null
          }
        })],
      },
    });
    await new Promise((resolve) => {
      setTimeout(() => resolve(""), 1);
    });
    
    expect(wrapper.exists()).toBe(true);
  })

  test("Tabs exist", async () => {
    var wrapper = mount(components.VApp, {
      slots: {
        default: Navigation,
      },
      global: {
        plugins: [vuetify],
        props: {
          active_tab_prop: "0",
          active_tab_: "0",
        },
      },
    });

    await new Promise((resolve) => {
      setTimeout(() => resolve(""), 1);
    });

    //console.log(wrapper.html());
    const activityTab = wrapper.find("#activity");
    const placeTab = wrapper.find("#place");
    const positionTab = wrapper.find("#position");

    expect(activityTab.exists()).toBe(true);
    expect(placeTab.exists()).toBe(true);
    expect(positionTab.exists()).toBe(true);
  })

  test("Tabs labeled correctly in german", async () => {
    const wrapper = mount(components.VApp, {
      slots: {
        default: Navigation,
      },
      global: {
        plugins: [vuetify],
      },
    });

    await new Promise((resolve) => {
      setTimeout(() => resolve(""), 1);
    });

    const activity = wrapper.get("#activity")
    const place = wrapper.get("#place")
    const position = wrapper.get("#position")

    expect(activity.text().split(" ")[0]).toEqual("Aktivität");
    expect(place.text().split(" ")[0]).toEqual("Stelle");
    expect(position.text().split(" ")[0]).toEqual("Position");
  })

})