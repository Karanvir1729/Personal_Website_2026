import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

export const Resume: React.FC = () => {
    return (
        <div className="h-full bg-[#333] flex flex-col">
            <div className="bg-[#222] p-2 flex items-center justify-between border-b border-white/10">
                <span className="text-white/80 text-sm px-2">karan_resume.pdf</span>
                <div className="flex gap-2">
                    <a href="/resume.pdf" download className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
                        <Download size={16} />
                    </a>
                    <a href="/resume.pdf" target="_blank" className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
            <iframe
                src="/resume.pdf"
                className="flex-1 w-full h-full border-none bg-white"
                title="Resume"
            />
        </div>
    );
};
