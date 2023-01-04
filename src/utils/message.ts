import type { Message } from "@interfaces/message";
import type { User } from "@interfaces/user";

export function setInfoFromOtherUser(message: Message, loggedInId: string) {
	const otherUser = (message.users as User[]).find((user): User | undefined => {
		if (user._id != loggedInId) {
			// console.log("otherUser: ", user._id);
			user.displayName = user.fullname || user.username || user.email;
			return user;
		}
	});
	return { ...message, otherUser: otherUser };
}
