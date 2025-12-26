import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import type { WindowState } from '../../store/useOSStore';
import clsx from 'clsx';

interface WindowProps {
    window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useOSStore();
    const [isResizing, setIsResizing] = useState(false);
    const startPos = useRef<{ x: number, y: number } | null>(null);
    const startSize = useRef<{ width: number, height: number } | null>(null);

    // Local size state (synced with store initial, but managed locally for performance during resize)
    const [size, setSize] = useState(window.size || { width: 600, height: 400 });

    // Sync if store updates (e.g. restore from maximize)
    // Logic for maximize is handled by Framer Motion layout animations usually, or explicit styles.
    // If maximized, we override style.

    const handleMouseDown = () => {
        focusWindow(window.id);
    };

    // Simple resize handler (bottom-right corner)
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        startPos.current = { x: e.clientX, y: e.clientY };
        startSize.current = { ...size };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!startPos.current || !startSize.current) return;
            const invalid = moveEvent.clientX === 0 && moveEvent.clientY === 0; // sometimes happen on release
            if (invalid) return;

            const deltaX = moveEvent.clientX - startPos.current.x;
            const deltaY = moveEvent.clientY - startPos.current.y;

            setSize({
                width: Math.max(300, startSize.current.width + deltaX),
                height: Math.max(200, startSize.current.height + deltaY),
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    if (window.isMinimized) return null;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                width: window.isMaximized ? '100%' : size.width,
                height: window.isMaximized ? '100%' : size.height,
                x: window.isMaximized ? 0 : window.position?.x,
                y: window.isMaximized ? 0 : window.position?.y,
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                position: 'absolute',
                zIndex: window.zIndex,
                // If maximized, fixed at 0,0. dragging disabled
            }}
            drag={!window.isMaximized}
            dragMomentum={false}
            onDragStart={() => focusWindow(window.id)}
            onMouseDown={handleMouseDown}
            className={clsx(
                "flex flex-col bg-os-bg/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden",
                window.isMaximized && "rounded-none border-0",
                isResizing && "cursor-se-resize select-none"
            )}
        >
            {/* Title Bar */}
            <div
                className="h-10 bg-white/5 flex items-center justify-between px-3 select-none cursor-default"
                onDoubleClick={() => maximizeWindow(window.id)}
            >
                <div className="flex items-center gap-2">
                    {/* If we had an icon component, render it here */}
                    <span className="text-white/80 font-medium text-sm flex items-center gap-2">
                        {typeof window.icon === 'string' ? (
                            <img src={window.icon} className="w-4 h-4" alt="icon" />
                        ) : (
                            window.icon
                        )}
                        {window.title}
                    </span>
                </div>

                <div className="flex items-center gap-2" onMouseDown={(e) => e.stopPropagation() /* Prevent drag from buttons */}>
                    <button onClick={() => minimizeWindow(window.id)} className="p-1 hover:bg-white/10 rounded group">
                        <Minus size={14} className="text-white/70 group-hover:text-white" />
                    </button>
                    <button onClick={() => maximizeWindow(window.id)} className="p-1 hover:bg-white/10 rounded group">
                        {window.isMaximized ? <Square size={12} className="text-white/70 group-hover:text-white" /> : <Maximize2 size={12} className="text-white/70 group-hover:text-white" />}
                    </button>
                    <button onClick={() => closeWindow(window.id)} className="p-1 hover:bg-red-500/80 rounded group transition-colors">
                        <X size={14} className="text-white/70 group-hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative">
                {window.component}

                {/* Interaction blocker overlay when not focused to prevent iframe/input stealing focus issues during drag (optional) 
            But simplified: just check zIndex or isFocused
        */}
            </div>

            {/* Resize Handle */}
            {!window.isMaximized && (
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-white/10"
                    onMouseDown={handleResizeStart}
                />
            )}
        </motion.div>
    );
};
