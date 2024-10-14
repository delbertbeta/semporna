import path from 'path';

import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginLess } from '@rsbuild/plugin-less';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  html: {
    title: 'Semporna',
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
    define: {
      API_END_POINT: JSON.stringify(process.env.API_END_POINT),
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
