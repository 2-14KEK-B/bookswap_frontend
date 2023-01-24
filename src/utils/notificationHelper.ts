import socket from "@api/socket";
import { useUserStore } from "@stores/user";
import type { docType, notiType, Notification } from "@interfaces/notification";
import { getDisplayName } from "./userHelper";
import type { User } from "@interfaces/user";
import { useI18n } from "vue-i18n";

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

function createReadableNotification(notification: Notification) {
	const { t } = useI18n({ useScope: "global" });
	let finalString = `${getDisplayName(notification.from as Partial<User>)}`;
	switch (notification.doc_type) {
		case "borrow":
			switch (notification.noti_type) {
				case "create":
					finalString += ` ${t("notification.borrowRequest", { type: t("notification.created") })}`;
					break;
				case "delete":
					finalString += ` ${t("notification.borrowRequest", { type: t("notification.deleted") })}`;
					break;
				case "update":
					finalString += ` ${t("notification.borrowRequest", { type: t("notification.updated") })}`;
					break;
				case "verify":
					finalString += ` ${t("notification.borrowRequest", { type: t("notification.verified") })}`;
					break;
			}
			break;
		case "lend":
			switch (notification.noti_type) {
				case "create":
					finalString += ` ${t("notification.lendRequest", { type: t("notification.created") })}`;
					break;
				case "delete":
					finalString += ` ${t("notification.lendRequest", { type: t("notification.deleted") })}`;
					break;
				case "update":
					finalString += ` ${t("notification.lendRequest", { type: t("notification.updated") })}`;
					break;
				case "verify":
					finalString += ` ${t("notification.lendRequest", { type: t("notification.verified") })}`;
					break;
			}
			break;
		case "user_rate":
			switch (notification.noti_type) {
				case "create":
					finalString += ` ${t("notification.userRate", { type: t("notification.created") })}`;
					break;
				case "delete":
					finalString += ` ${t("notification.userRate", { type: t("notification.deleted") })}`;
					break;
				case "update":
					finalString += ` ${t("notification.userRate", { type: t("notification.updated") })}`;
					break;
			}
			break;
		default:
			break;
	}
	return finalString;
}

export { createNotification, createReadableNotification };
