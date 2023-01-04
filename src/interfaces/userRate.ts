import type { Borrow } from "./borrow";
import type { User } from "./user";

interface UserRate {
	_id?: string;
	createdAt: Date;
	from: User | string;
	to: User | string;
	borrow: Borrow | string;
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
