import { FileText, Download, ExternalLink } from 'lucide-react';

export const ResumeWidget = () => {
    return (
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 w-full h-full shadow-2xl transition-all hover:bg-black/50 group flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">Resume</h3>
                        <p className="text-white/50 text-xs">Karanvir Khanna</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <a
                        href="/resume.pdf"
                        download
                        className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                        title="Download Resume"
                    >
                        <Download className="w-4 h-4" />
                    </a>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                        title="Open in New Tab"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* PDF Preview */}
            <div className="flex-1 bg-white/5">
                <iframe
                    src="/resume.pdf#toolbar=0&navpanes=0"
                    className="w-full h-full border-none"
                    title="Resume Preview"
                />
            </div>
        </div>
    );
};
