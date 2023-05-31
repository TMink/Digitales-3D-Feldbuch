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
          background: "#444444",
          opp_background: "#FFFFFF",
          surface: "#646464",
          primary: "#68462A",
          "primary-darken-1": "#4B321F",
          secondary: "#AE7F42",
          "secondary-darken-1": "#018786",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
      fieldbook_light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          opp_background: "#444444",
          surface: "#BABABA",
          primary: "#68462A",
          "primary-darken-1": "#4B321F",
          secondary: "#AE7F42",
          "secondary-darken-1": "#018786",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
    },
  },
});
