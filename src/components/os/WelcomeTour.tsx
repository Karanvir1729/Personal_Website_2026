import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Terminal, FolderOpen, Gamepad2, Briefcase } from 'lucide-react';

interface TourStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    highlight?: string;
}

interface WelcomeTourProps {
    onComplete: () => void;
}

const tourSteps: TourStep[] = [
    {
        title: "Welcome to KaranOS! 🎉",
        description: "This is my personal portfolio, built as an interactive desktop experience. Let me show you around!",
        icon: <Sparkles className="w-8 h-8" />,
    },
    {
        title: "Desktop Icons",
        description: "Click any icon to open an app. Explore my Projects, Experience, Skills, and more!",
        icon: <FolderOpen className="w-8 h-8" />,
        highlight: "desktop-icons",
    },
    {
        title: "Terminal Power",
        description: "I'm a command-line enthusiast! Open the Terminal and try commands like 'help', 'ls', or 'cat about.txt'",
        icon: <Terminal className="w-8 h-8" />,
        highlight: "terminal-icon",
    },
    {
        title: "Mini Games",
        description: "Take a break with Bug Hunt, Typing Rush, or Inventory Optimizer — because work should be fun!",
        icon: <Gamepad2 className="w-8 h-8" />,
        highlight: "games",
    },
    {
        title: "You're All Set!",
        description: "Feel free to explore. This site was made with ❤️ just for you. Enjoy!",
        icon: <Briefcase className="w-8 h-8" />,
    },
];

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('tourCompleted', 'true');
        setTimeout(onComplete, 300);
    };

    const handleSkip = () => {
        handleComplete();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Escape') {
                handleSkip();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep]);

    const step = tourSteps[currentStep];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Tour Card */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-md mx-4"
                    >
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header gradient bar */}
                            <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

                            {/* Content */}
                            <div className="p-8">
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
                                >
                                    {step.icon}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-2xl font-bold text-center text-white mb-3"
                                >
                                    {step.title}
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-slate-300 text-center leading-relaxed"
                                >
                                    {step.description}
                                </motion.p>

                                {/* Progress dots */}
                                <div className="flex justify-center gap-2 mt-8 mb-6">
                                    {tourSteps.map((_, index) => (
                                        <motion.div
                                            key={index}
                                            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                                    ? 'w-6 bg-cyan-500'
                                                    : index < currentStep
                                                        ? 'w-2 bg-cyan-500/50'
                                                        : 'w-2 bg-slate-600'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handleSkip}
                                        className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        Skip tour
                                    </button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                                    >
                                        {currentStep === tourSteps.length - 1 ? "Let's Go!" : "Next"}
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Skip hint */}
                        <p className="text-center text-slate-500 text-sm mt-4">
                            Press <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> or <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-400">Esc</kbd> to skip
                        </p>
                    </motion.div>

                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors z-20"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
