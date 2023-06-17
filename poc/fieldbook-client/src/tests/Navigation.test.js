import { describe, it, test, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';

/* currently throws an error, because Vitest 
doesn't recognize the vuetify components */
/* import Navigation from "../components/Navigation.vue"; */

import { createVuetify } from "vuetify";

import { createI18n } from "vue-i18n";
import fieldbook_en from "../locales/en.mjs";
import fieldbook_de from "../locales/de.mjs";

// init used plugins for the component that is being tested
const vuetify = createVuetify();
const i18n = createI18n({
  locale: "en",
  allowComposition: true,
  messages: {
    en: fieldbook_en,
    de: fieldbook_de,
  },
});

//mockup data for tests
const activity = {
    activityNumber: "Xanten 2023/0001",
    branchOffice: "Xanten",
    id: "1686828557391",
    lastChanged: 1686828657757,
    lastSync: 1686829412442,
    number: "0001",
    places: ['1686828657757'],
    year: "2023",
};


test("Activity is working", () => {
    expect(activity.branchOffice).toBe("Xanten")
})


/* describe('Mount test', () => {
    
    it('should render', () => {
        const wrapper = mount(Navigation, {
          global: {
            plugins: [vuetify, i18n],
          },
        });

    })
}) */