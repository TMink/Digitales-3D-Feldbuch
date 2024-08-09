/*
 * Created Date: 23.07.2024 13:53:46
 * Author: Julian Hardtung
 * 
 * Last Modified: 23.07.2024 14:04:20
 * Modified By: Julian Hardtung
 * 
 * Description: Tests functionality of all pinia stores 
 *              (userStore and generalDataStore)
 */

import { describe, expect, test } from "vitest";
import { useUserStore } from "../src/Authentication.js";
import { generalDataStore } from "../src/ConnectionToLocalStorage.js";


describe("UserStore actions", () => {
  test("authenticated", () => {
    const store = useUserStore();
    expect(store.authenticated).toBe(false);
  });

  test("user", () => {
    const store = useUserStore();
    expect(store.user).toBe(null);
  });
});

describe("GeneralStore actions", () => {
  test("locale", () => {
    const store = generalDataStore();

    expect(store.lang).toBe("de");

    store.setLocale("en");
    expect(store.getLocale()).toBe("en");
  });

  test("theme", () => {
    const store = generalDataStore();

    expect(store.getTheme()).toBe("fieldbook_dark");

    store.toggleTheme();
    expect(store.getTheme()).toBe("fieldbook_light");
  });

  test("initDone", () => {
    const store = generalDataStore();

    expect(store.getInitDone()).toBe(false);

    store.setInitDone(true);
    expect(store.getInitDone()).toBe("true");
  });

  test("placeInfo", () => {
    const store = generalDataStore();

    expect(store.getShowAllPlaceInfo()).toBe(false);

    store.toggleShowAllPlaceInfo(true);
    expect(store.getShowAllPlaceInfo()).toBe(true);
  });

  test("positionInfo", () => {
    const store = generalDataStore();

    expect(store.getShowAllPosInfo()).toBe(false);

    store.toggleShowAllPosInfo(true);
    expect(store.getShowAllPosInfo()).toBe(true);
  });

  test("currentObject", () => {
    const store = generalDataStore();

    expect(store.getCurrentObject("activity")).toBe(null);
    expect(store.getCurrentObject("place")).toBe(null);
    expect(store.getCurrentObject("position")).toBe(null);

    store.setCurrentObject("11111111", "activity");
    store.setCurrentObject("22222222", "place");
    store.setCurrentObject("33333333", "position");
    expect(store.getCurrentObject("activity")).toBe("11111111");
    expect(store.getCurrentObject("place")).toBe("22222222");
    expect(store.getCurrentObject("position")).toBe("33333333");

    store.removeCurrentObject("activity");
    store.removeCurrentObject("place");
    store.removeCurrentObject("position");
    expect(store.getCurrentObject("activity")).toBe(null);
    expect(store.getCurrentObject("place")).toBe(null);
    expect(store.getCurrentObject("position")).toBe(null);
  });

  test("modulePresets", () => {
    const store = generalDataStore();

    expect(store.getModulesPreset("place")).toBe(null);
    expect(store.getModulesPreset("position")).toBe(null);

    store.setModulesPreset("11111111", "place");
    store.setModulesPreset("22222222", "position");

    expect(store.getModulesPreset("place")).toBe("11111111");
    expect(store.getModulesPreset("position")).toBe("22222222");
  });

  test("tooltips", () => {
    const store = generalDataStore();

    expect(store.getShowTooltips()).toBe(true);

    store.toggleTooltips(false);
    expect(store.getShowTooltips()).toBe(false);
  });
});