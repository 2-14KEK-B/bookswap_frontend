import { User } from "@interfaces/user";
export default function getUserFromLocalStorage(): User | null {
	const user: User | null = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
	// console.log(user);
	return user;
}
