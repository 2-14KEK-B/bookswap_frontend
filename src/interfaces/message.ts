interface MessageContent {
	_id?: string;
	sender_id: string;
	time?: Date;
	content: string;
}

interface Message {
	_id?: string;
	users: string[];
	message_contents: MessageContent[];
}

interface CreateMessage {
	from_id: string;
	to_id: string;
	content: string;
}

export { Message, MessageContent, CreateMessage };
