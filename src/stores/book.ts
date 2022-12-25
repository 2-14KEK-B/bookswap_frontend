import { defineStore } from "pinia";
import $axios from "@api/axios";
import { CreateBook, Book, ModifyBook } from "@interfaces/book";
import { AxiosResponse } from "axios";
import { handle } from "@utils/error";

export const useBookStore = defineStore("book", () => {
	function handleBookSuccess(res: AxiosResponse) {
		const book: Book = res.data;
		localStorage.setItem("book", JSON.stringify(book));
	}

	async function createBook(userData: CreateBook) {
		return $axios
			.post("/book", userData)
			.then(async (res) => {
				handleBookSuccess(res);
			})
			.catch(handle);
	}

	async function deleteBook(id: string) {
		return $axios
			.delete(`/book/${id}`)
			.then(async (res) => {
				console.log(res.status);
			})
			.catch(handle);
	}

	async function edit(book: ModifyBook, id: string) {
		return $axios
			.patch(`/book/${id}`, book)
			.then(async (res) => {
				console.log(res.status);
			})
			.catch(handle);
	}

	return {
		createBook,
		deleteBook,
		edit,
	};
});
