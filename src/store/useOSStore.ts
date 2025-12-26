import { create } from 'zustand';

export interface WindowState {
    id: string;
    appId: string;
    title: string;
    icon?: React.ReactNode | string; // Lucide icon or string URL
    component: React.ReactNode;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}

interface OSState {
    windows: WindowState[];
    activeWindowId: string | null;
    nextZIndex: number;

    launchApp: (appId: string, component: React.ReactNode, options?: Partial<WindowState>) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    focusWindow: (id: string) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    windows: [],
    activeWindowId: null,
    nextZIndex: 100,

    launchApp: (appId, component, options = {}) => {
        const { windows, nextZIndex } = get();

        // Check if window already exists
        const existingWindow = windows.find((w) => w.id === appId);
        if (existingWindow) {
            get().focusWindow(appId);
            return;
        }

        const id = appId; // Use appId as the unique ID for the window
        const newWindow: WindowState = {
            id,
            appId,
            title: options.title || appId,
            icon: options.icon,
            component,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex + 1,
            position: options.position || { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
            size: options.size || { width: 600, height: 400 },
            ...options,
        };

        set({
            windows: [...windows, newWindow],
            activeWindowId: id,
            nextZIndex: nextZIndex + 1,
        });
    },

    closeWindow: (id) => {
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }));
    },

    minimizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: true } : w),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }));
    },

    maximizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((w) => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
            // Focus when maximizing
            activeWindowId: id,
            nextZIndex: state.nextZIndex + 1,
        }));
    },

    restoreWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((w) => w.id === id ? { ...w, isMinimized: false } : w),
            activeWindowId: id,
            nextZIndex: state.nextZIndex + 1,
        }));
    },

    focusWindow: (id) => {
        set((state) => {
            if (state.activeWindowId === id) return state; // Already focused

            const maxZ = Math.max(...state.windows.map(w => w.zIndex), state.nextZIndex);
            return {
                activeWindowId: id,
                windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w),
                nextZIndex: maxZ + 2,
            };
        });
    },
}));
