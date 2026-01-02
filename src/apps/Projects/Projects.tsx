import React, { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import content from '../../data/content.json';
import { motion } from 'framer-motion';

export const Projects: React.FC = () => {
    const projects = content.projects;
    const [filter, setFilter] = useState('All');

    // Extract unique tags/tech for filters if we want? simplified categories for now.
    // Given PRD: "hackathon winners, game projects, automation, ML, optimization"
    // We can infer categories or just use 'All'.
    // Let's implement a simple search/filter.

    return (
        <div className="h-full bg-[#1e1e2e] text-[#cdd6f4] flex flex-col p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                {['All', 'Python', 'React', 'Optimization', 'Game'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${filter === f ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 hover:bg-white/10'}`}
                    >
                        {f}
                    </button>
                ))}
            // Ends the grid layout container for project cards
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.filter(p => filter === 'All' || p.tech.some(t => t.includes(filter)) || p.description.toLowerCase().includes(filter.toLowerCase())).map((p) => (
                        <motion.div
                            // Ensures proper list rendering and state stability for Framer Motion.
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-blue-400 mb-1">{p.title}</h3>
                                <p className="text-sm text-white/60 line-clamp-3">{p.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {p.tech.map(t => (
                                    <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">{t}</span>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-2 border-t border-white/5">
                                {p.links.repo && (
                                    <a href={p.links.repo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-white transition-colors">
                                        <Github size={14} /> Code
                                    </a>
                                )}
                                {p.links.demo && (
                                    <a href={p.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs hover:text-white transition-colors">
                                        <ExternalLink size={14} /> Live
                                    </a>
                                )}
                                {(!p.links.repo && !p.links.demo) && (
                                    <span className="text-xs text-white/30 italic">Not public yet</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
