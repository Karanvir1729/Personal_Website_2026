import React from 'react';
import content from '../../data/content.json';

export const About: React.FC = () => {
    return (
        <div className="h-full bg-[#1e1e2e] text-[#cdd6f4] p-8 overflow-auto custom-scrollbar flex flex-col gap-6 items-center text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4">
                {content.profile.name.charAt(0)}
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {content.profile.name}
            </h1>

            <p className="text-xl text-white/80 max-w-lg">
                {content.profile.headline}
            </p>

            <div className="bg-white/5 rounded-xl p-6 max-w-2xl text-left border border-white/10 mt-4 space-y-4">
                <p className="leading-relaxed text-white/70">
                    I go by <strong className="text-white">Karan</strong> and am pursuing a Computer Science Specialist with a minor in Mathematics, graduating in April 2026, with a focus on building scalable, production-grade systems.
                </p>
                <p className="leading-relaxed text-white/70">
                    I spent 16 months at <strong className="text-white">IPPINKA</strong> (2024-2025), where I built and owned backend systems supporting thousands of SKUs, including a{' '}
                    <a href="https://github.com/Karanvir1729/scip/blob/master/D__Build_PO__Technical_Documentation.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        procurement optimization engine
                    </a>{' '}
                    using SCIP and mixed-integer optimization. I also worked at <strong className="text-white">KPMG</strong> for 4 months in 2023, developing AI and data governance prototypes.
                </p>
                <p className="leading-relaxed text-white/70">
                    Outside of industry work, I've pursued research and project-based learning through hackathons and independent projects, including winning <strong className="text-white">Hack the North</strong> with{' '}
                    <a href="https://tarazoo.shop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        tarazoo.shop
                    </a>
                    , releasing a{' '}
                    <a href="https://karanvir1729.itch.io/tormented-by-lights" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        24-hour game
                    </a>
                    , and authoring a{' '}
                    <a href="https://github.com/Karanvir1729/MatriodResearch/blob/main/matroidReserchPaper.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        research paper in matroid theory
                    </a>
                    .
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-4">
                <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-2">Education</h3>
                    <p className="text-sm text-white/60">{content.education[0].school}</p>
                    <p className="text-sm text-white/60">{content.education[0].degree}</p>
                    <p className="text-xs text-white/40 mt-1">{content.education[0].graduation}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-2">Contact</h3>
                    <p className="text-sm text-white/60">{content.profile.email}</p>
                    <div className="flex gap-4 justify-center mt-3">
                        <a href={content.profile.links.github} target="_blank" className="hover:text-blue-400 transition-colors">GitHub</a>
                        <a href={content.profile.links.linkedin} target="_blank" className="hover:text-blue-400 transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
