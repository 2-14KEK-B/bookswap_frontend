<template>
	<q-dialog v-model="isOpen" persistent @hide="emits('close', isOpen)">
		<q-card class="q-pa-md" style="min-width: 400px">
			<q-card-section>
				<q-toolbar-title class="flex justify-between">
					User Editing
					<q-btn v-close-popup no-caps icon="mdi-close" color="red" />
				</q-toolbar-title>
			</q-card-section>
			<q-card-section>
				<q-form class="q-gutter-y-md" @submit.prevent="editUser" @reset="reset">
					<q-input v-model="userData.username" label="Username" clearable />
					<q-input v-model="userData.fullname" label="Fullname" clearable />
					<q-input v-model="userData.picture" label="Picture" clearable />
					<q-input v-model="userData.email" label="Email" clearable />
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
	import { useUserStore } from "@stores/user";
	// import { useRouter } from "vue-router";
	import { User } from "@interfaces/user";

	const props = defineProps<{ edit: boolean; user: User }>();
	const isOpen = ref(props.edit);
	const emits = defineEmits<{ (event: "close", state: boolean): void }>();
	const userStore = useUserStore();
	// const router = useRouter();

	interface ModifiableData {
		username?: string;
		fullname?: string;
		picture?: string;
		email?: string;
	}

	const userData = ref<ModifiableData>({
		username: props.user.username || "",
		fullname: props.user.fullname || "",
		picture: props.user.picture || "",
		email: props.user.email || "",
	});
	async function editUser() {
		await userStore.edit(userData.value, props.user._id);
		emits("close", isOpen.value);
	}

	function reset() {
		userData.value = {
			email: props.user.email || "",
			fullname: props.user.fullname || "",
			picture: props.user.fullname || "",
			username: props.user.username || "",
		};
	}
</script>

<style scoped></style>
