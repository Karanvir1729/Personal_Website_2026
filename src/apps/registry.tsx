import type { ReactNode } from 'react';
import { LayoutGrid, Terminal, FolderOpen, User, Briefcase, Cpu, FileText, Gamepad2, Keyboard, Box, Sparkles, Crown } from 'lucide-react';
import { Projects } from './Projects/Projects';
import { Experience } from './Experience/Experience';
import { About } from './About/About';
import { Skills } from './Skills/Skills';
import { Resume } from './Resume/Resume';
import { BugHunt } from './Games/BugHunt';
import { TypingRush } from './Games/TypingRush';
import { InventoryOptimizer } from './Games/InventoryOptimizer';
import { Welcome } from './Welcome/Welcome';
import { Terminal as TerminalApp } from './Terminal/Terminal';
import { Explorer } from './Explorer/Explorer';
import { Chess } from './Chess/Chess';

export interface App {
    id: string;
    title: string;
    icon: ReactNode;
    component: ReactNode;
    width?: number;
    height?: number;
}

export const apps: Record<string, App> = {
    terminal: {
        id: 'terminal',
        title: 'Terminal',
        icon: <Terminal size={24} />,
        component: <TerminalApp />,
    },
    explorer: {
        id: 'explorer',
        title: 'Explorer',
        icon: <FolderOpen size={24} />,
        component: <Explorer />,
    },
    projects: {
        id: 'projects',
        title: 'Projects',
        icon: <LayoutGrid size={24} />,
        component: <Projects />,
        width: 900,
        height: 700,
    },
    experience: {
        id: 'experience',
        title: 'Experience',
        icon: <Briefcase size={24} />,
        component: <Experience />,
        width: 800,
        height: 700,
    },
    about: {
        id: 'about',
        title: 'About Me',
        icon: <User size={24} />,
        component: <About />,
        width: 700,
        height: 600,
    },
    skills: {
        id: 'skills',
        title: 'Skills',
        icon: <Cpu size={24} />,
        component: <Skills />,
        width: 800,
        height: 600,
    },
    resume: {
        id: 'resume',
        title: 'Resume',
        icon: <FileText size={24} />,
        component: <Resume />,
        width: 900,
        height: 800,
    },
    'bug-hunt': {
        id: 'bug-hunt',
        title: 'Bug Hunt',
        icon: <Gamepad2 size={24} />,
        component: <BugHunt />,
        width: 800,
        height: 600,
    },
    'typing-rush': {
        id: 'typing-rush',
        title: 'Typing Rush',
        icon: <Keyboard size={24} />,
        component: <TypingRush />,
        width: 600,
        height: 600,
    },
    'inventory-optimizer': {
        id: 'inventory-optimizer',
        title: 'Inventory Optimizer',
        icon: <Box size={24} />,
        component: <InventoryOptimizer />,
        width: 800,
        height: 600,
    },
    welcome: {
        id: 'welcome',
        title: 'Welcome',
        icon: <Sparkles size={24} />,
        component: <Welcome />,
        width: 900,
        height: 700,
    },
    chess: {
        id: 'chess',
        title: 'Chess Arena',
        icon: <Crown size={24} />,
        component: <Chess />,
        width: 1000,
        height: 800,
    },
};

export type AppId = keyof typeof apps;
