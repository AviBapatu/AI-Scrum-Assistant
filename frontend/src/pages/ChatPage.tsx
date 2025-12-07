import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.ts";
import { useChatStore } from "../hooks/useChatSessions";
import { useChat } from "../hooks/useChat";
import ChatLayout from "../components/chat/ChatLayout";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInputBar from "../components/chat/ChatInputBar";

const ChatPage: React.FC = () => {
    const { sessionId: urlSessionId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const {
        sessions,
        activeSessionId,
        loadSessions,
        createSession,
        deleteSession,
        renameSession,
        setActiveSession,
    } = useChatStore();

    const { messages, isLoading: isMessagesLoading, isSending, sendMessage } = useChat(activeSessionId);

    // 1. Initial Load
    useEffect(() => {
        if (token) {
            loadSessions(token);
        }
    }, [token, loadSessions]);

    // 2. Sync URL -> Store
    useEffect(() => {
        if (urlSessionId && urlSessionId !== activeSessionId) {
            setActiveSession(urlSessionId);
        } else if (!urlSessionId && activeSessionId) {
            // If no URL param but we have active in store, sync store to null
            setActiveSession(null);
        }
    }, [urlSessionId, setActiveSession, activeSessionId]);

    // 3. Handlers
    const handleSelectSession = (id: string) => {
        setActiveSession(id);
        navigate(`/chat/${id}`);
    };

    const handleCreateSession = async () => {
        if (token) {
            const newId = await createSession(token);
            if (newId) {
                navigate(`/chat/${newId}`);
            }
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (token) await deleteSession(sessionId, token);
        if (sessionId === activeSessionId) {
            navigate("/chat");
        }
    };

    const handleRenameSession = async (sessionId: string, newTitle: string) => {
        if (token) await renameSession(sessionId, newTitle, token);
    };

    const activeSessionTitle = sessions.find((s) => s._id === activeSessionId)?.title || "Chat";

    return (
        <ChatLayout
            sidebar={
                <ChatSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectSession}
                    onCreateSession={handleCreateSession}
                    onDeleteSession={handleDeleteSession}
                    onRenameSession={handleRenameSession}
                />
            }
            chatArea={
                <>
                    <ChatHeader title={activeSessionTitle} />
                    {activeSessionId ? (
                        <>
                            <ChatMessages
                                messages={messages}
                                isLoading={isMessagesLoading}
                                isSending={isSending}
                            />
                            <ChatInputBar onSend={sendMessage} disabled={isSending} />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <p>Select a chat or start a new conversation.</p>
                            <button
                                onClick={handleCreateSession}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Start New Chat
                            </button>
                        </div>
                    )}
                </>
            }
        />
    );
};

export default ChatPage;
