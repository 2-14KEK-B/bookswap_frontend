import { defineStore } from "pinia";
import $axios from "@api/axios";
import { Loading } from "quasar";
import { BookRate, CreateBookRate, ModifyBookRate } from "@interfaces/bookRate";

export const useBookStore = defineStore("bookRate", () => {
	async function getBookRatesByBookId(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/book/${id}/rate`);
			return data as BookRate[];
		} catch (error) {
			return;
		}
	}

	async function createBookRateByBookId(id: string, bookRateData: CreateBookRate) {
		try {
			Loading.show();
			const { data } = await $axios.post(`/book/${id}/rate`, bookRateData);
			return data as BookRate;
		} catch (error) {
			return;
		}
	}

	async function editBookRate(bookRateData: ModifyBookRate, bookId: string, rateId: string) {
		try {
			Loading.show();
			await $axios.patch(`/book/${bookId}/rate/${rateId}`, bookRateData);
		} catch (error) {
			return;
		}
	}

	async function deleteBookRate(bookId: string, rateId: string) {
		try {
			Loading.show();
			await $axios.delete(`/book/${bookId}/rate/${rateId}`);
		} catch (error) {
			return;
		}
	}

	async function adminEditBookRate(bookRateData: ModifyBookRate, bookId: string, rateId: string) {
		try {
			Loading.show();
			await $axios.patch(`/admin/book/${bookId}/rate/${rateId}`, bookRateData);
		} catch (error) {
			return;
		}
	}

	async function adminDeleteBookRate(bookId: string, rateId: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/book/${bookId}/rate/${rateId}`);
		} catch (error) {
			return;
		}
	}

	return {
		getBookRatesByBookId,
		createBookRateByBookId,
		deleteBookRate,
		editBookRate,
		adminDeleteBookRate,
		adminEditBookRate,
	};
});
