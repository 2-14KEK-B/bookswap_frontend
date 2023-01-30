<template>
	<div class="flex-center column bg-grey-8" style="height: 100vh; width: 100vw">
		<div class="col-2 text-h1">404</div>
		<div class="col-1 text-h4">{{ t("title") }}</div>
		<p class="col-1 text-h6">{{ t("details") }}</p>
		<div class="col-auto row q-gutter-xl items-center">
			<q-btn color="black" no-caps class="text-h6" :to="{ name: 'home' }">
				{{ t("homePage") }}
			</q-btn>
			<div class="text-h6 text-center">{{ t("or") }}</div>
			<q-btn color="black" no-caps class="text-h6" @click="$router.back">
				{{ t("back") }}
			</q-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useI18n } from "vue-i18n";

	const { t } = useI18n({
		messages: {
			en: {
				title: "Page not found",
				details: "The Page you are looking for doesn't exist or an other error occurred.",
				or: "or",
				homePage: "Home page",
				back: "Back",
			},
			hu: {
				title: "Az oldal nem található",
				details: "Az oldal amit keresel nem létezik vagy egyéb probléma merült fel.",
				or: "vagy",
				homePage: "Kezdőlap",
				back: "Vissza",
			},
		},
	});
</script>
