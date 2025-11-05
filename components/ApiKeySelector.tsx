
import React from 'react';
import { KeyIcon, ExternalLinkIcon } from './Icons';

interface ApiKeySelectorProps {
    onSelectKey: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
    return (
        <div className="bg-gray-800 border border-cyan-500/30 rounded-lg p-6 text-center shadow-lg shadow-cyan-500/10">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-cyan-900/50 rounded-full">
                    <KeyIcon className="w-8 h-8 text-cyan-400" />
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">API Key Required for Video Generation</h2>
            <p className="text-gray-400 mb-6">
                To use the powerful Veo video generation model, you need to select an API key from your project.
            </p>
            <button
                onClick={onSelectKey}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300/50"
            >
                Select Your API Key
            </button>
            <div className="mt-4 text-sm text-gray-500">
                 <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 hover:text-cyan-400 underline"
                 >
                    Learn about billing <ExternalLinkIcon className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};
