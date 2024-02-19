/*
 * Created Date: 09.02.2024 21:08:30
 * Author: Julian Hardtung
 * 
 * Last Modified: 17.02.2024 20:17:30
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
     * @returns the current locale that is saved to localStorage
     */
    getLocale() {
      const lang = localStorage.getItem("lang");
      if (lang == null) {
        return getDefaultLang();
      }
      return lang;
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
      var theme = localStorage.getItem("theme");

      theme = theme == "fieldbook_light" ? "fieldbook_dark" : "fieldbook_light";

      localStorage.setItem("theme", theme);
    },

    /**
     * @returns the initialization boolean
     */
    getInitDone() {
      const isInitDone = localStorage.getItem("initDone");
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
     * @returns the current showAllPlaceInfo status
     * (if the places overview table should show all info or not)
     */
    getShowAllPlaceInfo() {
      const showAllPlaceInfo = localStorage.getItem("showAllPlaceInfo");
      if (showAllPlaceInfo == null) {
        return false;
      }
      return JSON.parse(showAllPlaceInfo);
    },

    /**
     * Tooggles, if the places overview table should show all info or not
     * @param {Boolean} showAllPlaceInfo
     */
    toggleShowAllPlaceInfo(showAllPlaceInfo) {
      localStorage.setItem("showAllPlaceInfo", showAllPlaceInfo);
    },

    /**
     * @returns the current showAllPosInfo status
     * (if the positions overview table should show all info or not)
     */
    getShowAllPosInfo() {
      const showAllPosInfo = localStorage.getItem("showAllPosInfo");
      if (showAllPosInfo == null) {
        return false;
      }
      return JSON.parse(showAllPosInfo);
    },

    /**
     * Tooggles, if the positions overview table should show all info or not
     * @param {Boolean} showAllPosInfo
     */
    toggleShowAllPosInfo(showAllPosInfo) {
      localStorage.setItem("showAllPosInfo", showAllPosInfo);
    },

    /**
     * Retrieves the id of a currently opened object (`activity`, `place`, `position`)
     * @param {String} objectType
     * @returns
     */
    getCurrentObject(objectType) {
      var object = null;
      switch (objectType) {
        case "activity":
          object = localStorage.getItem("curActivity");
          break;
        case "place":
          object = localStorage.getItem("curPlace");
          break;
        case "position":
          object = localStorage.getItem("curPosition");
          break;
      }

      return object;
    },

    /**
     * Sets the currently opened object (`activity`, `place`, `position`)
     * @param {String} objectId
     * @param {String} objectType
     */
    setCurrentObject(objectId, objectType) {
      switch (objectType) {
        case "activity":
          localStorage.setItem("curActivity", objectId);
          break;
        case "place":
          localStorage.setItem("curPlace", objectId);
          break;
        case "position":
          localStorage.setItem("curPosition", objectId);
          break;
      }
    },

    /**
     * Removes the currently opened object (`activity`, `place`, `position`)
     * from localStorage
     * @param {String} objectType
     */
    removeCurrentObject(objectType) {
      switch (objectType) {
        case "activity":
          localStorage.removeItem("curActivity");
          break;
        case "place":
          localStorage.removeItem("curPlace");
          break;
        case "position":
          localStorage.removeItem("curPosition");
          break;
      }
    },

    /**
     * Retrieves the id of the currently active modulePreset (for `place` or `position`)
     * @param {String} objectType
     * @returns
     */
    getModulesPreset(objectType) {
      var presetID = null;
      switch (objectType) {
        case "place":
          presetID = localStorage.getItem("placeModulesPreset");
          break;
        case "position":
          presetID = localStorage.getItem("posModulesPreset");
          break;
      }

      return presetID;
    },

    /**
     * Sets the currently chosen modulesPreset (`place`, `position`)
     * @param {String} objectId
     * @param {String} objectType
     */
    setModulesPreset(presetID, objectType) {
      switch (objectType) {
        case "place":
          localStorage.setItem("placeModulesPreset", presetID);
          break;
        case "position":
          localStorage.setItem("posModulesPreset", presetID);
          break;
      }
    },

    /**
     * Deletes all data in localStorage
     */
    clearLocalStorage() {
      localStorage.clear();
    },
  },
});

