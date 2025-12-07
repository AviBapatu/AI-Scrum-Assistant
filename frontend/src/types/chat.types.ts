export interface ChatSession {
    _id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface ChatMessage {
    _id: string;
    sessionId: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export interface CreateSessionResponse {
    _id: string;
    title: string;
}

export interface SendMessageResponse {
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
}
