import React from "react";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

interface ChatHeaderProps {
    title: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
    const { workspace } = useWorkspaceStore();

    return (
        <header className="h-[60px] flex-shrink-0 border-b border-gray-200 flex items-center justify-between px-6 bg-white z-10">
            <div className="flex items-center gap-3">
                <h1 className="font-semibold text-gray-800 text-lg sm:text-lg truncate max-w-[200px] sm:max-w-md">
                    {title}
                </h1>
                {workspace && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {workspace.boardName}
                        {workspace.sprintName && ` · ${workspace.sprintName}`}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Ready
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
