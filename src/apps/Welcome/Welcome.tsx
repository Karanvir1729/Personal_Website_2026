
import { motion } from 'framer-motion';
import { Terminal, FolderOpen, User, Rocket } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';

export const Welcome = () => {
    const { closeWindow } = useOSStore();

    const handleLaunch = () => {
        closeWindow('welcome');
    };

    return (
        <div className="h-full w-full bg-slate-900 text-white p-8 flex flex-col items-center justify-center text-center overflow-auto select-none">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl space-y-8"
            >
                <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                        <Rocket size={48} className="text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Welcome to KaranOS
                    </h1>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Hi, I'm <span className="font-semibold text-white">Karanvir Khanna</span>.
                        This isn't just a website—it's an interactive operating system designed to showcase my work.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                        <Terminal className="w-8 h-8 text-green-400 mb-4" />
                        <h3 className="font-bold text-lg mb-2">Terminal Power</h3>
                        <p className="text-slate-400 text-sm">
                            Type <code className="bg-slate-900 px-1 py-0.5 rounded text-green-400">help</code> to access hidden features and fast navigation.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                        <FolderOpen className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="font-bold text-lg mb-2">File System</h3>
                        <p className="text-slate-400 text-sm">
                            Explore my projects and skills through a real interactive filesystem.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                        <User className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="font-bold text-lg mb-2">About Me</h3>
                        <p className="text-slate-400 text-sm">
                            Learn about my journey, experience, and what I build with love.
                        </p>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={handleLaunch}
                        className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-500 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-400"
                    >
                        <span>Start Exploring</span>
                        <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="mt-6 text-slate-500 text-sm">
                        Made with <span className="text-red-500 animate-pulse">❤️</span> by Karanvir
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
