// vite.config.js
const {defineConfig} = require("vite");
export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: '2048' // 2kb
    },
    publicDir: 'public',
})