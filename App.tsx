import React, { useState, useCallback, useEffect } from 'react';
import { generateLogoImage, generateLogoVideo, API_KEY_ERROR_MESSAGE, fileToBase64 } from './services/geminiService';
import type { AspectRatio } from './types';
import { LogoGenerator } from './components/LogoGenerator';
import { VideoAnimator } from './components/VideoAnimator';
import { ApiKeySelector } from './components/ApiKeySelector';
import { Header } from './components/Header';

const App: React.FC = () => {
    const [logoDescription, setLogoDescription] = useState<string>('');
    const [animationPrompt, setAnimationPrompt] = useState<string>('An epic, cinematic reveal of this logo, with dramatic lighting.');
    const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    
    const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
    const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isKeyReady, setIsKeyReady] = useState(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeyReady(hasKey);
            } else {
                // Fallback for environments where aistudio is not available
                console.warn('AI Studio context not found. Assuming API key is set in environment.');
                setIsKeyReady(true);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            // Optimistically set to true to avoid race condition
            setIsKeyReady(true);
        }
    };

    const handleGenerateLogo = useCallback(async () => {
        if (!logoDescription.trim()) {
            setError('Please enter a description for your logo.');
            return;
        }
        setError(null);
        setIsLoadingImage(true);
        setGeneratedLogo(null);
        setGeneratedVideoUrl(null);

        try {
            const imageB64 = await generateLogoImage(logoDescription);
            setGeneratedLogo(imageB64);
        } catch (e: any) {
            console.error(e);
            setError('Failed to generate logo. Please try again.');
        } finally {
            setIsLoadingImage(false);
        }
    }, [logoDescription]);

    const handleUploadLogo = useCallback(async (file: File) => {
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) { // 4MB limit for Veo
            setError('Image file is too large. Please upload an image smaller than 4MB.');
            return;
        }

        setError(null);
        setIsLoadingImage(true);
        setGeneratedLogo(null);
        setGeneratedVideoUrl(null);
        
        try {
            const imageB64 = await fileToBase64(file);
            setGeneratedLogo(imageB64);
        } catch (e: any) {
            console.error(e);
            setError('Failed to process uploaded image. Please try again.');
        } finally {
            setIsLoadingImage(false);
        }
    }, []);

    const handleAnimateLogo = useCallback(async () => {
        if (!generatedLogo) {
            setError('Please generate or upload a logo first.');
            return;
        }
        setError(null);
        setIsLoadingVideo(true);
        setGeneratedVideoUrl(null);

        try {
            const videoUrl = await generateLogoVideo(animationPrompt, generatedLogo, aspectRatio);
            setGeneratedVideoUrl(videoUrl);
        } catch (e: any) {
            console.error(e);
            if(e.message === API_KEY_ERROR_MESSAGE) {
                setError('API Key is invalid. Please select a valid API key to generate videos.');
                setIsKeyReady(false);
            } else {
                setError('Failed to generate video. Please try again.');
            }
        } finally {
            setIsLoadingVideo(false);
        }
    }, [generatedLogo, animationPrompt, aspectRatio]);
    
    const mainContent = (
        <>
            <LogoGenerator
                description={logoDescription}
                setDescription={setLogoDescription}
                onGenerate={handleGenerateLogo}
                onUpload={handleUploadLogo}
                isLoading={isLoadingImage}
                generatedImage={generatedLogo}
            />
            {generatedLogo && (
                <VideoAnimator
                    logoImage={generatedLogo}
                    prompt={animationPrompt}
                    setPrompt={setAnimationPrompt}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    onAnimate={handleAnimateLogo}
                    isLoading={isLoadingVideo}
                    generatedVideoUrl={generatedVideoUrl}
                />
            )}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Header />
                {error && (
                    <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                {isKeyReady ? mainContent : <ApiKeySelector onSelectKey={handleSelectKey} />}

                <footer className="text-center mt-12 text-gray-500">
                    <p>Powered by Gemini</p>
                </footer>
            </main>
        </div>
    );
};

export default App;