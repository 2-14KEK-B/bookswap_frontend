import { io, Socket } from "socket.io-client";
import API_URL from "../config/api_url";
import type { Message, MessageContent } from "@interfaces/message";

interface ServerToClientEvents {
	"recieve-msg-cnt": (data: MessageContent) => void;
	"recieve-new-msg": (data: Message) => void;
	"msg-sent": () => void;
}
interface ClientToServerEvents {
	"user-online": (userId: string) => void;
	"send-new-msg": (data: { to: string; message: Message }) => void;
	"send-msg-cnt": (data: { to: string; message: MessageContent }) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, { autoConnect: false });

export default socket;
