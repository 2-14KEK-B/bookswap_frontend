import { App } from "vue";
import { Quasar, QuasarPluginOptions, Dark } from "quasar";

import "quasar/src/css/index.sass";

const config: Partial<QuasarPluginOptions> = {
	plugins: { Dark },
	config: {
		eslint: {
			warnings: true,
			errors: true,
		},
		dark: true,
	},
	/*
    config: {
      brand: {
        // primary: '#e46262',
        // ... or all other brand colors
      },
      notify: {...}, // default set of options for Notify Quasar plugin
      loading: {...}, // default set of options for Loading Quasar plugin
      loadingBar: { ... }, // settings for LoadingBar Quasar plugin
      // ..and many more (check Installation card on each Quasar component/directive/plugin)
    }
  */
};
export const install = (app: App) => {
	app.use(Quasar, config);
};
