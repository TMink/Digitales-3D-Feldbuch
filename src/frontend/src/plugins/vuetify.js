/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 23.07.2024 12:08:58
 * Modified By: Julian Hardtung
 * 
 * Description: @deprecated
 *              vuetify and dark/light theme setup
 */

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

export default createVuetify({
  components: {
    components,
    directives,
    labsComponents,
  },
  theme: {
    defaultTheme: "fieldbook_dark",
    themes: {
      fieldbook_dark: {
        dark: true,
        colors: {
          background: "#171C23",
          surface: "#27303d",             //list-elements
          primary: "#FB9678",
          secondary: "#03C9D6",
          error: "#FC5272",               //cancel-buttons
          warning: "#FECB18",             //infotext from dialog
          success: "#0FB48C",
          opp_background: "#22282C",
          accent: "#1C2128",              //navigation-bar
          accent_dark: "#5C4646",         //top-bar ('digital3d-Fieldbook')
          slider: "#FB9678",              //slider for navigation bar
        },
      },
      fieldbook_light: {
        dark: false,
        colors: {
          background: "#F6F6F6",
          surface: "#FFFFFF",             //list-elements
          primary: "#EF8F70",
          secondary: "#16BCC7",
          error: "#FC5272",               //cancel-buttons
          warning: "#FECB18",             //infotext from dialog
          success: "#0FB48C",
          opp_background: "#444444",
          accent: "#F6F7FA",              //navigation-bar
          accent_dark: "#5C4646",         //top-bar ('digital3d-Fieldbook')
          slider: "#EF8F70",              //slider for navigation bar
        },
      },
    },
  },
});
