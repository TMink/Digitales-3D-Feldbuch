/*
 * Created Date: 30.11.2023 12:25:16
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 02:07:25
 * Modified By: Julian Hardtung
 * 
 * Description: Authentication actions and user state storage
 */

import { defineStore } from 'pinia'
import axios from "axios";
import { toRaw } from "vue";


export const useUserStore = defineStore("user", {
  state: () => {
    return {
      authenticated: false,
      user: null,
    }
  },

  actions: {

    /**
     * Retrieves data of the currently logged in user
     */
    async getUser() {
      try {
        const data = await axios({
          method: "get",
          url: "/user/user",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        this.user = data.data;
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Registers a new user
     * @param {*} formData {username, mail, password}
     */
    async register(formData) {
      try {
        await axios({
          method: "post",
          url: "/user/register",
          data: toRaw(formData),
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
      } catch (error) {
        console.log(error)
      }

    },

    async login(formData) {

      try {
        const response = await axios({
          method: "post",
          url: "/user/login",
          data: toRaw(formData),
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
        this.authenticated = true;
        this.user = toRaw(response.data.user);
        
      } catch (error) {
        console.log("Login failed: " + error);
      }

    },

    /**
     * This will log out the current user 
     * and turns the `authenticated` flag to false
     */
    async logout() {
      try {
        await axios({
          method: "post",
          url: "/user/logout",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        this.user = null;
        this.authenticated = false;
      } catch (error) {
        console.log("Logout failed");
      }
    },
  }
})
