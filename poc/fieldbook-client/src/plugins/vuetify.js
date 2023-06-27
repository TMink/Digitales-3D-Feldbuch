import "vuetify/styles";
import { createVuetify } from "vuetify";

//TODO: proper color values
export default createVuetify({
  theme: {
    defaultTheme: "fieldbook_light",
    themes: {
      fieldbook_dark: {
        dark: true,
        colors: {
          background: "#3A3A47",
          opp_background: "#22282C",
          accent: "#3A3A47",                  //navigation-bar
          accent_dark: "#5C4646",             //top-bar ('digital3d-Fieldbook')
          surface: "#52525E",                 //list-elements
          primary: "#FE9F2E",                 
          secondary: "#B4A27D",
          error: "#f84141",
          info: "#45A6FF",                    //infotext from dialog
          success: "#16CB49",
          warning: "#FE9F2E",
          confirm: "#16CB49",                 //confirm action
          decline: "#f84141",                 //decline action
          add:"#9EFFE2",                      //add-buttons
          edit:"#FE9F2E",                     //edit-buttons
          cancel:"#8388A4",                   //cancel-buttons
          slider:"#FE9F2E"                    //slider for navigation bar
        },
      },
      fieldbook_light: {
        dark: false,
        colors: {
          background: "#F6F6F6",
          surface: "#FFFFFF",                 //list-elements
          primary: "#EF8F70",                 
          secondary: "#16BCC7",
          error:"#FC5272",                    //cancel-buttons
          warning: "#FECB18",                 //infotext from dialog
          success: "#0FB48C",
          opp_background: "#444444",
          accent: "#F6F7FA",                  //navigation-bar
          accent_dark: "#5C4646",             //top-bar ('digital3d-Fieldbook')
          slider:"#EF8F70"                    //slider for navigation bar
        },
      },
    },
  },
});
