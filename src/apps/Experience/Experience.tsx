import React from 'react';
import content from '../../data/content.json';
import { Briefcase, Calendar } from 'lucide-react';

export const Experience: React.FC = () => {
    return (
        <div className="h-full bg-[#1e1e2e] text-[#cdd6f4] flex flex-col p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Briefcase className="text-yellow-400" />
                Experience
            </h1>

            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/10" />

                <div className="space-y-8 pl-10 pr-2 pb-10">
                    {content.experience.map((exp) => (
                        <div key={exp.id} className="relative">
                            <div className="absolute -left-[2.1rem] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#1e1e2e]" />

                            <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                                        <span className="text-blue-400 font-medium">{exp.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/50 bg-white/5 px-2 py-1 rounded w-fit">
                                        <Calendar size={14} />
                                        {exp.duration}
                                    </div>
                                </div>

                                <p className="text-white/70 mb-4">{exp.description}</p>

                                <ul className="space-y-2 mb-4">
                                    {exp.bullets.map((b, i) => (
                                        <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 bg-white/50 rounded-full flex-shrink-0" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-2">
                                    {exp.tech.map(t => (
                                        <span key={t} className="text-xs border border-white/10 px-2 py-1 rounded text-white/50">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
