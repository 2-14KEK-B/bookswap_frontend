import { User } from "./user";

interface MessagesToChat {
	_id: string;
	user: User;
	contents: MessageContent[];
}

interface MessageContent {
	_id?: string;
	sender_id: string;
	createdAt?: Date;
	content: string;
}

interface Message {
	_id?: string;
	users: (User | string)[];
	otherUser?: User;
	message_contents: MessageContent[];
}

interface CreateMessage {
	from_id: string;
	to_id: string;
	content: string;
}

export { Message, MessageContent, CreateMessage, MessagesToChat };
