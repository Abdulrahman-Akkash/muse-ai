import React from 'react';
import { AIActionType } from '../types';

interface FloatingMenuProps {
    position: { top: number; left: number } | null;
    onAction: (action: AIActionType) => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ position, onAction }) => {
    if (!position) return null;

    const actions = [
        { type: AIActionType.FIX_GRAMMAR, label: 'Refine', icon: '✨' },
        { type: AIActionType.TONE_PROFESSIONAL, label: 'Formal', icon: '👔' },
        { type: AIActionType.TONE_CASUAL, label: 'Casual', icon: '☕' },
        { type: AIActionType.EXPAND, label: 'Expand', icon: '📝' },
        { type: AIActionType.SUMMARIZE, label: 'Shorten', icon: '✂️' },
    ];

    return (
        <div 
            className="fixed z-50 animate-in fade-in zoom-in-95 duration-200 ease-out"
            style={{ 
                top: position.top - 55,
                left: position.left,
                transform: 'translate(-50%, -100%)'
            }}
        >
            <div className="flex items-center p-1.5 bg-muse-900 text-muse-50 rounded-lg shadow-xl border border-muse-800">
                <div className="flex items-center px-3 border-r border-muse-700 mr-1">
                    <span className="font-serif italic text-lg text-accent">M</span>
                </div>
                
                <div className="flex items-center gap-0.5">
                    {actions.map((action) => (
                        <button
                            key={action.type}
                            onClick={() => onAction(action.type)}
                            className="flex items-center px-3 py-1.5 rounded hover:bg-white/10 transition-colors text-xs font-medium group"
                        >
                            <span className="mr-2 text-sm text-muse-300 group-hover:text-white transition-colors">{action.icon}</span>
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-muse-900 rotate-45"></div>
        </div>
    );
};