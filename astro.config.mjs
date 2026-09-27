import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // ⚠️ 部署到真实自有域名后必须替换此处的占位符，否则 sitemap / 规范链接都会指向假域名
  site: 'https://verbify.example.com',
  integrations: [vue(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
