import { defineStore } from "pinia";
import $axios from "@api/axios";
import { handle } from "@utils/error";
import { ModifyBorrow } from "@interfaces/borrow";

export const useBorrowStore = defineStore("borrow", () => {

	async function deleteBorrow(id: string) {
		return $axios.delete(`/borrow/${id}`).then(async (res) => {
            console.log(res.status)
        })
        .catch(handle)
	}
	async function editBorrow(borrow: ModifyBorrow,id: string) {
		return $axios.patch(`/borrow/${id}`,{...borrow}).then(async (res) => {
            console.log(res.status)
        })
        .catch(handle)
	}


    return{
        deleteBorrow,
        editBorrow,
    }
});
