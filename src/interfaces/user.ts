import type { Book } from "./book";
import type { Borrow } from "./borrow";
import type { Message } from "./message";

interface User {
	_id?: string;
	createdAt?: string;
	updatedAt?: string;
	username: string;
	fullname?: string;
	displayName?: string;
	email: string;
	email_is_verified?: boolean;
	password?: string;
	locale?: string;
	picture?: string;
	role?: string;
	books?: (Book | string)[];
	messages?: (Message | string)[];
	rated_books?: string[];
	user_rates?: string[];
	borrows?: (Borrow | string)[];
}

interface EditUser {
	username?: string;
	fullname?: string;
	picture?: string;
	email?: string;
}

export { User, EditUser };
