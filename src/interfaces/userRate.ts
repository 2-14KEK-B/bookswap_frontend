interface UserRate {
	_id?: string;
	createdAt: Date;
	from: string;
	to: string;
	borrow: string;
	rate: boolean;
	comment?: string;
}

interface CreateUserRate {
	comment?: string;
	rate: boolean;
}

interface ModifyUserRate {
	comment?: string;
	rate?: boolean;
}

export { UserRate, CreateUserRate, ModifyUserRate };
