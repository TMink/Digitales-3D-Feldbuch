/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 13.02.2024 13:02:09
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
export { fromBackend }

class ConnectionToBackend {
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
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * Uploads a data object to the backend using a post or put request
   * @param {String} subdomain
   * @param {Object} data
   * @returns
   */
  async uploadObject(subdomain, data) {
    var data;
    if (data.lastSync == 0) {
      data = await this.postData(subdomain, data).catch((err) => console.error(err));
    } else {
      data = await this.putData(subdomain, data).catch((err) => console.error(err));
    }

    return data;
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
          resolve(res.data);
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
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  /**
   * This sends a delete request to the backend with `subdomain` and `id`
   * @param {String} subdomain
   * @param {String} id
   * @returns
   */
  async deleteData(subdomain, id) {
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        url: "/" + subdomain + "/" + id,
      })
        .then(function (res) {
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
          resolve(res.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }
}

const fromBackend = new ConnectionToBackend();