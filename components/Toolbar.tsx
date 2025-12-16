import React from 'react';

export type ToolAction = 
    | 'undo' | 'redo' 
    | 'bold' | 'italic' | 'strike' | 'underline'
    | 'formatBlock'
    | 'insertUnorderedList' | 'insertOrderedList' 
    | 'createLink' | 'insertHorizontalRule'
    | 'justifyLeft' | 'justifyCenter' | 'justifyRight'
    | 'indent' | 'outdent';

interface ToolbarProps {
    onAction: (action: ToolAction, value?: string) => void;
}

const Divider = () => <div className="w-px h-5 bg-muse-200 mx-1 self-center" />;

const ToolButton: React.FC<{ 
    onClick: () => void; 
    title: string; 
    icon?: React.ReactNode; 
    label?: string;
    active?: boolean;
    className?: string; 
}> = ({ onClick, title, icon, label, active, className = "" }) => (
    <button 
        onClick={(e) => {
            e.preventDefault(); // Prevent focus loss
            onClick();
        }}
        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
        className={`p-1.5 rounded-md transition-all duration-200 flex items-center justify-center min-w-[28px] ${
            active 
            ? 'bg-muse-200 text-muse-900' 
            : 'text-muse-600 hover:bg-muse-100 hover:text-muse-900'
        } ${className}`}
        title={title}
    >
        {icon}
        {label && <span className={`text-xs font-semibold ${icon ? 'ml-1' : ''}`}>{label}</span>}
    </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => {
    return (
        <div className="flex items-center gap-1 p-2 bg-white border-b border-muse-200 sticky top-0 z-40 mx-auto mt-0 w-full shadow-sm justify-between px-6 overflow-x-auto no-scrollbar select-none">
            
            <div className="flex items-center gap-1">
                {/* History */}
                <div className="flex items-center gap-0.5 mr-1">
                    <ToolButton 
                        onClick={() => onAction('undo')} 
                        title="Undo (Ctrl+Z)" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        }
                    />
                    <ToolButton 
                        onClick={() => onAction('redo')} 
                        title="Redo (Ctrl+Y)" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        }
                    />
                </div>

                <Divider />

                {/* Typography */}
                <div className="flex items-center gap-2 px-1">
                    <select 
                        onChange={(e) => onAction('formatBlock', 'fontName:' + e.target.value)}
                        className="bg-transparent text-xs font-medium text-muse-900 focus:outline-none cursor-pointer hover:bg-muse-50 rounded px-2 py-1.5 transition-colors border-none ring-0 w-32"
                        defaultValue="Instrument Serif"
                    >
                        <option value="Instrument Serif">Instrument Serif</option>
                        <option value="Inter">Inter Sans</option>
                        <option value="monospace">Monospace</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>

                    <div className="flex items-center bg-muse-50 rounded-md border border-muse-200 p-0.5">
                        <select 
                             onChange={(e) => onAction('formatBlock', 'fontSize:' + e.target.value)}
                             className="bg-transparent text-[10px] w-12 text-center font-medium text-muse-700 focus:outline-none cursor-pointer"
                             defaultValue="3"
                        >
                            <option value="1">10</option>
                            <option value="2">13</option>
                            <option value="3">16</option>
                            <option value="4">18</option>
                            <option value="5">24</option>
                            <option value="6">32</option>
                            <option value="7">48</option>
                        </select>
                    </div>
                </div>

                <Divider />

                {/* Text Styles */}
                <div className="flex items-center gap-0.5">
                    <ToolButton 
                        onClick={() => onAction('bold')} 
                        title="Bold (Cmd+B)" 
                        label="B" 
                        className="font-bold font-serif"
                    />
                    <ToolButton 
                        onClick={() => onAction('italic')} 
                        title="Italic (Cmd+I)" 
                        label="I" 
                        className="italic font-serif"
                    />
                     <ToolButton 
                        onClick={() => onAction('underline')} 
                        title="Underline (Cmd+U)" 
                        label="U" 
                        className="underline font-serif"
                    />
                    <ToolButton 
                        onClick={() => onAction('strike')} 
                        title="Strikethrough" 
                        label="S" 
                        className="line-through font-serif"
                    />
                </div>

                <Divider />

                {/* Headings */}
                <div className="flex items-center gap-0.5">
                    <ToolButton onClick={() => onAction('formatBlock', 'H1')} title="Heading 1" label="H1" />
                    <ToolButton onClick={() => onAction('formatBlock', 'H2')} title="Heading 2" label="H2" />
                    <ToolButton onClick={() => onAction('formatBlock', 'P')} title="Normal Text" label="P" />
                </div>

                <Divider />

                {/* Lists & Alignment */}
                <div className="flex items-center gap-0.5">
                     <ToolButton 
                        onClick={() => onAction('justifyLeft')} 
                        title="Align Left" 
                        icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>}
                    />
                     <ToolButton 
                        onClick={() => onAction('justifyCenter')} 
                        title="Align Center" 
                        icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
                    />
                    <ToolButton 
                        onClick={() => onAction('justifyRight')} 
                        title="Align Right" 
                        icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>}
                    />
                    <div className="w-px h-3 bg-muse-200 mx-0.5 self-center"></div>
                    <ToolButton 
                        onClick={() => onAction('insertUnorderedList')} 
                        title="Bullet List" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        }
                    />
                    <ToolButton 
                        onClick={() => onAction('insertOrderedList')} 
                        title="Ordered List" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01" /></svg>
                        }
                    />
                     <div className="w-px h-3 bg-muse-200 mx-0.5 self-center"></div>
                    <ToolButton 
                        onClick={() => onAction('outdent')} 
                        title="Decrease Indent" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        }
                    />
                    <ToolButton 
                        onClick={() => onAction('indent')} 
                        title="Increase Indent" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        }
                    />
                </div>

                <Divider />

                {/* Inserts */}
                <div className="flex items-center gap-0.5">
                    <ToolButton 
                        onClick={() => onAction('createLink')} 
                        title="Insert Link" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        }
                    />
                     <ToolButton 
                        onClick={() => onAction('insertHorizontalRule')} 
                        title="Horizontal Rule" 
                        icon={
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>
    );
};