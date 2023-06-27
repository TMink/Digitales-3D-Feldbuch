import "vuetify/styles";
import { createVuetify } from "vuetify";

//TODO: proper color values
export default createVuetify({
  theme: {
    defaultTheme: "fieldbook_dark",
    themes: {
      fieldbook_dark: {
        dark: true,
        colors: {
          background: "#171C23",
          surface: "#27303d",                 //list-elements
          primary: "#FB9678",                 
          secondary: "#03C9D6",
          error:"#FC5272",                    //cancel-buttons
          warning: "#FECB18",                 //infotext from dialog
          success: "#0FB48C",
          opp_background: "#22282C",
          accent: "#3A3A47",                  //navigation-bar
          accent_dark: "#5C4646",             //top-bar ('digital3d-Fieldbook')
          slider:"#FB9678"                    //slider for navigation bar
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
