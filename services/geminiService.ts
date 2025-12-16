import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AIActionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Using the Flash model for low latency interactive editing
const MODEL_TEXT = 'gemini-2.5-flash';

export const transformText = async (
    text: string, 
    action: AIActionType, 
    context: string = ""
): Promise<string> => {
    if (!apiKey) throw new Error("API Key is missing");

    let prompt = "";

    switch (action) {
        case AIActionType.SUMMARIZE:
            prompt = `Distill the essence of this text, keeping it impactful but concise: "${text}"`;
            break;
        case AIActionType.EXPAND:
            prompt = `Enrich the following text. Add depth, nuance, and relevant details while maintaining the author's voice: "${text}"`;
            break;
        case AIActionType.FIX_GRAMMAR:
            prompt = `Polish the following text for grammar and flow. Ensure it reads naturally: "${text}"`;
            break;
        case AIActionType.TONE_PROFESSIONAL:
            prompt = `Elevate the tone of this text to be professional, sophisticated, and clear: "${text}"`;
            break;
        case AIActionType.TONE_CASUAL:
            prompt = `Relax the tone of this text. Make it warm, personal, and easy to relate to: "${text}"`;
            break;
        case AIActionType.GENERATE_TABLE:
            prompt = `Structure the following information into a clear Markdown table: "${text}"`;
            break;
        case AIActionType.CONTINUE_WRITING:
            prompt = `Pick up the thread of thought and continue writing. (Context: ${context.substring(0, 500)}...) Text to continue: "${text}"`;
            break;
        default:
            prompt = `Improve the following text: "${text}"`;
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: {
                systemInstruction: "You are Muse, a sophisticated AI writing partner. Your goal is to help the user articulate their thoughts with clarity and style. Return ONLY the transformed text.",
            }
        });
        
        return response.text || text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const streamChatWithDocument = async function* (
    history: { role: 'user' | 'model', text: string }[],
    message: string,
    documentContext: string
) {
    if (!apiKey) throw new Error("API Key is missing");

    const chat: Chat = ai.chats.create({
        model: MODEL_TEXT,
        config: {
            systemInstruction: `You are Muse, a creative collaborator.
            
            CONTEXT:
            You have access to the user's draft:
            """
            ${documentContext.substring(0, 15000)}
            """
            
            ROLE:
            Act as an editor, a critic, and a muse. Ask thought-provoking questions. Offer alternative perspectives.
            
            STYLE:
            Elegant, supportive, and concise. Use Markdown.`,
        },
        history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });

    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            yield c.text;
        }
    }
};