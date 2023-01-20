<template>
	<q-dialog v-model="isOpen" persistent @hide="emits('close', isOpen)">
		<q-card class="q-pa-md" style="min-width: 400px">
			<q-card-section>
				<q-toolbar-title class="flex justify-between">
					{{ t("editing", { title: title }) }}
					<q-btn v-close-popup no-caps :icon="mdiClose" color="red" />
				</q-toolbar-title>
			</q-card-section>
			<q-card-section>
				<q-form class="q-gutter-y-md" @submit.prevent="emits('edit')" @reset="emits('reset')">
					<div class="flex">
						<q-btn type="reset" flat :label="$t('button.reset')" />
						<q-space />
						<q-btn type="submit" color="secondary">{{ $t("button.edit") }}</q-btn>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { useI18n } from "vue-i18n";
	import { mdiClose } from "@quasar/extras/mdi-v7";

	const { t } = useI18n({
		messages: {
			en: {
				editing: "Editing a {title}",
			},
			hu: {
				editing: "Egy {title} módosítása",
			},
		},
	});
	const props = defineProps<{ title: string; edit: boolean }>();
	const isOpen = ref(props.edit);
	const emits = defineEmits<{ (e: "close", isOpen: boolean): void; (e: "reset"): void; (e: "edit"): void }>();
</script>

<style scoped></style>
