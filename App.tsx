import React, { useState } from 'react';
import { Editor } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Button } from './components/Button';
import { AIActionType } from './types';
import { transformText } from './services/geminiService';

const App: React.FC = () => {
    const [documentContent, setDocumentContent] = useState<string>(
        `<h1>Creativity in the Age of Silicon</h1>
        <p>We often fear that machines will replace the artist. But looking back at history, every tool—from the paintbrush to the typewriter—has only expanded the canvas of human expression.</p>
        <br>
        <h3>The Role of the Muse</h3>
        <p>In ancient mythology, Muses didn't do the work for you; they whispered inspiration. They sparked the flame.</p>
        <br>
        <h3>The Collaborative Future</h3>
        <p>This document is a living prototype of that relationship. Don't think of AI as a generator, but as a resonator. It echoes your thoughts back to you, sometimes louder, sometimes clearer, sometimes in a completely different key.</p>
        <br>
        <p><i>(Highlight any text to let Muse refine it, or open the sidebar to discuss your ideas.)</i></p>`
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGlobalAI = async (action: AIActionType) => {
        setIsGenerating(true);
        try {
            if (action === AIActionType.CONTINUE_WRITING) {
                // Strip HTML for context
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = documentContent;
                const textContext = tempDiv.innerText;
                
                const continuation = await transformText("", AIActionType.CONTINUE_WRITING, textContext);
                // Append as new paragraph
                setDocumentContent(prev => prev + `<p>${continuation}</p>`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#f3f4f6] text-muse-900 font-sans overflow-hidden selection:bg-accent-light">
            
            <div className="flex-1 flex flex-col h-full relative z-0">
                
                {/* Header */}
                <header className="h-14 flex items-center justify-between px-6 z-30 shrink-0 bg-white text-muse-900 shadow-sm border-b border-muse-200">
                    <div className="flex items-center space-x-4">
                        <div className="grid place-items-center w-8 h-8 bg-muse-900 rounded-[4px]">
                            <span className="text-white font-serif font-bold text-xl leading-none">M</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-medium tracking-wide text-muse-900">Untitled Draft</h1>
                            <div className="flex gap-2 text-[10px] text-muse-500">
                                <span>File</span>
                                <span>Home</span>
                                <span>Insert</span>
                                <span>Layout</span>
                                <span>References</span>
                                <span>Review</span>
                                <span>View</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleGlobalAI(AIActionType.CONTINUE_WRITING)}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Muse is thinking...' : 'Continue Writing'}
                        </Button>
                        
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`p-2 rounded-full transition-all duration-300 ${isSidebarOpen ? 'bg-muse-100 text-muse-900' : 'hover:bg-muse-50 text-muse-600'}`}
                            title="Toggle Muse"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Editor Container */}
                <main className="flex-1 overflow-y-auto bg-[#e4e4e4] relative scroll-smooth p-8 flex justify-center">
                    <Editor 
                        content={documentContent} 
                        onContentChange={setDocumentContent}
                    />
                </main>

            </div>

            {/* Sidebar (Collapsible) */}
            <div 
                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                    isSidebarOpen ? 'w-[350px] translate-x-0 opacity-100 shadow-2xl' : 'w-0 translate-x-4 opacity-0 overflow-hidden'
                } relative z-20 bg-white border-l border-muse-200`}
            >
                <div className="w-[350px] h-full">
                    <Sidebar documentContent={documentContent} />
                </div>
            </div>

        </div>
    );
};

export default App;