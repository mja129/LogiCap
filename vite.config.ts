import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Icons from 'unplugin-icons/vite'

// used to automatically create the paths from tsconfig.app.json
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        Icons({
            compiler: 'svelte',
        }),
        tsconfigPaths()
    ],
    base: './', // Use relative paths
    optimizeDeps: {
        include: ['custom_digitaljs'],
    },
    build: {
        rollupOptions: {
            output: {
                globals: {
                    jquery: 'jQuery',
                },
            },
        },
        commonjsOptions: {
            include: [/custom_digitaljs/, /node_modules/],
            transformMixedEsModules: true,
        },
    },
})
