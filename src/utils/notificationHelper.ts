import socket from "@api/socket";
import { useUserStore } from "@stores/user";
import type { docType, notiType } from "@interfaces/notification";

function createNotification(to: string, docId: string, docType: docType, notiType: notiType) {
	const userStore = useUserStore();
	const loggedInUser = userStore.loggedInUser;
	if (loggedInUser) {
		const { _id, email, fullname, username, picture } = loggedInUser;
		socket.emit("send-notification", to, docId, docType, notiType, {
			_id: _id as string,
			email: email,
			fullname: fullname,
			username: username,
			picture: picture,
		});
	}
}

export { createNotification };
