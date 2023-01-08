import { defineConfig } from "vite";
import path, { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";
import { fileURLToPath } from "url";
// import { checker } from "vite-plugin-checker";

export default defineConfig({
	plugins: [
		vue({
			template: { transformAssetUrls },
		}),
		quasar({
			autoImportComponentCase: "combined",
			sassVariables: "src/styles/quasar-variables.scss",
		}),
		VueI18nPlugin({
			include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
			runtimeOnly: false,
		}),
		{
			...eslint({ failOnError: true, failOnWarning: true }),
			apply: "build",
		},
		// checker({
		// 	typescript: true,
		// 	vueTsc: true,
		// 	eslint: {
		// 		lintCommand: 'eslint "./src/**/*.{ts,vue}"',
		// 	},
		// }),
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
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("/node_modules/")) {
						const modules = ["quasar", "@quasar", "vue", "@vue", "axios", "pinia", "socket.io"];
						const chunk = modules.find((module) => id.includes(`/node_modules/${module}`));
						return chunk ? `vendor-${chunk}` : "vendor";
					}
				},
				// assetFileNames: (assetInfo) => {
				// 	let extType = assetInfo.name?.split(".").at(1);
				// 	if (extType && /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
				// 		extType = "img";
				// 	}
				// 	return `assets/${extType}/[name]-[hash][extname]`;
				// },
				// chunkFileNames: "static/js/[name]-[hash].js",
				// entryFileNames: "static/js/[name]-[hash].js",
			},
		},
	},
});
