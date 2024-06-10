import path from "path";

import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";
import { pluginLess } from "@rsbuild/plugin-less";

import config from "./dev.config";

export default defineConfig({
  html: {
    title: "Semporna",
  },
  source: {
    entry: {
      index: "./src/main.ts",
    },
  },
  tools: {
    bundlerChain: (chain, { CHAIN_ID }) => {
      chain.module.rules.delete(CHAIN_ID.RULE.SVG);

      chain.module
        .rule(CHAIN_ID.RULE.SVG)
        .test(/\.svg$/)
        .use("svg-sprite-loader")
        .loader("svg-sprite-loader")
        .options(() => ({
          symbolId: (filePath) =>
            `svgicon-${path.basename(path.dirname(filePath))}-${path.basename(
              filePath,
              ".svg"
            )}`,
        }));
    },
  },
  plugins: [pluginVue(), pluginLess()],
  dev: {
    client: {
      port: String(config.hmr),
    },
  },
  server: {
    port: config.port,
  },
});
