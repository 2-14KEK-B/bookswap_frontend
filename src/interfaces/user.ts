import type { Book } from "./book";
import type { Borrow } from "./borrow";
import type { Message } from "./message";
import type { UserRate } from "./userRate";
import type { Notification } from "./notification";

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
	user_rates?: { from: (UserRate | string)[]; to: (UserRate | string)[] };
	borrows?: (Borrow | string)[];
	notifications: Notification[];
}

interface EditUser {
	username?: string;
	email?: string;
	fullname?: string;
	picture?: string;
	password?: string;
}

export { User, EditUser };
