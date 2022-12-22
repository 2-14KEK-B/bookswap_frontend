import { Book } from "./book";

interface UserRating {
	_id?: string;
	from_id?: string;
	rating: boolean;
	comment?: string;
}

interface Borrow {
	_id?: string;
	createdAt: string;
	updatedAt: string;
	from_id: string;
	to_id: string;
	books: (Book | string)[];
	verified: boolean;
	user_ratings?: (UserRating | string)[];
}

interface CreateBorrow {
	from_id: string;
	books: string[];
}

interface ModifyBorrow {
	verified?: boolean;
}

export { Borrow, CreateBorrow, ModifyBorrow, UserRating };
