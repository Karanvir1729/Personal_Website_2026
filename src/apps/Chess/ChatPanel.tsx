import React, { useState, useEffect, useRef } from 'react';
import { database, ref, push, onValue, isDemoMode } from '../../lib/firebase';
import { Send, Edit2, Check } from 'lucide-react';

interface Message {
    id: string;
    displayName: string;
    text: string;
    timestamp: number;
}

interface ChatPanelProps {
    gameId?: string;
    playerRole: 'white' | 'black' | 'viewer';
}

const GAME_ID = 'main-game';

export const ChatPanel: React.FC<ChatPanelProps> = ({ playerRole }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [displayName, setDisplayName] = useState(() => {
        return localStorage.getItem('chess-display-name') || `Player_${Math.random().toString(36).substring(2, 5)}`;
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingName, setEditingName] = useState(displayName);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load display name from localStorage
    useEffect(() => {
        localStorage.setItem('chess-display-name', displayName);
    }, [displayName]);

    // Listen for chat messages
    useEffect(() => {
        if (isDemoMode || !database) {
            return;
        }

        const chatRef = ref(database, `chat/${GAME_ID}`);
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.entries(data).map(([id, msg]: [string, any]) => ({
                    id,
                    ...msg
                })).sort((a, b) => a.timestamp - b.timestamp);
                setMessages(messageList.slice(-50)); // Keep last 50 messages
            }
        });

        return () => unsubscribe();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage = {
            displayName,
            text: input.trim(),
            timestamp: Date.now()
        };

        if (!isDemoMode && database) {
            const chatRef = ref(database, `chat/${GAME_ID}`);
            push(chatRef, newMessage);
        } else {
            // Demo mode - just add locally
            setMessages(prev => [...prev, { ...newMessage, id: Date.now().toString() }]);
        }

        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const saveNameEdit = () => {
        if (editingName.trim()) {
            setDisplayName(editingName.trim());
        }
        setIsEditingName(false);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'white': return 'text-yellow-400';
            case 'black': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-lg border border-white/10">
            {/* Header with name edit */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-white/50 text-sm">Your name:</span>
                    {isEditingName ? (
                        <div className="flex items-center gap-1">
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-white/20 w-28"
                                maxLength={15}
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && saveNameEdit()}
                            />
                            <button onClick={saveNameEdit} className="p-1 hover:bg-white/10 rounded">
                                <Check size={14} className="text-green-400" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <span className={`font-medium text-sm ${getRoleColor(playerRole)}`}>{displayName}</span>
                            <button onClick={() => { setEditingName(displayName); setIsEditingName(true); }} className="p-1 hover:bg-white/10 rounded">
                                <Edit2 size={12} className="text-white/50" />
                            </button>
                        </div>
                    )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${playerRole === 'white' ? 'bg-yellow-500/20 text-yellow-400' :
                        playerRole === 'black' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                    }`}>
                    {playerRole === 'viewer' ? 'Viewer' : playerRole.charAt(0).toUpperCase() + playerRole.slice(1)}
                </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[150px] max-h-[300px]">
                {messages.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-4">No messages yet. Say hello! 👋</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="text-sm">
                            <span className="text-cyan-400 font-medium">{msg.displayName}: </span>
                            <span className="text-white/80">{msg.text}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-700 text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-cyan-500/50 outline-none"
                        maxLength={200}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim()}
                        className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded transition-colors"
                    >
                        <Send size={16} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};
