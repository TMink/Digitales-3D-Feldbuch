/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 25.10.2024 16:29:31
 * Modified By: Julian Hardtung
 * 
 * Description: file with reusable util functions
 */

import { generalDataStore } from "./ConnectionToLocalStorage";

export { utils };

class UtilsClass {
  /**
   * Escapes special characters in a given string to treat
   * them as literal characters.
   *
   * @param {string} string - The input string to be escaped.
   * @returns {string} The escaped string with special characters replaced
   *  by their escape sequences.
   */
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Returns an array of filtered objects based on the search query.
   *
   * @returns {Array} The filtered array of objects that match the search query.
   * If the search query is empty or invalid, it returns all objects.
   */
  filteredObjects(objects, searchQuery, objectType) {
    // split searchQuery to query array and escape special characters
    const queries = searchQuery.trim().toLowerCase().split(/\s+/).map(this.escapeRegExp);

    if (objects.length == 0) {
      return;
    }

    // if no queries are present, return all objects
    if (queries.length === 0 || (queries.length === 1 && queries[0] === "")) {
      return objects;
    } else {
      // filter objects by all query filters
      // (objects have to fulfill every query filter)
      let filteredObjects =  objects.filter((item) => {
        return queries.every((query) => {
          return this.doesItemMatchQuery(item, query, objectType);
        });
      });
      return filteredObjects;
    }
  }

  /**
   * Checks if an item matches a given query by performing 
   * a case-insensitive search.
   *
   * @param {Object} item - The item to be matched against the query.
   * @param {string} query - The search query to be used for matching.
   * @returns {boolean} True if the item matches the query; otherwise, false.
   *
   */
  doesItemMatchQuery(item, query, objectType) {
    const re = new RegExp(query, 'i');

    if (objectType == 'activity') {
        return (
          item.branchOffice.match(re) 
          || item.year.toString().match(re) 
          || item.number.toString().match(re)
        );
    } else if (objectType == 'place') {
      return (
        item.placeNumber.toString().match(re) 
        || item.title.match(re) 
        || item.description.match(re) 
        || item.editor.match(re) 
        || item.date.match(re)
      );
    } else if (objectType == 'position') {
      if (item.posType == 'position') {
        return (
          item.positionNumber.toString().match(re) 
          || item.title.some(str => str.match(re)) 
          || item.date.match(re)
        );
      } else if (item.posType == 'image') {
        return (
          item.positionNumber.toString().match(re) ||
          item.editor.match(re) ||
          item.comment.match(re) ||
          item.date.match(re)
        );
      }
    }
  }

  /**
   * Calculate the required table pixel height based on the number of items
   * @param {[Object]} objects
   * @param {Number} windowHeight
   * @returns
   */
  getTableHeight(objects, windowHeight) {
    const numberOfRows = objects.length > 0 ? objects.length : 1;
    const headerHeight = 56;
    const rowHeight = 69;
    const totalTableHeight = numberOfRows * rowHeight + headerHeight;

    if (totalTableHeight > windowHeight - 390) {
      return windowHeight - 390;
    }

    return totalTableHeight + "px";
  }

  /**
   * Get the style for the row at the specified index.
   * Furthermore get the currentTheme from Cookies and decide which colorattribute to use.
   *
   * @param {number} index The index of the row
   * @returns {Object} An object containing row style properties
   */
  getRowStyle(index, hoveredRow) {
    const generalStore = generalDataStore();
    var currentTheme = generalStore.getTheme();
    if (currentTheme !== "fieldbook_light") {
      return {
        cursor: "pointer",
        padding: "8px 16px",
        backgroundColor: hoveredRow === index ? "#2f3845" : "transparent",
      };
    }
    return {
      cursor: "pointer",
      padding: "8px 16px",
      backgroundColor: hoveredRow === index ? "#F6F6F6" : "transparent",
    };
  }

  /**
   * Prevents the input of non numeric values
   * @param {*} evt
   */
  filterNonNumeric(evt) {
    evt = evt ? evt : window.event;
    let expect = evt.target.value.toString() + evt.key.toString();

    if (!/^[0-9]*$/.test(expect)) {
      evt.preventDefault();
    } else {
      return true;
    }
  }

  /**
     * Change texture data to base64
     * @param {*} rawData 
     */
    async textureToBase64(rawData) {
      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          resolve(b64)
        }
        reader.readAsDataURL(f);

      });
      return output;
    },
}

const utils = new UtilsClass();