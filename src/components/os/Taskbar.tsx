import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Grid } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { useIsMobile } from '../../hooks/useMobile';

export const Taskbar: React.FC = () => {
    const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow } = useOSStore();
    const isMobile = useIsMobile();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAppClick = (windowId: string) => {
        const win = windows.find(w => w.id === windowId);
        if (!win) return;

        if (win.isMinimized) {
            restoreWindow(windowId);
        } else if (activeWindowId === windowId) {
            minimizeWindow(windowId);
        } else {
            focusWindow(windowId);
        }
    };

    return (
        <div className="h-12 bg-os-sidebar/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-2 sm:px-4 fixed bottom-0 left-0 right-0 z-[9999]">
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Start Button */}
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Grid size={isMobile ? 18 : 20} className="text-white" />
                </button>

                {/* Separator - hidden on mobile */}
                {!isMobile && <div className="w-[1px] h-6 bg-white/10 mx-2" />}

                {/* Running Apps - hidden on mobile since windows are fullscreen */}
                {!isMobile && (
                    <div className="flex items-center gap-2">
                        {windows.map((win) => (
                            <button
                                key={win.id}
                                onClick={() => handleAppClick(win.id)}
                                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${activeWindowId === win.id && !win.isMinimized ? 'bg-white/20 shadow-inner' : 'hover:bg-white/5'} ${win.isMinimized ? 'opacity-50' : ''}`}
                            >
                                <span className="text-white text-xs max-w-[100px] truncate">{win.title}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tray - Time */}
            <div className="flex items-center gap-2 sm:gap-4 text-white/90 text-xs sm:text-sm font-medium">
                <span>{format(time, isMobile ? 'h:mm' : 'MMM d  h:mm aa')}</span>
            </div>
        </div>
    );
};
