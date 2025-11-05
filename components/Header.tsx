
import React from 'react';
import { FilmIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
                <FilmIcon className="w-10 h-10 text-cyan-400" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    AI Logo Animator
                </h1>
            </div>
            <p className="text-lg text-gray-400">
                Design a logo with words, then bring it to life with video.
            </p>
        </header>
    );
};
