import type { User } from "./user";

interface BookRate {
	_id: string;
	from: User | string;
	comment?: string;
	rate: number;
}

interface CreateBookRate {
	rate: number;
	comment?: string;
}

interface ModifyBookRate {
	rate?: number;
	comment?: string;
}

export { BookRate, CreateBookRate, ModifyBookRate };
