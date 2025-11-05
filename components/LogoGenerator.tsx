import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ImageIcon, SparklesIcon, UploadIcon } from './Icons';

interface LogoGeneratorProps {
    description: string;
    setDescription: (value: string) => void;
    onGenerate: () => void;
    onUpload: (file: File) => void;
    isLoading: boolean;
    generatedImage: string | null;
}

export const LogoGenerator: React.FC<LogoGeneratorProps> = ({ description, setDescription, onGenerate, onUpload, isLoading, generatedImage }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
            // Reset file input value to allow re-uploading the same file
            e.target.value = '';
        }
    };

    return (
        <section className="mb-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><span className="text-cyan-400">Step 1:</span> Provide Your Logo</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label htmlFor="logo-description" className="block text-sm font-medium text-gray-300 mb-2">Describe your company to generate a logo:</label>
                        <textarea
                            id="logo-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., A tech startup called 'Orbit' that needs a minimalist logo with a planet and a swoosh."
                            rows={4}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={onGenerate}
                            disabled={isLoading}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><LoadingSpinner /> Generating...</> : <><SparklesIcon className="w-5 h-5" /> Generate Logo</>}
                        </button>
                        
                        <div className="relative flex py-3 items-center">
                            <div className="flex-grow border-t border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-600"></div>
                        </div>

                        <input
                            type="file"
                            id="logo-upload"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="logo-upload"
                            className={`w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <UploadIcon className="w-5 h-5" /> Upload Your Logo
                        </label>
                        <p className="text-xs text-gray-500 mt-2 text-center">PNG or JPG, up to 4MB.</p>

                    </div>
                    <div className="md:w-1/3 flex items-center justify-center">
                        <div className="w-56 h-56 bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                            {isLoading && <LoadingSpinner size="lg" />}
                            {!isLoading && generatedImage && (
                                <img src={`data:image/png;base64,${generatedImage}`} alt="Generated Logo" className="object-contain w-full h-full p-2 rounded-lg" />
                            )}
                            {!isLoading && !generatedImage && (
                                <div className="text-center text-gray-500">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                    <p>Your logo will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};