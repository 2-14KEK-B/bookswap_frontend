interface PaginateResult<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	page?: number | undefined;
	totalPages: number;
	offset: number;
	prevPage?: number | null | undefined;
	nextPage?: number | null | undefined;
	pagingCounter: number;
	meta?: any;
	[customLabel: string]: T[] | number | boolean | null | undefined;
}

interface PathQuery {
	skip?: number;
	limit?: number;
	sort?: "asc" | "desc";
	sortBy?: string;
	keyword?: string;
}

export { PaginateResult, PathQuery };
