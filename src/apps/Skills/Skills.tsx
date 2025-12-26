import React, { useState } from 'react';
import content from '../../data/content.json';
import { motion } from 'framer-motion';

export const Skills: React.FC = () => {
    const skills = content.skills;
    const [search, setSearch] = useState('');

    const categories = Object.keys(skills) as Array<keyof typeof skills>;

    return (
        <div className="h-full bg-[#1e1e2e] text-[#cdd6f4] p-6 overflow-hidden flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Skills Matrix</h1>

            <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-6 outline-none focus:border-blue-500 transition-colors"
                autoFocus
            />

            <div className="flex-1 overflow-auto custom-scrollbar space-y-8">
                {categories.map(cat => {
                    const catSkills = skills[cat];
                    const filtered = catSkills.filter(s => s.toLowerCase().includes(search.toLowerCase()));

                    if (filtered.length === 0 && search) return null;

                    return (
                        <div key={cat}>
                            <h3 className="text-lg font-bold text-blue-400 capitalize mb-3 border-b border-white/10 pb-1">{cat}</h3>
                            <div className="flex flex-wrap gap-3">
                                {filtered.map((skill, i) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm cursor-default hover:text-white transition-colors"
                                    >
                                        {skill}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
