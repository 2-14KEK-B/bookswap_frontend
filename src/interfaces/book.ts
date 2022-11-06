interface BookRating {
	_id: string;
	from_id: string;
	comment?: string;
	rating: number;
}

interface Book {
	_id?: string;
	created_on?: Date;
	updated_on?: Date;
	author: string;
	title: string;
	picture: string;
	category: string[];
	price?: number;
	available?: boolean;
	for_borrow: boolean;
	ratings?: (BookRating | string)[];
	__v?: number;
}

interface CreateBook {
	author: string;
	title: string;
	picture: string;
	category: string[];
	price?: number;
	for_borrow: boolean;
}

interface ModifyBook {
	author?: string;
	title?: string;
	picture?: string;
	category?: string[];
	price?: number;
	for_borrow?: boolean;
	available?: boolean;
	ratings?: (BookRating | string)[];
}

export { Book, BookRating, CreateBook, ModifyBook };
