/*
 * Created Date: 09.02.2024 21:08:30
 * Author: Julian Hardtung
 * 
 * Last Modified: 12.02.2024 13:22:53
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

    /**
     * @returns the initialization boolean
     */
    getInitDone() {
      const isInitDone = localStorage.getItem('initDone');
      if (isInitDone == null) {
        return false;
      }
      return isInitDone;
    },

    /**
     * Sets the initialization boolean
     * @param {Boolean} isInitDone 
     */
    setInitDone(isInitDone) {
      localStorage.setItem("initDone", isInitDone);
    },

    /**
     * Deletes all data in localStorage
     */
    clearLocalStorage() {
      localStorage.clear()
    },
    
  },
});

