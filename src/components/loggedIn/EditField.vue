<template>
	<div class="main-row row justify-between items-center" style="min-width: 280px">
		<q-input v-model="newData" :label="label" :class="canModify ? 'col-8' : 'col-12'" :readonly="!modifyData" />
		<span v-if="canModify">
			<span v-if="!modifyData" class="col-auto flex-center">
				<q-btn class="small-button q-py-none" :label="modifyButtonLabel" no-caps @click="modifyData = true" />
			</span>
			<span v-else class="col-auto">
				<span class="row" style="margin-bottom: 5px">
					<q-btn class="small-button q-py-none" :label="$t('button.send')" @click="updateData" />
				</span>
				<span class="row">
					<q-btn class="small-button q-py-none" :label="$t('button.reset')" @click="reset" />
				</span>
			</span>
		</span>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, readonly, toRef, type Ref } from "vue";
	import type { EditUser } from "@interfaces/user";

	const props = defineProps<{
		data?: string;
		field: keyof EditUser;
		label: string;
		modifyButtonLabel: string;
		canModify: boolean;
	}>();

	const newData = ref<string>("");
	let defaultData = readonly(ref(""));
	const modifyData = ref(false);

	function updateData() {
		if (isValid()) {
			emits("update", newData.value, props.field);
			modifyData.value = false;
		}
	}

	function isValid() {
		const length = newData.value.length;
		if (props.field == "email") {
			return length >= 8 && length <= 64;
		} else if (props.field == "fullname") {
			return length >= 2 && length <= 64;
		} else if (props.field == "password") {
			return length >= 8 && length <= 64;
		} else if (props.field == "username") {
			return length >= 6 && length <= 32;
		}
		return false;
	}

	function reset() {
		newData.value = defaultData.value;
		modifyData.value = false;
	}

	const emits = defineEmits<{ (e: "update", newData: string, field: keyof EditUser): void }>();

	onMounted(() => {
		if (props.data) {
			newData.value = props.data;
			defaultData = readonly(toRef(props, "data") as Ref<string>);
		}
	});
</script>

<style scoped>
	.modify-button {
		height: 30px;
		width: 150px;
	}
	.small-button {
		width: 100px;
	}
	.cancel-button {
		height: 30px;
		width: 80px;
	}
	.main-row {
		height: 80px;
	}
</style>
