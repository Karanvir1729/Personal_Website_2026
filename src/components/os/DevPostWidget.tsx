import { Code2, ExternalLink, Trophy } from 'lucide-react';

export const DevPostWidget = () => {
    return (
        <a
            href="https://devpost.com/prokaranvir?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-[#003E54] to-[#002633] backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 shadow-2xl transition-all hover:scale-[1.02] group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Code2 className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#003E54] border border-white/20 p-2 rounded-lg">
                        <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium leading-tight">DevPost</h3>
                        <p className="text-white/60 text-xs">Hackathon Portfolio</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/50 ml-auto group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-1">
                    <h4 className="text-white font-semibold text-lg">prokaranvir</h4>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span>View Projects & Wins</span>
                    </div>
                </div>
            </div>
        </a>
    );
};
