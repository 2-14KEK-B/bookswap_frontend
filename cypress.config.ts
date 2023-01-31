/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		responseTimeout: 60000,
		video: true,
		videoUploadOnPasses: false,
		baseUrl: "http://localhost:4000",
	},

	component: {
		devServer: {
			framework: "vue",
			bundler: "vite",
		},
	},
});
