import { useUserStore } from "@stores/user";
import { Message } from "@interfaces/message";
import { User } from "@interfaces/user";

export function setInfoFromOtherUser(message: Message, sender?: User) {
	if (sender) return { ...message, otherUser: sender };

	const userStore = useUserStore();

	const otherUser = (message.users as User[]).find((user): User | undefined => {
		if (user._id != userStore.loggedInUser?._id) {
			user.displayName = user.fullname || user.username || user.email;
			return user;
		}
	});
	const updatedMessage: Message = { ...message, otherUser: otherUser };
	return updatedMessage;
}
