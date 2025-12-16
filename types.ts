export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export enum AIActionType {
    SUMMARIZE = 'Summarize',
    EXPAND = 'Expand',
    FIX_GRAMMAR = 'Fix Grammar',
    TONE_PROFESSIONAL = 'Make Professional',
    TONE_CASUAL = 'Make Casual',
    GENERATE_TABLE = 'Generate Table',
    CONTINUE_WRITING = 'Continue Writing'
}

export interface SelectionState {
    start: number;
    end: number;
    text: string;
}

export interface AIState {
    isProcessing: boolean;
    error: string | null;
    suggestion: string | null;
}