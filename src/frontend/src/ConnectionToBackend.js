/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 16.12.2023 12:29:00
 * Modified By: Julian Hardtung
 * 
 * Description: Helper API to the backend server
 */


/**
 * Function overview:
 *  getData    - Gets the data based on given parameters
 *  getPreview - Gets a preview of stored data for preview purposes
 */

import axios from 'axios';
import { fromOfflineDB } from "./ConnectionToOfflineDB";
import VueCookies from 'vue-cookies';
export { fromBackend }

class ConnectionToBackend {
  /**
   *
   * @param {String} url
   * @param {String} dataCategory  - Category that is searched for
   * @param {String} identifier    - Term that is searched for
   * @returns -> Promise(object)
   */
  /*async getData(url, dataCategory, identifier) {
     return new Promise((resolve, reject) => {
      try {
        axios.get(url).then((res) => {
          const data = [];
          switch (dataCategory) {
            case "_id":
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i]._id == identifier) {
                  data.push(res.data[i]);
                }
              }
              break;

            case "title":
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].title == identifier) {
                  data.push(res.data[i]);
                }
              }
              break;

            default:
              break;
          }

          resolve(data);
        });
      } catch (error) {
        console.log(error);
      }
    });
  } */

  /**
   * @param {String} url
   * @returns -> Promise(object)
   */
  async getPreview(url) {
    return new Promise((resolve, reject) => {
      try {
        axios.get(url).then((res) => {
          const preview = [];

          for (var i = 0; i < res.data.length; i++) {
            preview.push({ _id: res.data[i]._id, title: res.data[i].title });
          }
          resolve(preview);
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  /**
   * Uploads an object to the onlineDB (MongoDB)
   * @param {*} data the data object to upload
   * @param {*} request the REST request type
   * @param {*} subdomain to the relevant backend route
   * @returns response from backend
   */
  async uploadData(data, request, subdomain) {
    return new Promise((resolve, reject) => {
      axios({
        method: request,
        url: "/" + subdomain.toLowerCase() + "/" + data._id,
        data: data,
        withCredentials: false,
      })
        .then(function (res) {
          //TODO: Delete the uploaded change from the Changes localDB
          resolve(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * Retrieves data from the backend based on a parameter
   * This parameter can be an id, a name or something similar
   *
   * @param {String} subdomain
   * @param {String} param
   * @returns
   */
  async getDataWithParam(subdomain, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: "/" + subdomain + "/" + param,
      })
        .then(function (res) {
          //TODO: Delete the uploaded change from the Changes localDB
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * Retrieves data from the backend
   *
   * @param {String} subdomain
   * @returns
   */
  async getData(subdomain) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: "/" + subdomain,
      })
        .then(function (res) {
          //TODO: Delete the uploaded change from the Changes localDB
          resolve(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * Updates existing data in the backend
   *
   * @param {String} subdomain
   * @param {Object} data
   * @returns
   */
  async putData(subdomain, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url: "/" + subdomain + "/" + data._id,
        data: data,
      })
        .then(function (res) {
          //TODO: Delete the uploaded change from the Changes localDB
          resolve(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  async postData(subdomain, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: "/" + subdomain + "/" + data._id,
        data: data,
      })
        .then(function (res) {
          //TODO: Delete the uploaded change from the Changes localDB
          resolve(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * Uploads an object to the onlineDB (MongoDB)
   * @param {*} data the data object to upload
   * @param {*} request the REST request type
   * @param {*} subdomain to the relevant backend route
   * @returns response from backend
   */
  async uploadFormData(data, request, subdomain) {
    //format the base64 image to a blob
    if (data.image != undefined) {
      data.image = new Blob([data.image], {
        type: "image/jpg",
      });
    } else if (data.texture != undefined) {
      data.texture = new Blob([data.texture], {
        type: "image/jpg",
      });
    }

    //format the model image to a blob
    if (data.model != undefined) {
      data.model = new Blob([data.texture], {
        type: "text/plain",
      });
    }

    return new Promise((resolve, reject) => {
      axios({
        method: request,
        url: "/" + subdomain + "/" + data._id,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      })
        .then(function (res) {
          resolve(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
}

const fromBackend = new ConnectionToBackend();