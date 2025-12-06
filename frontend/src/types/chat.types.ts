export interface ChatMessage {
    role: "user" | "ai";
    text: string;
    meta?: any; // For future use (e.g., issues, intent)
}
