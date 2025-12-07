import { useState, useEffect, useCallback } from "react";
import type { ChatMessage, SendMessageResponse } from "../types/chat.types";
import { useAuthStore } from "../store/useAuthStore.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const useChat = (sessionId: string | null) => {
    const { token } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load messages when sessionId changes
    useEffect(() => {
        if (!sessionId || !token) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_BASE_URL}/scrum/chat/${sessionId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load messages");
                const data = await res.json();
                setMessages(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [sessionId, token]);

    const sendMessage = useCallback(async (content: string) => {
        if (!sessionId || !token || !content.trim()) return;

        // Optimistic update
        const tempId = Date.now().toString();
        const optimisticMsg: ChatMessage = {
            _id: tempId,
            sessionId,
            role: "user",
            content,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setIsSending(true);

        try {
            const res = await fetch(`${API_BASE_URL}/scrum/chat/${sessionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: content }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data: SendMessageResponse = await res.json();

            // Replace optimistic message with real one and add assistant response
            setMessages((prev) =>
                prev.map(m => m._id === tempId ? data.userMessage : m).concat(data.assistantMessage)
            );

        } catch (err: any) {
            console.error(err);
            setError("Failed to send message");
            // Remove optimistic message on failure
            setMessages((prev) => prev.filter(m => m._id !== tempId));
        } finally {
            setIsSending(false);
        }
    }, [sessionId, token]);

    return {
        messages,
        isLoading,
        isSending,
        error,
        sendMessage,
    };
};
