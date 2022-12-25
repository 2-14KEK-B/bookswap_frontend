<template>
	<q-dialog v-model="isOpen" persistent @hide="emits('close', isOpen)">
		<q-card class="q-pa-md" style="min-width: 400px">
			<q-card-section>
				<q-toolbar-title class="flex justify-between">
					{{ title }} Editing
					<q-btn v-close-popup no-caps :icon="mdiClose" color="red" />
				</q-toolbar-title>
			</q-card-section>
			<q-card-section>
				<q-form class="q-gutter-y-md" @submit.prevent="emits('edit')" @reset="emits('reset')">
					<slot></slot>
					<div class="flex">
						<q-btn type="reset" flat label="Reset" />
						<q-space />
						<q-btn type="submit" color="secondary">Edit</q-btn>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { ref } from "vue";
	import { mdiClose } from "@quasar/extras/mdi-v7";

	const props = defineProps<{ title: string; edit: boolean }>();
	const isOpen = ref(props.edit);
	const emits = defineEmits<{ (e: "close", isOpen: boolean): void; (e: "reset"): void; (e: "edit"): void }>();
</script>

<style scoped></style>
