import { Message, MessageContent } from "@interfaces/message";
import { User } from "@interfaces/user";
import { io, Socket } from "socket.io-client";
import API_URL from "../config/api_url";

interface SocketMessage {
	from: string;
	to: string;
	message: string;
}

interface ServerToClientEvents {
	"msg-recieved": (data: Message | MessageContent) => void;
}
interface ClientToServerEvents {
	"user-online": (userId: string) => void;
	"send-msg": (data: SocketMessage, sender?: Partial<User>) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, { autoConnect: false });

export default socket;
