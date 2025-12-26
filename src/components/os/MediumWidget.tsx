import { BookOpen, ExternalLink, Newspaper } from 'lucide-react';

export const MediumWidget = () => {
    return (
        <a
            href="https://medium.com/@prokaranvir"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 shadow-2xl transition-all hover:bg-black/50 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-white font-medium leading-tight">Medium</h3>
                        <p className="text-white/60 text-xs">Writing & Thoughts</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/50 ml-auto group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-1">
                    <h4 className="text-white font-semibold text-lg">@prokaranvir</h4>
                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Read Articles</span>
                    </div>
                </div>
            </div>
        </a>
    );
};
