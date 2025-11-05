
import React, { useState, useEffect } from 'react';
import type { AspectRatio } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { VideoCameraIcon, FilmIcon } from './Icons';

interface VideoAnimatorProps {
    logoImage: string;
    prompt: string;
    setPrompt: (value: string) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (value: AspectRatio) => void;
    onAnimate: () => void;
    isLoading: boolean;
    generatedVideoUrl: string | null;
}

const loadingMessages = [
    "Warming up the digital cameras...",
    "Choreographing pixels...",
    "Rendering the final cut...",
    "Adding a touch of cinematic magic...",
    "This can take a few minutes, good things come to those who wait!",
];

export const VideoAnimator: React.FC<VideoAnimatorProps> = ({ logoImage, prompt, setPrompt, aspectRatio, setAspectRatio, onAnimate, isLoading, generatedVideoUrl }) => {
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        // FIX: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout.
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setCurrentMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <section>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mt-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-cyan-400">Step 2:</span> Animate Your Logo</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className="mb-4">
                            <label htmlFor="animation-prompt" className="block text-sm font-medium text-gray-300 mb-2">Animation instructions (optional):</label>
                            <textarea
                                id="animation-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A fast-paced zoom out with lens flare effects."
                                rows={3}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio:</label>
                            <div className="flex gap-4">
                                {(['16:9', '9:16'] as AspectRatio[]).map((ratio) => (
                                    <label key={ratio} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="aspect-ratio"
                                            value={ratio}
                                            checked={aspectRatio === ratio}
                                            onChange={() => setAspectRatio(ratio)}
                                            className="form-radio h-4 w-4 text-cyan-600 bg-gray-700 border-gray-500 focus:ring-cyan-500"
                                            disabled={isLoading}
                                        />
                                        <span className={`px-3 py-1 rounded-md text-sm ${aspectRatio === ratio ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                            {ratio} ({ratio === '16:9' ? 'Landscape' : 'Portrait'})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={onAnimate}
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><LoadingSpinner /> Animating...</> : <><VideoCameraIcon className="w-5 h-5" /> Animate Logo</>}
                        </button>
                    </div>
                    <div className="md:w-1/3 flex items-center justify-center">
                         <div className={`relative w-full overflow-hidden bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'}`}>
                            {isLoading && (
                                <div className="text-center text-gray-400 p-4">
                                    <LoadingSpinner size="lg" />
                                    <p className="mt-4 font-semibold">{currentMessage}</p>
                                </div>
                            )}
                            {!isLoading && generatedVideoUrl && (
                                <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                            )}
                            {!isLoading && !generatedVideoUrl && (
                                <div className="text-center text-gray-500">
                                    <FilmIcon className="w-12 h-12 mx-auto mb-2" />
                                    <p>Your video will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
