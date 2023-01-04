import type { Book } from "./book";
import type { User } from "./user";
import type { UserRate } from "./userRate";

interface Borrow {
	_id?: string;
	createdAt: string;
	updatedAt: string;
	from: User | string;
	to: User | string;
	books: (Book | string)[];
	verified: boolean;
	user_rates?: (UserRate | string)[];
	__v?: number;
}

interface CreateBorrow {
	from: string;
	books: string[];
}

interface ModifyBorrow {
	verified?: boolean;
}

export { Borrow, CreateBorrow, ModifyBorrow };
