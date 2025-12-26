import React, { useState, useRef, useEffect } from 'react';
import { useTerminal } from './useTerminal';

export const Terminal: React.FC = () => {
    const { history, currentPath, executeCommand, commandHistory } = useTerminal();
    const [input, setInput] = useState('');
    const [historyPointer, setHistoryPointer] = useState(commandHistory.length);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeCommand(input);
            setInput('');
            setHistoryPointer(commandHistory.length + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyPointer > 0) {
                const newPointer = historyPointer - 1;
                setHistoryPointer(newPointer);
                setInput(commandHistory[newPointer] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyPointer < commandHistory.length) {
                const newPointer = historyPointer + 1;
                setHistoryPointer(newPointer);
                setInput(commandHistory[newPointer] || '');
            } else {
                setHistoryPointer(commandHistory.length);
                setInput('');
            }
        }
    };

    return (
        <div
            className="bg-[#1e1e2e] h-full w-full font-mono text-sm text-[#cdd6f4] p-4 flex flex-col"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="flex-1 overflow-auto space-y-1 custom-scrollbar">
                {history.map((line) => (
                    <div key={line.id} className="break-words">
                        {line.type === 'input' && (
                            <div className="flex gap-2 text-[#a6adc8]">
                                <span className="text-green-400 font-bold">karan@web-os</span>
                                <span className="text-white">:</span>
                                <span className="text-blue-400 font-bold">{line.path || '~'}</span>
                                <span className="text-white">$</span>
                                <span className="text-[#cdd6f4]">{line.content}</span>
                            </div>
                        )}
                        {line.type === 'output' && (
                            <div className="ml-0 text-[#cdd6f4]">{line.content}</div>
                        )}
                        {line.type === 'error' && (
                            <div className="text-red-400">{line.content}</div>
                        )}
                    </div>
                ))}

                {/* Active Input Line */}
                <div className="flex gap-2">
                    <span className="text-green-400 font-bold">karan@web-os</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-400 font-bold">{currentPath}</span>
                    <span className="text-white">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none border-none text-[#cdd6f4]"
                        autoComplete="off"
                        autoFocus
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
