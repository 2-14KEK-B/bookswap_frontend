import type { User } from "./user";

interface MessagesToChat {
	_id: string;
	user: User;
	contents: MessageContent[];
	totalCount?: number;
}

interface MessageContent {
	_id?: string;
	sender_id: string;
	createdAt?: string;
	content: string;
	seen: boolean;
}

interface Message {
	_id?: string;
	createdAt?: string;
	updatedAt?: string;
	users: (User | string)[];
	otherUser?: User;
	message_contents: MessageContent[];
	totalCount?: number;
	seenByLoggedInUser?: boolean;
}

interface CreateMessage {
	from_id: string;
	to_id: string;
	content: string;
}

export type { Message, MessageContent, CreateMessage, MessagesToChat };
