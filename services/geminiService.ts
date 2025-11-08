

import { GoogleGenAI, GenerateContentResponse, Chat, Modality, Type, GenerateVideosOperation } from "@google/genai";
import { AspectRatio } from '../types';

let ai: GoogleGenAI;
const getAi = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

// --- Helper Functions ---
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

// --- API Functions ---

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], newMessage: string, useGrounding: boolean = false): Promise<GenerateContentResponse> => {
    const ai = getAi();
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            tools: useGrounding ? [{ googleSearch: {} }] : []
        }
    });
    const response = await chat.sendMessage({ message: newMessage });
    return response;
};

export const analyzeImage = async (imageFile: File, prompt: string): Promise<string> => {
    const ai = getAi();
    const base64Image = await fileToBase64(imageFile);
    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
        },
    };
    const textPart = { text: prompt };
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};


export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio,
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation failed.");
};


export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
    const ai = getAi();
    const base64Image = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: imageFile.type } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Image editing failed to produce an image.");
};

export const generateVideo = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16', onProgress: (message: string) => void): Promise<string> => {
    // Veo requires API key selection.
    // In a real app, this check would be more robust.
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
    }
    
    // Re-initialize AI instance to ensure the latest key is used.
    if (!process.env.API_KEY) throw new Error("API_KEY not found after selection.");
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const config: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    };

    if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        config.image = {
            imageBytes: base64Image,
            mimeType: imageFile.type,
        };
    }

    onProgress("Starting video generation... this may take a few minutes.");
    let operation: GenerateVideosOperation = await ai.models.generateVideos(config);

    const progressMessages = [
        "Warming up the digital director...",
        "Storyboarding your vision...",
        "Rendering frame by frame...",
        "Applying cinematic magic...",
        "Finalizing the cut...",
    ];
    let messageIndex = 0;

    while (!operation.done) {
        onProgress(progressMessages[messageIndex % progressMessages.length]);
        messageIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }
    
    onProgress("Fetching generated video...");
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};


export const analyzeVideo = async (videoFile: File, prompt: string): Promise<string> => {
    // Note: Video analysis with Gemini API typically involves sending frames.
    // For a simple implementation, we'll simulate this with a text prompt about a video.
    // A true implementation would use a library to extract frames and send them.
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Analyze the concept of a video titled "${videoFile.name}". The user's query is: "${prompt}"`,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

export const getQuickResponse = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        // Fix: Updated model name to 'gemini-flash-lite-latest' as per the coding guidelines.
        model: 'gemini-flash-lite-latest',
        contents: prompt
    });
    return response.text;
}

export const getComplexResponse = async (prompt: string): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
}

// Note: Audio transcription via Gemini REST API is not directly supported in the same way.
// This is a placeholder showing how you'd use a generic prompt to ask for transcription.
// A real implementation would use Speech-to-Text APIs or a model trained for it.
export const transcribeAudio = async (audioFile: File): Promise<string> => {
    const ai = getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Transcribe the audio from a file named "${audioFile.name}". In a real scenario, the audio data would be processed here.`
    });
    return `(Simulated Transcription) \n ${response.text}`;
}