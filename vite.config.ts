import { defineConfig } from "vite";
import path from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";

export default defineConfig({
	plugins: [
		vue({
			template: { transformAssetUrls },
		}),
		quasar({
			sassVariables: "src/styles/quasar-variables.scss",
		}),
		eslint(),
	],
	resolve: {
		alias: {
			"@api": path.resolve(__dirname, "src/api"),
			"@components": path.resolve(__dirname, "src/components"),
			"@interfaces": path.resolve(__dirname, "src/interfaces"),
			"@layouts": path.resolve(__dirname, "src/layouts"),
			"@stores": path.resolve(__dirname, "src/stores"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@views": path.resolve(__dirname, "src/views"),
		},
	},
	server: {
		port: 4000,
	},
	build: {
		chunkSizeWarningLimit: 1024,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("/node_modules/")) {
						const modules = ["quasar", "@quasar", "vue", "@vue"];
						const chunk = modules.find((module) => id.includes(`/node_modules/${module}`));
						return chunk ? `vendor-${chunk}` : "vendor";
					}
				},
			},
		},
	},
});
