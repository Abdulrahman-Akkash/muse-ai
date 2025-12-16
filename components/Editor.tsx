import React, { useState, useRef, useEffect } from 'react';
import { SelectionState, AIActionType } from '../types';
import { FloatingMenu } from './FloatingMenu';
import { Toolbar, ToolAction } from './Toolbar';
import { transformText } from '../services/geminiService';

interface EditorProps {
    content: string;
    onContentChange: (newContent: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<SelectionState | null>(null);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState<{msg: string, type: 'info' | 'success' | 'error'} | null>(null);

    // Initial Content Load
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== content) {
            if (editorRef.current.innerHTML === "" || Math.abs(editorRef.current.innerHTML.length - content.length) > 20) {
                 editorRef.current.innerHTML = content;
            }
        }
    }, []); 

    const handleInput = () => {
        if (editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        handleInput();
        if (editorRef.current) {
            // Re-focus logic if needed, usually direct clicks on toolbar buttons that preventDefault don't steal focus
            // But we ensure it just in case
            editorRef.current.focus();
        }
    };

    const handleToolbarAction = (action: ToolAction, value?: string) => {
        if (action === 'formatBlock') {
            if (value?.startsWith('fontName:')) {
                const fontName = value.split(':')[1];
                execCmd('fontName', fontName);
            } else if (value?.startsWith('fontSize:')) {
                const fontSize = value.split(':')[1];
                execCmd('fontSize', fontSize);
            } else {
                execCmd('formatBlock', value);
            }
        } else if (action === 'createLink') {
            const url = prompt('Enter the link URL:', 'https://');
            if (url) execCmd('createLink', url);
        } else if (action === 'strike') {
             execCmd('strikethrough');
        } else {
            execCmd(action, value);
        }
    };

    // --- Selection & AI ---

    const handleSelect = () => {
        const selectionObj = window.getSelection();
        if (!selectionObj || selectionObj.isCollapsed) {
            setSelection(null);
            setMenuPos(null);
            return;
        }

        // Only show floating menu if selection is within our editor
        if (editorRef.current && !editorRef.current.contains(selectionObj.anchorNode)) {
             setSelection(null);
             setMenuPos(null);
             return;
        }

        const text = selectionObj.toString();
        if (text.trim().length > 0) {
            const range = selectionObj.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            setSelection({ start: 0, end: 0, text });
            setMenuPos({
                top: rect.top + window.scrollY,
                left: rect.left + rect.width / 2
            });
        }
    };

    const performAIAction = async (action: AIActionType) => {
        if (!selection || isProcessing) return;

        setIsProcessing(true);
        setMenuPos(null);
        setToast({ msg: 'Muse is crafting...', type: 'info' });

        try {
            const transformedText = await transformText(selection.text, action, editorRef.current?.innerText || "");
            
            // Replace text in the editor
            document.execCommand('insertText', false, transformedText);
            
            setToast({ msg: 'Refined', type: 'success' });
            setSelection(null);
        } catch (error) {
            setToast({ msg: 'Connection interrupted', type: 'error' });
        } finally {
            setIsProcessing(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="relative w-full flex flex-col items-center h-full">
            
            <Toolbar onAction={handleToolbarAction} />

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-xs font-medium tracking-wide shadow-lg z-50 flex items-center animate-in slide-in-from-top-4 fade-in duration-300 border ${
                    toast.type === 'error' ? 'bg-red-50 text-red-900 border-red-100' : 'bg-muse-900 text-white border-muse-900'
                }`}>
                    {isProcessing && <div className="w-2.5 h-2.5 rounded-full border border-white/30 border-t-white animate-spin mr-2"></div>}
                    {toast.msg}
                </div>
            )}

            {/* A4 Paper Surface */}
            <div className="flex-1 bg-white shadow-xl shadow-stone-200/50 rounded-sm my-6 relative flex flex-col w-[794px] min-h-[1123px] border border-stone-100 transition-all duration-300 overflow-hidden">
                
                {/* Paper Header Margin */}
                <div className="h-24 w-full bg-transparent shrink-0"></div>
                
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onMouseUp={handleSelect}
                    onKeyUp={handleSelect}
                    className="flex-1 w-full outline-none px-24 text-lg leading-relaxed text-muse-900 font-serif selection:bg-accent-light selection:text-accent empty:before:content-['Start_writing...'] empty:before:text-muse-300 empty:before:italic"
                    spellCheck={false}
                />
                
                {/* Footer Margin */}
                <div className="h-24 w-full shrink-0 flex items-center justify-between px-24 text-[10px] uppercase tracking-widest text-muse-300 font-medium">
                    <span>Muse AI 1.0</span>
                    {/* Basic word count for HTML content */}
                    <span className="tabular-nums">
                        {content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length} words
                    </span>
                </div>

                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    </div>
                )}
            </div>

            <FloatingMenu 
                position={menuPos} 
                onAction={performAIAction} 
            />
        </div>
    );
};