// vite.config.js
const {defineConfig} = require("vite");
const { resolve } = require('path')
import removeConsole from 'vite-plugin-remove-console';
export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: '2048', // 2kb
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                website: resolve(__dirname, 'website.html')
            }
        },
    },
    plugins: [
        removeConsole()
    ],
    publicDir: 'public',
})
