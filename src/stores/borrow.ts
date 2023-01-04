import { defineStore } from "pinia";
import $axios from "@api/axios";
import { ModifyBorrow } from "@interfaces/borrow";

export const useBorrowStore = defineStore("borrow", () => {
	async function deleteById(id: string) {
		try {
			const { status, data } = await $axios.delete(`/borrow/${id}`);
			if (status < 400) {
				console.log("deleted");
			} else {
				console.log(`not deleted: ${data}`);
			}
		} catch (error) {
			console.log(error);
		}
	}
	async function editById(borrow: ModifyBorrow, id?: string) {
		try {
			const { status, data } = await $axios.patch(`/borrow/${id}`, { ...borrow });
			if (status < 400) {
				console.log("edited");
			} else {
				console.log(`not edited: ${data}`);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function sendBorrow(userid: string, bookid: string) {
		try {
			await $axios.post('/borrow', {from_id:userid, books:[bookid]})
		} catch (error) {
			console.log(error);
		}
	}
	
	return {
		deleteById,
		editById,
		sendBorrow,
	};
});
