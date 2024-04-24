import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    plugins: [
        Components({
            dirs: ['.vitepress/theme/components'],
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [ArcoResolver({ sideEffect: true, resolveIcons: true })]
        }),
    ],
    ssr: { noExternal: ['@arco-design/web-vue'] },
    resolve: {
        alias: {
            'mermaid': 'mermaid/dist/mermaid.esm.mjs',
        },
    },
    build: {
        chunkSizeWarningLimit: 1700,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const HugeLibraries = ["@mui", "xlsx", "xlsx-js-style", "jodit-react", "exceljs"]; // modify as required based on libraries in use
                    if (HugeLibraries.some((libName) => id.includes(`node_modules/${libName}`))) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString();
                    }
                },
            }
        }
    }
});