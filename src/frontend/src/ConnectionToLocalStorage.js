/*
 * Created Date: 09.02.2024 21:08:30
 * Author: Julian Hardtung
 * 
 * Last Modified: 10.02.2024 12:19:51
 * Modified By: Julian Hardtung
 * 
 * Description: A persistent way to store fieldbook settings in 
 *              the browser localStorage, as an alternative to cookies. 
 *    TODO: Data from cookies should slowly be migrated to this
 */

import { defineStore } from 'pinia'

const getDefaultLang = () => ('de');
const getDefaultTheme = () => ('fieldbook_dark');

export const generalDataStore = defineStore("generalData", {
  state: () => ({
    lang: getDefaultLang(),
  }),

  actions: {
    /**
     * 
     * @returns the current locale that is saved to localStorage
     */
    getLocale() {
      const lang = localStorage.getItem("lang");
      if (lang == null) {
        return getDefaultLang();
      }
      return lang
    },

    /**
     * Sets the global locale to the `langString`
     * @param {String} langString 
     */
    setLocale(langString) {
      this.lang = langString;
      localStorage.setItem("lang", langString);
    },


    /**
     * 
     * @returns the current vuetify theme 
     */
    getTheme() {
      const theme = localStorage.getItem("theme");
      if (theme == null) {
        return getDefaultTheme();
      }
      return theme;
    },

    /**
     * Toggles the vuetify theme between dark and light mode
     */
    toggleTheme() {
      var theme = localStorage.getItem('theme');

      theme = (theme == 'fieldbook_light') ? 'fieldbook_dark' : 'fieldbook_light'

      localStorage.setItem('theme', theme);
    },
  },
});

