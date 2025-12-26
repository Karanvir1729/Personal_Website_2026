import React, { useState, useCallback } from 'react';
import { resolvePath, listDir, readFile } from '../../utils/fs';
import { useOSStore } from '../../store/useOSStore';
import content from '../../data/content.json';

interface TerminalLine {
    id: string;
    type: 'input' | 'output' | 'error';
    content: React.ReactNode;
    path?: string;
}

export const useTerminal = () => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { id: 'welcome', type: 'output', content: 'Welcome to KaranOS v1.0.0. Type "help" for available commands.' }
    ]);
    const [currentPath, setCurrentPath] = useState('/home/karan');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setHistoryIndex] = useState(-1);
    const { launchApp } = useOSStore();

    const addToHistory = (type: 'input' | 'output' | 'error', content: React.ReactNode, path?: string) => {
        setHistory(prev => [...prev, { id: Math.random().toString(36), type, content, path }]);
    };

    const executeCommand = useCallback((cmdString: string) => {
        const trimmed = cmdString.trim();
        if (!trimmed) {
            addToHistory('input', '', currentPath);
            return;
        }

        addToHistory('input', trimmed, currentPath);
        setCommandHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);

        const [cmd, ...args] = trimmed.split(' ');

        switch (cmd) {
            case 'help':
                addToHistory('output', (
                    <div className="grid grid-cols-2 gap-2 max-w-sm">
                        <span className="text-yellow-400">help</span> <span>Show this message</span>
                        <span className="text-yellow-400">ls</span> <span>List directory</span>
                        <span className="text-yellow-400">cd &lt;dir&gt;</span> <span>Change directory</span>
                        <span className="text-yellow-400">cat &lt;file&gt;</span> <span>Read file</span>
                        <span className="text-yellow-400">clear</span> <span>Clear terminal</span>
                        <span className="text-yellow-400">whoami</span> <span>About user</span>
                        <span className="text-yellow-400">open &lt;app&gt;</span> <span>Launch app (projects, about, resume)</span>
                        <span className="text-yellow-400">neofetch</span> <span>System info</span>
                    </div>
                ));
                break;

            case 'clear':
                setHistory([]);
                break;

            case 'ls': {
                const targetPathLs = args[0] ? resolvePath(args[0], currentPath) : currentPath;
                const items = listDir(targetPathLs);
                if (items) {
                    addToHistory('output', (
                        <div className="flex flex-wrap gap-4">
                            {items.map(item => {
                                return <span key={item} className={item.includes('.') ? 'text-blue-300' : 'text-green-400 font-bold'}>{item}</span>
                            })}
                        </div>
                    ));
                } else {
                    addToHistory('error', `ls: cannot access '${args[0] || ''}': No such file or directory`);
                }
                break;
            }

            case 'cd': {
                const targetDir = args[0] || '/home/karan';
                const resolvedDir = resolvePath(targetDir, currentPath);
                const dirExists = listDir(resolvedDir);
                if (dirExists) {
                    setCurrentPath(resolvedDir);
                } else {
                    addToHistory('error', `cd: ${targetDir}: No such file or directory`);
                }
                break;
            }

            case 'cat': {
                if (!args[0]) {
                    addToHistory('error', 'cat: missing file operand');
                    break;
                }
                const filePath = resolvePath(args[0], currentPath);
                const fileContent = readFile(filePath);
                if (fileContent !== null) {
                    addToHistory('output', <div className="whitespace-pre-wrap">{fileContent}</div>);
                } else {
                    addToHistory('error', `cat: ${args[0]}: No such file or directory`);
                }
                break;
            }

            case 'whoami':
                addToHistory('output', `${content.profile.name} - ${content.profile.headline}`);
                break;

            case 'neofetch':
                addToHistory('output', (
                    <div className="flex gap-4 items-start">
                        <div className="text-blue-500 whitespace-pre font-bold hidden sm:block">
                            {`
       .---.
      /     \\
      |  O  |
      \\     /
       '---'
`}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-green-400">karan@web-os</span>
                            <span>------------------</span>
                            <span><span className="text-yellow-400 font-bold">OS:</span> React WebOS</span>
                            <span><span className="text-yellow-400 font-bold">Host:</span> Browser</span>
                            <span><span className="text-yellow-400 font-bold">Kernel:</span> TypeScript 5.x</span>
                            <span><span className="text-yellow-400 font-bold">Uptime:</span> Forever</span>
                            <span><span className="text-yellow-400 font-bold">Packages:</span> {Object.keys(content.skills.languages).length} (discovered)</span>
                            <span><span className="text-yellow-400 font-bold">Shell:</span> Term v1.0</span>
                        </div>
                    </div>
                ));
                break;

            case 'open': {
                const appName = args[0]?.toLowerCase();
                if (!appName) {
                    addToHistory('output', 'Usage: open <app_name>');
                    break;
                }

                // Dynamic import with error handling
                try {
                    import('../../apps/registry').then(({ apps }) => {
                        try {
                            const targetApp = apps[appName] || Object.values(apps).find(a => a.title.toLowerCase() === appName);

                            if (targetApp) {
                                launchApp(targetApp.id, targetApp.component, {
                                    title: targetApp.title,
                                    icon: targetApp.icon,
                                    size: { width: targetApp.width || 600, height: targetApp.height || 400 }
                                });
                                addToHistory('output', `Opening ${targetApp.title}...`);
                            } else {
                                addToHistory('error', `App not found: ${appName}`);
                                addToHistory('output', 'Available apps: ' + Object.keys(apps).join(', '));
                            }
                        } catch (err) {
                            console.error('Failed to launch app:', err);
                            addToHistory('error', `Error launching ${appName}: ${(err as Error).message}`);
                        }
                    }).catch(err => {
                        console.error('Failed to load registry:', err);
                        addToHistory('error', `System Error: Could not load app registry.`);
                    });
                } catch (err) {
                    addToHistory('error', `Critical Error: ${(err as Error).message}`);
                }
                break;
            }

            default:
                addToHistory('error', `Command not found: ${cmd}`);
        }
    }, [currentPath, launchApp]);

    return {
        history,
        currentPath,
        executeCommand,
        commandHistory
    };
};
