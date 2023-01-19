import { defineStore } from "pinia";
import $axios from "@api/axios";
import { Loading } from "quasar";
import { useBookStore } from "@stores/book";
import { getOverallRate } from "@utils/bookHelper";
import type { Book } from "@interfaces/book";
import type { BookRate, CreateBookRate, ModifyBookRate } from "@interfaces/bookRate";

export const useBookRateStore = defineStore("bookRate", () => {
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
			const bookStore = useBookStore();
			const { data } = await $axios.post<Book>(`/book/${id}/rate`, bookRateData);
			bookStore.openedBook = data;
			bookStore.openedBook.overallRate = getOverallRate(bookStore.openedBook.rates);
			bookStore.openedBook.loggedInAlreadyRated = true;
		} catch (error) {
			return;
		}
	}

	async function editBookRate(bookId: string, rateId: string, bookRateData: ModifyBookRate) {
		try {
			Loading.show();
			const bookStore = useBookStore();
			const { data } = await $axios.patch<Book>(`/book/${bookId}/rate/${rateId}`, bookRateData);
			bookStore.openedBook = { ...data, loggedInAlreadyRated: true };
			bookStore.openedBook.overallRate = getOverallRate(bookStore.openedBook.rates);
		} catch (error) {
			return;
		}
	}

	async function deleteBookRate(bookId: string, rateId: string) {
		try {
			Loading.show();
			const bookStore = useBookStore();
			const { status } = await $axios.delete(`/book/${bookId}/rate/${rateId}`);
			if (status == 204 && bookStore.openedBook?.rates) {
				bookStore.openedBook.rates = (bookStore.openedBook?.rates as BookRate[])?.filter((r) => {
					if (r._id != rateId) {
						return true;
					}
				});
				bookStore.openedBook.overallRate = getOverallRate(bookStore.openedBook.rates);
				bookStore.openedBook.loggedInAlreadyRated = false;
			}
		} catch (error) {
			return;
		}
	}

	async function adminEditBookRate(bookId: string, rateId: string, bookRateData: ModifyBookRate) {
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
