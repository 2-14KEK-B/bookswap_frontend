import { Book } from "./book";
import { Borrow } from "./borrow";
import { Message } from "./message";

interface User {
	_id?: string;
	created_on?: Date;
	updated_on?: Date;
	username: string;
	fullname: string;
	email: string;
	email_is_verified?: boolean;
	password: string;
	locale?: string;
	picture?: string;
	role?: string;
	books: (Book | string)[];
	messages: (Message | string)[];
	user_ratings: string[];
	borrows: (Borrow | string)[];
}

interface EditUser {
	username?: string;
	fullname?: string;
	picture?: string;
}

export { User };
export { EditUser };
