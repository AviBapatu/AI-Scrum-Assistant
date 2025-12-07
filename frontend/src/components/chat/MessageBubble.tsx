import React from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/chat.types";

interface MessageBubbleProps {
    message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === "user";

    return (
        <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}>
            <div
                className={`relative max-w-[85%] md:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm
        ${isUser
                        ? "bg-[#111827] text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"
                    }`}
            >
                {!isUser ? (
                    <div className="markdown-body">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
