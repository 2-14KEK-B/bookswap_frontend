import { io, Socket } from "socket.io-client";
import API_URL from "../config/api_url";
import type { Message, MessageContent } from "@interfaces/message";

interface ServerToClientEvents {
	"recieve-msg-cnt": (message: MessageContent) => void;
	"recieve-new-msg": (message: Message) => void;
	"msg-sent": () => void;
	"msg-seen": (userWhoSawId: string, messageId: string) => void;
}
interface ClientToServerEvents {
	"user-online": (userId: string) => void;
	"send-msg-cnt": (toId: string, message: MessageContent) => void;
	"send-new-msg": (toId: string, message: Message) => void;
	"msg-seen": (userWhoSawId: string, toId: string, messageId: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, { autoConnect: false });

export default socket;
