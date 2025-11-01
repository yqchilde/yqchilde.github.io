import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
    plugins: [
        tailwindcss(),
        Components({
            dirs: ['.vitepress/theme/components'],
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })],
            dts: true,
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api']
            }
        }
    },
    ssr: { noExternal: ['@arco-design/web-vue'] },
    build: {
        chunkSizeWarningLimit: 1500
    }
});