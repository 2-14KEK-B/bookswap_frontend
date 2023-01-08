import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import type { App } from "vue";

type availableLocales = "hu" | "en";
export const locales: availableLocales[] = ["hu", "en"];

const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: "hu",
	fallbackLocale: "en",
	messages: messages,
});

// Set new locale.
export async function setLocale(locale: availableLocales) {
	// Load locale if not available yet.
	if (!i18n.global.availableLocales.includes(locale)) {
		const messages = await loadLocale(locale);

		// fetch() error occurred.
		if (messages === undefined) {
			return;
		}

		// Add locale.
		i18n.global.setLocaleMessage(locale, messages);
	}

	// Set locale.
	i18n.global.locale.value = locale;
}

// Fetch locale.
async function loadLocale(locale: availableLocales) {
	try {
		const response = await fetch(`./locales/${locale}.json`);
		if (response.ok) {
			return response.json();
		}
		throw new Error("Something went wrong!");
	} catch (error) {
		console.error(error);
	}
}

export const install = (app: App) => {
	app.use(i18n);
};
