<template>
	<q-dialog v-model="isOpen" persistent @hide="emits('close', isOpen)">
		<q-card>
			<q-form @submit.prevent="editUser" @reset="reset">
				<q-input v-model="userData.username" label="Username" clearable />
				<q-input v-model="userData.fullname" label="Fullname" clearable />
				<q-input v-model="userData.picture" label="Picture" clearable />
				<q-input v-model="userData.email" label="Email" clearable />
				<q-btn type="submit">Edit</q-btn>
			</q-form>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
	import { onMounted, ref } from "vue";
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
	let defaultValue: ModifiableData;

	const userData = ref<ModifiableData>({
		username: props.user.username || "",
		fullname: props.user.fullname || "",
		picture: props.user.picture || "",
		email: props.user.email || "",
	});
	async function editUser() {
		// let dataToSend: ModifiableData = {};
		// Object.keys(userData.value).forEach((x: string | keyof ModifiableData) => {
		// 	if (userData.value[x as keyof ModifiableData] != defaultValue[x as keyof ModifiableData]) {
		// 		dataToSend[x as keyof ModifiableData] = userData.value[x as keyof ModifiableData];
		// 	}
		// 	console.log(userData.value[x as keyof ModifiableData], defaultValue[x as keyof ModifiableData]);
		// });
		await userStore.edit(userData.value, props.user._id);
		emits("close", isOpen.value);
		// if (Object.keys(userData.value).length > 0) {
		// 	await router.push("/me");
		// }
	}

	function reset() {
		userData.value = defaultValue;
	}

	onMounted(() => {
		defaultValue = {
			username: userData.value.username || "",
			fullname: userData.value.fullname || "",
			picture: userData.value.picture || "",
			email: userData.value.email || "",
		};
	});
</script>

<style scoped></style>
