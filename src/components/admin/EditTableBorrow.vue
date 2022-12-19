<template>
	<q-dialog v-model="isOpen" class="q-pa-md" persistent @hide="emits('close', isOpen)">
		<q-card class="q-pa-md" style="min-width: 400px">
			<q-card-section>
				<q-toolbar-title class="flex justify-between">
					Book Editing
					<q-btn v-close-popup no-caps icon="mdi-close" color="red" />
				</q-toolbar-title>
			</q-card-section>
			<q-card-section>
				<q-form class="q-gutter-y-md" @submit.prevent="editBorrow" @reset="reset">
					<q-toggle v-model="borrowData.verified" label="available?" clearable />
					<div class="flex">
						<q-btn type="reset" label="reset" />
						<q-space />
						<q-btn type="submit" color="secondary">Edit</q-btn>
					</div>
				</q-form>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
    import { Borrow, ModifyBorrow } from "@interfaces/borrow";
	import { ref } from "vue";
	import { useBorrowStore } from "@stores/borrow";


	const props = defineProps<{ edit: boolean; borrow: Borrow }>();
	const isOpen = ref(props.edit);
	const emits = defineEmits<{ (event: "close", state: boolean): void }>();
	const borrowStore = useBorrowStore();


	const borrowData = ref<ModifyBorrow>({
		verified: props.borrow.verified,
	});
	async function editBorrow() {
		await borrowStore.editBorrow(borrowData.value, props.borrow._id as string);
		emits("close", isOpen.value);
	}
	function reset() {
		borrowData.value = {
			verified: props.borrow.verified
		}
	}
</script>

<style scoped></style>
