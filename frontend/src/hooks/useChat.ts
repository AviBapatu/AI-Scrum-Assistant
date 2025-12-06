import { useState } from "react";
import type { ChatMessage } from "../types/chat.types";

const CHAT_API_URL = "http://localhost:2000/api/v1/scrum/chat";

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text: string) => {
        // Optimistic append
        const userMessage: ChatMessage = { role: "user", text };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authorization token found.");
            }

            const response = await fetch(CHAT_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data = await response.json();

            // Append AI reply
            if (data.reply) {
                const aiMessage: ChatMessage = { role: "ai", text: data.reply, meta: data };
                setMessages((prev) => [...prev, aiMessage]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            // Optional: Add error message to chat
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "I couldn't process that request. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        sendMessage,
    };
};
