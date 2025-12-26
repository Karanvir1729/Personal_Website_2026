import { Linkedin, ExternalLink, Briefcase } from 'lucide-react';

export const LinkedInWidget = () => {
    return (
        <a
            href="https://www.linkedin.com/in/karan-khanna-b7013b24b/"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#0077b5]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-72 shadow-2xl transition-all hover:bg-[#0077b5] group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Linkedin className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white p-2 rounded-lg">
                        <Linkedin className="w-6 h-6 text-[#0077b5] fill-[#0077b5]" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium leading-tight">LinkedIn</h3>
                        <p className="text-white/80 text-xs">Let's Connect</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/50 ml-auto group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-1">
                    <h4 className="text-white font-semibold text-lg">Karanvir Khanna</h4>
                    <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Software Engineer</span>
                    </div>
                </div>
            </div>
        </a>
    );
};
