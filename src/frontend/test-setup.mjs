/*
 * Created Date: 22.07.2024 10:43:03
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.08.2024 15:19:18
 * Modified By: Julian Hardtung
 * 
 * Description: 
 */

import { config } from "@vue/test-utils";
import { i18n } from "./src/plugins/i18n.js";
import { beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Configure global plugins
config.global.plugins = [i18n];

beforeEach(() => {
  const pinia = createPinia();
  setActivePinia(pinia);
})