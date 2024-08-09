import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    setupFiles: ["fake-indexeddb/auto", "test-setup.mjs"],
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/*"],
    root: fileURLToPath(new URL("./", import.meta.url)),
    transformMode: {
      web: [/\.[jt]sx$/],
    },
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
});