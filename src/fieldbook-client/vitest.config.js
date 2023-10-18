import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'


export default defineConfig({
  plugins: [vue(), vuetify()],
  test: {
    setupFiles: [
      "fake-indexeddb/auto"],
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/*"],
    root: fileURLToPath(new URL("./", import.meta.url)),
    transformMode: {
      web: [/\.[jt]sx$/],
    },
    deps: {
      inline: ['vuetify']
    }
  }
});