import { User } from "@interfaces/user";
export default function getUserFromLocalStorage(): User | null {
	return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
}
