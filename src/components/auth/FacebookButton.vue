<template>
	<!-- :icon="$q.screen.lt.sm ? fabFacebook : 'none'" -->
	<q-btn
		:class="$q.screen.gt.xs ? 'social' : ''"
		:icon="fabFacebook"
		:label="$q.screen.gt.xs ? $t('auth.facebookLogin') : ''"
		:color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
		:text-color="$q.dark.isActive ? 'black' : 'grey-1'"
		no-caps
		:style="{ width: $q.screen.gt.xs ? 240 + 'px' : 140 + 'px' }"
		@click.prevent="loginWithFacebook"
	/>
</template>

<script setup lang="ts">
	import { Notify } from "quasar";
	import { useI18n } from "vue-i18n";
	import { useAppStore } from "@stores/app";
	import { useAuthStore } from "@stores/auth";
	import { fabFacebook } from "@quasar/extras/fontawesome-v6";

	// eslint-disable-next-line no-undef
	const fb = FB;
	const appStore = useAppStore();
	const authStore = useAuthStore();
	const { t } = useI18n({ useScope: "global" });

	async function loginWithFacebook() {
		// eslint-disable-next-line no-undef
		let auth: fb.AuthResponse | null = null;
		fb.getLoginStatus((res) => {
			if (res.status === "connected") {
				auth = fb.getAuthResponse();
			} else {
				fb.login(
					(res) => {
						if (res.authResponse) {
							auth = res.authResponse;
						} else {
							Notify.create({ message: t("auth.error.facebook") });
							auth = null;
						}
					},
					{ scope: "public_profile,email" },
				);
			}
		});
		if (auth != null) {
			// eslint-disable-next-line no-undef
			await authStore.loginWithFacebook((auth as fb.AuthResponse).userID, (auth as fb.AuthResponse).accessToken);
			appStore.login = false;
		}
	}
</script>
