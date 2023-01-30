import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import dayjs from "dayjs";
import type { App } from "vue";

export type availableLocales = "hu" | "en";
export const locales: availableLocales[] = ["hu", "en"];

export const i18n = createI18n({
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
	await setDayJS(locale);
}

async function setDayJS(locale: availableLocales) {
	const locales = {
		hu: () => import("dayjs/locale/hu"),
		en: () => import("dayjs/locale/en"),
	};
	await locales[locale]();
	dayjs.locale(locale);
}

// Fetch locale.
async function loadLocale(locale: availableLocales) {
	try {
		const response = await fetch(`../locales/${locale}.json`);
		if (response.ok) {
			return response.json();
		}
		throw new Error("Something went wrong!");
	} catch (error) {
		console.error(error);
	}
}

export const install = async (app: App) => {
	await setDayJS(i18n.global.locale.value as availableLocales);
	app.use(i18n);
};
