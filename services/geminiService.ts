
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from '../types';

export const API_KEY_ERROR_MESSAGE = "API_KEY_INVALID";

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return apiKey;
};

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove "data:image/jpeg;base64,"
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const generateLogoImage = async (prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A modern, professional company logo for a company. The logo should be clean, iconic, and memorable. Design aesthetic: ${prompt}. The logo should be on a solid, neutral background.`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("No image was generated.");
    }
};

export const generateLogoVideo = async (prompt: string, imageBase64: string, aspectRatio: AspectRatio): Promise<string> => {
    // Create a new instance every time to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const downloadLink = operation.response.generatedVideos[0].video.uri;
            const videoResponse = await fetch(`${downloadLink}&key=${getApiKey()}`);
            if (!videoResponse.ok) {
                throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
            }
            const videoBlob = await videoResponse.blob();
            return URL.createObjectURL(videoBlob);
        } else {
            throw new Error("Video generation completed, but no video URI was found.");
        }
    } catch(e: any) {
        if (e.message?.includes('Requested entity was not found')) {
            throw new Error(API_KEY_ERROR_MESSAGE);
        }
        throw e;
    }
};
