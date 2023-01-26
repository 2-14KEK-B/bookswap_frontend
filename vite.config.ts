import { defineConfig } from "vite";
import path from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
// import replace from "@rollup/plugin-replace";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import type { ManifestOptions, VitePWAOptions } from "vite-plugin-pwa";
import { fileURLToPath } from "node:url";
// import { checker } from "vite-plugin-checker";

const pwaOptions: Partial<VitePWAOptions> = {
	mode: "development",
	base: "/",
	includeAssets: ["favicon.svg"],
	manifest: {
		name: "PWA Router",
		short_name: "PWA Router",
		theme_color: "#ffffff",
		icons: [
			{
				src: "pwa-192x192.png", // <== don't add slash, for testing
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/pwa-512x512.png", // <== don't remove slash, for testing
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "pwa-512x512.png", // <== don't add slash, for testing
				sizes: "512x512",
				type: "image/png",
				purpose: "any maskable",
			},
		],
	},
	devOptions: {
		enabled: process.env.SW_DEV === "true",
		/* when using generateSW the PWA plugin will switch to classic */
		type: "module",
		navigateFallback: "index.html",
	},
};

// const replaceOptions = { __DATE__: new Date().toISOString() };
const claims = process.env.CLAIMS === "true";
const reload = process.env.RELOAD_SW === "true";
const selfDestroying = process.env.SW_DESTROY === "true";

if (process.env.SW === "true") {
	pwaOptions.srcDir = "src";
	pwaOptions.filename = claims ? "claims-sw.ts" : "prompt-sw.ts";
	pwaOptions.strategies = "injectManifest";
	(pwaOptions.manifest as Partial<ManifestOptions>).name = "PWA Inject Manifest";
	(pwaOptions.manifest as Partial<ManifestOptions>).short_name = "PWA Inject";
}

if (claims) pwaOptions.registerType = "autoUpdate";

if (reload) {
	// @ts-expect-error overrides
	replaceOptions.__RELOAD_SW__ = "true";
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

/*"locale/hu": path.resolve(__dirname, "src/locales/hu.json"),
	"locale/en": path.resolve(__dirname, "src/locales/en.json"), */
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
			include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
			runtimeOnly: false,
		}),
		{
			...eslint({ failOnError: true, failOnWarning: true }),
			apply: "build",
		},
		VitePWA(pwaOptions),
		// checker({
		// 	// typescript: true,
		// 	// vueTsc: true,
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
			"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
		},
	},
	server: {
		port: 4000,
	},
	build: {
		sourcemap: process.env.SOURCE_MAP === "true",
		chunkSizeWarningLimit: 1024,
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("/node_modules/")) {
						const modules = [
							"quasar",
							"@quasar",
							"vue",
							"@vue",
							"vue3-google-login",
							"axios",
							"pinia",
							"socket.io",
							"dayjs",
							"@intlify",
						];
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
