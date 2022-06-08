// vite.config.js
const {defineConfig} = require("vite");
const { resolve } = require('path')
export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: '2048', // 2kb
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                website: resolve(__dirname, 'website.html')
            }
        }
    },
    publicDir: 'public',
})
