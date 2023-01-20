import { defineStore } from "pinia";
import { ref } from "vue";
import { Loading } from "quasar";
import $axios from "@api/axios";
import type { Book, CreateBook, ModifyBook } from "@interfaces/book";
import type { PaginateResult, PathQuery } from "@interfaces/paginate";

export const useBookStore = defineStore("book", () => {
	const loggedInBooks = ref<Book[]>([]);
	const openedBook = ref<Book>();

	async function getLoggedInBooks() {
		try {
			Loading.show();
			const { data } = await $axios.get("/user/me/book");
			return data as Book[];
		} catch (error) {
			return;
		}
	}

	async function getBooks(path: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/book/${path}`);
			return data as PaginateResult<Book>;
		} catch (error) {
			return;
		}
	}

	async function getBookById(id: string) {
		try {
			Loading.show();
			const { data } = await $axios.get(`/book/${id}`);
			return data as Book;
		} catch (error) {
			return;
		}
	}

	async function createBook(userData: Partial<CreateBook>) {
		try {
			Loading.show();
			await $axios.post("/book", userData);
		} catch (error) {
			return;
		}
	}

	async function deleteBookById(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/book/${id}`);
		} catch (error) {
			return;
		}
	}

	async function editBookById(book: ModifyBook, id: string) {
		try {
			Loading.show();
			await $axios.patch(`/book/${id}`, book);
		} catch (error) {
			return;
		}
	}

	async function adminGetBooks(query: PathQuery = { skip: 0, limit: 10 }) {
		try {
			Loading.show();

			let path = `/admin/book?skip=${query.skip}&limit=${query.limit}`;
			if (query.sortBy) {
				path += `&sortBy=${query.sortBy}`;
			}
			if (query.keyword) {
				path += `&keyword=${query.keyword}`;
			}

			const { data } = await $axios.get(path);
			return data as PaginateResult<Book>;
		} catch (error) {
			return;
		}
	}

	async function adminDeleteBookById(id: string) {
		try {
			Loading.show();
			await $axios.delete(`/admin/book/${id}`);
		} catch (error) {
			return;
		}
	}

	async function adminEditBookById(book: ModifyBook, id?: string) {
		try {
			if (!id) return;
			Loading.show();
			await $axios.patch(`/admin/book/${id}`, book);
		} catch (error) {
			return;
		}
	}

	return {
		loggedInBooks,
		openedBook,
		getBooks,
		getLoggedInBooks,
		getBookById,
		createBook,
		deleteBookById,
		editBookById,
		adminGetBooks,
		adminDeleteBookById,
		adminEditBookById,
	};
});
