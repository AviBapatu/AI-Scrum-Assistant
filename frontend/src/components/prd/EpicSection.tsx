import React from 'react';
import { ChevronRight, ChevronDown, Layers } from 'lucide-react';
import type { EpicSuggestion } from '../../types/prd.types';
import { StoryItem } from './StoryItem';

interface EpicSectionProps {
    epic: EpicSuggestion;
    epicIndex: number;
    isSelected: boolean;
    isExpanded: boolean;
    selectionState: {
        stories: {
            [storyIndex: number]: {
                selected: boolean;
                tasks: { [taskIndex: number]: boolean };
            }
        }
    };
    expandedState: { [id: string]: boolean };
    onToggle: () => void;
    onToggleStory: (storyIndex: number) => void;
    onToggleTask: (storyIndex: number, taskIndex: number) => void;
    onExpand: (id: string) => void;
}

export const EpicSection: React.FC<EpicSectionProps> = ({
    epic,
    epicIndex,
    isSelected,
    isExpanded,
    selectionState,
    expandedState,
    onToggle,
    onToggleStory,
    onToggleTask,
    onExpand
}) => {
    return (
        <div className="border border-white/10 rounded-lg bg-gray-900/50 mb-4 overflow-hidden">
            <div className="flex items-center space-x-3 p-4 bg-white/5 border-b border-white/5">
                <button
                    onClick={() => onExpand(`epic-${epicIndex}`)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    {isExpanded ?
                        <ChevronDown className="w-5 h-5 text-gray-400" /> :
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    }
                </button>

                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-5 h-5 rounded border-gray-600 text-green-500 focus:ring-green-500 bg-gray-700"
                />

                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-green-400" />
                        <h3 className="text-sm font-semibold text-gray-100">{epic.title}</h3>
                    </div>
                </div>

                <span className="text-xs text-gray-500 px-2 bg-black/20 rounded">
                    {epic.issues.length} stories
                </span>
            </div>

            {isExpanded && (
                <div className="p-2 bg-black/20">
                    {epic.issues.map((story, storyIdx) => (
                        <StoryItem
                            key={storyIdx}
                            story={story}
                            isSelected={selectionState.stories[storyIdx]?.selected || false}
                            isExpanded={expandedState[`story-${epicIndex}-${storyIdx}`] || false}
                            selectionState={selectionState.stories[storyIdx]?.tasks || {}}
                            onToggle={() => onToggleStory(storyIdx)}
                            onToggleTask={(taskIdx) => onToggleTask(storyIdx, taskIdx)}
                            onExpand={() => onExpand(`story-${epicIndex}-${storyIdx}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
