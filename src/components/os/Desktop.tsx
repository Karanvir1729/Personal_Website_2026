import { useRef, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { apps } from '../../apps/registry';
import { ChessStatsWidget } from './ChessStatsWidget';
import { ResumeWidget } from './ResumeWidget';
import { GitHubWidget } from './GitHubWidget';
import { LinkedInWidget } from './LinkedInWidget';
import { DevPostWidget } from './DevPostWidget';
import { MediumWidget } from './MediumWidget';

export const Desktop = () => {
    const { windows } = useOSStore();
    const desktopRef = useRef<HTMLDivElement>(null);

    // Auto-launch Welcome app
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
            useOSStore.getState().launchApp('welcome', apps.welcome.component, {
                title: apps.welcome.title,
                icon: apps.welcome.icon,
                size: { width: apps.welcome.width || 900, height: apps.welcome.height || 700 },
                position: { x: window.innerWidth / 2 - 450, y: window.innerHeight / 2 - 350 }
            });
            sessionStorage.setItem('hasVisited', 'true');
        }
    }, []);

    return (
        <div
            ref={desktopRef}
            className="h-screen w-screen overflow-hidden bg-slate-900 relative"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay for tint */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Desktop Icons Area - Responsive Grid */}
            <div className="absolute top-0 left-0 bottom-12 right-0 p-2 sm:p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:flex lg:flex-col lg:flex-wrap lg:content-start gap-2 sm:gap-4 z-0 overflow-auto">
                {Object.values(apps).map((app) => (
                    <button
                        key={app.id}
                        onClick={() => useOSStore.getState().launchApp(app.id, app.component, {
                            title: app.title,
                            icon: app.icon,
                            size: { width: app.width || 600, height: app.height || 400 }
                        })}
                        className="group flex flex-col items-center gap-1 sm:gap-2 p-1 sm:p-2 w-full lg:w-24 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer text-shadow"
                    >
                        <div className="p-2 sm:p-3 bg-white/10 rounded-xl shadow-lg backdrop-blur-sm group-hover:bg-white/20 transition-all ring-1 ring-white/20">
                            <div className="text-blue-400 group-hover:text-blue-300 transition-colors [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                                {app.icon}
                            </div>
                        </div>
                        <span className="text-white text-[10px] sm:text-xs font-medium text-center drop-shadow-md truncate w-full px-1">
                            {app.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Desktop Widgets - Hidden on mobile/tablet, 3x2 grid with large tiles */}
            <div className="absolute top-6 right-6 z-0 hidden xl:grid gap-3 pointer-events-none" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, minmax(180px, auto))', width: '600px' }}>
                {/* Row 1: Resume (large, spans 2 cols), GitHub */}
                <div className="pointer-events-auto col-span-2 row-span-1" style={{ minHeight: '200px' }}>
                    <ResumeWidget />
                </div>
                <div className="pointer-events-auto">
                    <GitHubWidget />
                </div>

                {/* Row 2: Chess (large, spans 2 cols), LinkedIn, DevPost, Medium stacked */}
                <div className="pointer-events-auto col-span-2 row-span-1" style={{ minHeight: '200px' }}>
                    <ChessStatsWidget />
                </div>
                <div className="pointer-events-auto flex flex-col gap-3">
                    <LinkedInWidget />
                    <DevPostWidget />
                    <MediumWidget />
                </div>
            </div>

            {/* Branding Footer - hidden on mobile */}
            <div className="absolute bottom-12 right-4 z-0 text-right pointer-events-none hidden sm:block">
                <div className="text-white/30 text-sm font-light">
                    Designed & Built by <span className="font-medium text-white/50">Karanvir Khanna</span>
                </div>
                <div className="text-white/20 text-xs">
                    Made with <span className="text-red-500/50">❤️</span> and React
                </div>
            </div>

            {/* Windows Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {windows.map((win) => (
                    <div key={win.id} className="pointer-events-auto">
                        <Window window={win} />
                    </div>
                ))}
            </div>

            <Taskbar />
        </div>
    );
};
