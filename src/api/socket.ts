import { io, Socket } from "socket.io-client";
import type { Message, MessageContent } from "@interfaces/message";
import type { docType, notiType } from "@interfaces/notification";

interface ServerToClientEvents {
	"recieve-msg-cnt": (message: MessageContent) => void;
	"recieve-new-msg": (message: Message) => void;
	"recieve-notification": (
		docId: string,
		docType: docType,
		notiType: notiType,
		from: { _id: string; email: string; username?: string; fullname?: string; picture?: string },
	) => void;
	"borrow-updated": () => void;
	"user-rate-updated": () => void;
	"msg-sent": () => void;
	"msg-seen": (userWhoSawId: string, messageId: string) => void;
}
interface ClientToServerEvents {
	"user-online": (userId: string) => void;
	"send-msg-cnt": (toId: string, message: MessageContent) => void;
	"send-new-msg": (toId: string, message: Message) => void;
	"send-notification": (
		toId: string,
		docId: string,
		docType: docType,
		notiType: notiType,
		from: { _id: string; email: string; username?: string; fullname?: string; picture?: string },
	) => void;
	"msg-seen": (userWhoSawId: string, toId: string, messageId: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	import.meta.env.VITE_API_URL || "http://localhost:3000",
	{ autoConnect: false },
);

export default socket;
