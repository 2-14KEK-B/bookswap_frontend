import type { User } from "./user";

export type docType = "lend" | "borrow" | "user_rate";
export type notiType = "create" | "update" | "delete" | "verify";

interface Notification {
	_id?: string;
	createdAt: string;
	updatedAt: string;
	from: string | Partial<User>;
	doc_id: string;
	doc_type: docType;
	noti_type: notiType;
	seen: boolean;
}

interface CreateNotification {
	doc_id: string;
	doc_type: docType;
	not_type: notiType;
}

export { Notification, CreateNotification };
