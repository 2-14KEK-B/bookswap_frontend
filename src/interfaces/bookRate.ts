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

export type { BookRate, CreateBookRate, ModifyBookRate };
