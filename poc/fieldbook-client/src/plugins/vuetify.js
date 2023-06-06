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
          surface: "#594843",
          primary: "#A02FB3",
          "primary-darken-1": "#5C3342",
          secondary: "#B4A27D",
          "secondary-darken-1": "#018786",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          confirm: "#43A047",
          decline: "#F44A3E"
        },
      },
      fieldbook_light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          opp_background: "#444444",
          accent: "#B4A27D",
          accent_dark: "#594843",
          surface: "#E0E0E0",
          primary: "#A02FB3",
          "primary-darken-1": "#5C3342",
          secondary: "#594843",
          "secondary-darken-1": "#018786",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
          confirm: "#43A047",
          decline: "#F44A3E"
        },
      },
    },
  },
});
