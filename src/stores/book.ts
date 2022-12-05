import { defineStore } from "pinia";
import $axios from "@api/axios";
import { CreateBook, Book } from "@interfaces/book";
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
				// const user: User = res.data;
				// console.log(res);
				// localStorage.setItem("user", JSON.stringify(user));
				// loggedInUser.value = user;
				// $axios.get("test").then((res) => console.log("test: ", res));
			})
			.catch(handle);
	}
	return {
		createBook,
	};
});
