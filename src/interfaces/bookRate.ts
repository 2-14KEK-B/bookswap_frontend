interface BookRate {
	_id: string;
	from: string;
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
