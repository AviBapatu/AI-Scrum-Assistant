import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../../types/chat.types";

interface ChatMessagesProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isSending: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading, isSending }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending]);

    if (isLoading && messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="animate-pulse">Loading conversation...</div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-800">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-4">
            <div className="max-w-3xl mx-auto flex flex-col">
                {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} />
                ))}

                {isSending && (
                    <div className="flex justify-start mb-6">
                        <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                            <div className="flex space-x-1.5 h-4 items-center">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ChatMessages;
