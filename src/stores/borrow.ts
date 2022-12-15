import { defineStore } from "pinia";
import $axios from "@api/axios";
import { AxiosResponse } from "axios";
import { handle } from "@utils/error";

export const useBorrowStore = defineStore("borrow", () => {

	async function deleteBorrow(id: string) {
		return $axios.delete(`/borrows/${id}`).then(async (res) => {
            console.log(res.status)
        })
        .catch(handle)
	}

    return{
        deleteBorrow
    }
});
