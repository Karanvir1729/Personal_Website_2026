import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, ArrowUp, Search } from 'lucide-react';
import { resolvePath, listDir, getNode } from '../../utils/fs';
import { useOSStore } from '../../store/useOSStore';

export const Explorer: React.FC = () => {
    const [currentPath, setCurrentPath] = useState('/home/karan');
    const [history, setHistory] = useState<string[]>(['/home/karan']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const { launchApp } = useOSStore();

    const items = listDir(currentPath) || [];

    const handleNavigate = (path: string) => {
        const newPath = resolvePath(path, currentPath);
        const node = getNode(newPath);

        if (node?.type === 'dir') {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newPath);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
            setCurrentPath(newPath);
        } else if (node?.type === 'file') {
            // Open file
            // Simple interaction: if .json, maybe open a viewer?
            // For now, launch a generic Text Viewer or specific app
            if (path.endsWith('.pdf')) {
                launchApp('resume', <div className="p-4">PDF Viewer Placeholder</div>, { title: 'Resume' });
            } else {
                launchApp('text-viewer', <div className="p-4 text-white custom-scrollbar overflow-auto h-full"><pre>{node.content}</pre></div>, { title: path });
            }
        }
    };

    const goBack = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setCurrentPath(history[historyIndex - 1]);
        }
    };

    const goUp = () => {
        const parts = currentPath.split('/').filter(Boolean);
        if (parts.length > 0) {
            parts.pop();
            const newPath = '/' + parts.join('/');
            handleNavigate(newPath);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e2e] text-[#cdd6f4]">
            {/* Toolbar */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5">
                <button
                    onClick={goBack}
                    disabled={historyIndex === 0}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <button
                    onClick={goUp}
                    disabled={currentPath === '/'}
                    className="p-1 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
                >
                    <ArrowUp size={18} />
                </button>

                {/* Path Bar */}
                <div className="flex-1 bg-black/20 rounded px-3 py-1 text-sm border border-white/5 flex items-center">
                    <span className="opacity-70 mr-2">/</span>
                    <input
                        type="text"
                        value={currentPath}
                        readOnly
                        className="bg-transparent border-none outline-none w-full text-white/90"
                    />
                </div>

                <div className="md:flex hidden bg-black/20 rounded px-2 py-1 text-sm border border-white/5 items-center w-32">
                    <Search size={14} className="opacity-50 mr-2" />
                    <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-full text-white/80 placeholder:text-white/30" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.length === 0 && <div className="text-white/30 italic">Empty folder</div>}

                    {items.map(item => {
                        const fullPath = currentPath === '/' ? `/${item}` : `${currentPath}/${item}`;
                        const node = getNode(fullPath);
                        const isDir = node?.type === 'dir';

                        return (
                            <button
                                key={item}
                                onDoubleClick={() => handleNavigate(item)}
                                className="flex flex-col items-center gap-2 p-4 rounded hover:bg-white/5 group transition-colors focus:bg-white/10 outline-none"
                            >
                                <div className="text-blue-400 group-hover:scale-105 transition-transform">
                                    {isDir ? (
                                        <Folder size={48} fill="currentColor" className="text-blue-400/80" />
                                    ) : (
                                        <FileText size={48} className="text-gray-400" />
                                    )}
                                </div>
                                <span className="text-sm text-center truncate w-full px-1 select-none">{item}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-6 border-t border-white/10 bg-white/5 flex items-center px-4 text-xs text-white/40">
                {items.length} items
            </div>
        </div>
    );
};
