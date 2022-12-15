interface LoginCred {
	emailOrUsername: string;
	password: string;
}
interface RegisterCred {
	email: string;
	password: string;
	username?: string;
	fullname?: string;
	locale?: string;
	picture?: string;
}

export { LoginCred, RegisterCred };
