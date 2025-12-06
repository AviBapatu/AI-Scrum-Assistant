import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { StorySuggestion } from '../../types/prd.types';
import { TaskItem } from './TaskItem';

interface StoryItemProps {
    story: StorySuggestion;
    isSelected: boolean;
    isExpanded: boolean;
    selectionState: { [taskIndex: number]: boolean };
    onToggle: () => void;
    onToggleTask: (taskIndex: number) => void;
    onExpand: () => void;
}

export const StoryItem: React.FC<StoryItemProps> = ({
    story,
    isSelected,
    isExpanded,
    selectionState,
    onToggle,
    onToggleTask,
    onExpand
}) => {
    return (
        <div className="ml-4 mt-2">
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/5 transition-colors group">
                <button onClick={onExpand} className="p-0.5 hover:bg-white/10 rounded">
                    {isExpanded ?
                        <ChevronDown className="w-4 h-4 text-gray-400" /> :
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    }
                </button>

                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-gray-700"
                />

                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-1 rounded">STORY</span>
                        <span className="text-sm font-medium text-gray-200">{story.summary}</span>
                        <span className="text-xs text-gray-500">({story.story_points} pts)</span>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="ml-6 border-l-2 border-white/5 space-y-1 mt-1">
                    {story.sub_issues.map((task, idx) => (
                        <TaskItem
                            key={idx}
                            task={task}
                            isSelected={selectionState[idx] || false}
                            onToggle={() => onToggleTask(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
