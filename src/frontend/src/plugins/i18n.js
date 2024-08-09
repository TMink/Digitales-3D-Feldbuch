/*
 * Created Date: 23.07.2024 11:47:55
 * Author: Julian Hardtung
 * 
 * Last Modified: 23.07.2024 16:40:34
 * Modified By: Julian Hardtung
 * 
 * Description: 
 */

import { createI18n } from "vue-i18n";
import fieldbook_en from "../locales/en.mjs";
import fieldbook_de from "../locales/de.mjs";

export const i18n = createI18n({
  locale: "de",
  allowComposition: true,
  messages: {
    en: fieldbook_en,
    de: fieldbook_de,
  },
});