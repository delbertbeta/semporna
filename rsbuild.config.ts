import path from 'path';

import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginLess } from '@rsbuild/plugin-less';
import dotenv from 'dotenv';
import { resolveApiEndpoint } from './config/api-endpoint';

dotenv.config();

const apiEndpoint = resolveApiEndpoint(process.env.APP_ENV);

export default defineConfig({
  html: {
    title: 'The Place of Shyrii & Delbert',
    favicon: './src/assets/img/logo.png',
    meta: {
      description: '把平凡的日子，记录成不舍得删的样子。',
      'theme-color': '#f5f3f0',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
    define: {
      API_END_POINT: JSON.stringify(apiEndpoint),
    },
  },
  tools: {
    bundlerChain: (chain, { CHAIN_ID }) => {
      chain.module.rules.delete(CHAIN_ID.RULE.SVG);

      chain.module
        .rule(CHAIN_ID.RULE.SVG)
        .test(/\.svg$/)
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options(() => ({
          symbolId: (filePath) =>
            `svgicon-${path.basename(path.dirname(filePath))}-${path.basename(
              filePath,
              '.svg'
            )}`,
        }));
    },
  },
  plugins: [pluginVue(), pluginLess()],
  dev: {
    client: {
      port: process.env.HMR_PORT,
    },
  },
  server: {
    port: process.env.LISTEN_PORT ? Number(process.env.LISTEN_PORT) : 3001,
  },
});
