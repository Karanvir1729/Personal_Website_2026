import { useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { apps } from '../../apps/registry';

export const Desktop = () => {
    const { windows } = useOSStore();
    const desktopRef = useRef<HTMLDivElement>(null);

    // app registry is now imported from src/apps/registry.tsx

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

            {/* Desktop Icons Area */}
            <div className="absolute top-0 left-0 bottom-12 right-0 p-4 flex flex-col flex-wrap content-start gap-4 z-0">
                {Object.values(apps).map((app) => (
                    <button
                        key={app.id}
                        onClick={() => useOSStore.getState().launchApp(app.id, app.component, {
                            title: app.title,
                            icon: app.icon,
                            size: { width: app.width || 600, height: app.height || 400 }
                        })}
                        className="group flex flex-col items-center gap-2 p-2 w-24 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-shadow"
                    >
                        <div className="p-3 bg-white/10 rounded-xl shadow-lg backdrop-blur-sm group-hover:bg-white/20 transition-all ring-1 ring-white/20">
                            <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                                {app.icon}
                            </div>
                        </div>
                        <span className="text-white text-xs font-medium text-center drop-shadow-md truncate w-full px-1">
                            {app.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Windows Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Pointer events handled by windows themselves */}
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
