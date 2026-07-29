import generouted from '@generouted/react-router/plugin'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'
import { normalizePath } from 'vite'
// vitest 的 defineConfig —— vite 那个不认 `test` 字段
import { defineConfig } from 'vitest/config'
import svgr from 'vite-plugin-svgr'
import i18nResource from './vite-plugins/i18n-resource'
import UnoCSS from 'unocss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));
const standardFontsDir = normalizePath(path.join(pdfjsDistPath, 'standard_fonts'));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    UnoCSS(),
    react(),
    svgr({ svgrOptions: {} }),
    generouted(),
    i18nResource({ entry: './src/i18n/locales' }),
    viteStaticCopy({ targets: [{src: cMapsDir, dest: '' }, { src: standardFontsDir, dest: ''}] })
  ],

  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {}
    }
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // 只跑我们自己的测试 —— node_modules 里的 .test 文件不算
    include: ['src/**/*.test.{ts,tsx}'],
  },

  server: {
    proxy: {
      // 后端换成了 rice。VITE_RICE_ORIGIN 没设时打本地起的 rice。
      '/api': {
        target: process.env.VITE_RICE_ORIGIN || 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    }
  }
  // server: {
  //   port: 5000,
  // }

})
