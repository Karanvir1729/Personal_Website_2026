//fileSystem.ts
import content from '../data/content.json';

// Types for Filesystem
export interface FSNode {
    type: 'file' | 'dir';
    content?: string;
    children?: { [key: string]: FSNode };
}

// Initial state from content.json
// content.json structure: { filesystem: { home: { karan: ... } } }
const initialFS = content.filesystem as { [key: string]: FSNode };

// Helper to resolve path
export const resolvePath = (path: string, currentDir: string): string => {
    if (path.startsWith('/')) {
        // Absolute path
        // Remove trailing slash if present unless it's root
        return path === '/' ? '/' : path.replace(/\/$/, '');
    }

    // Relative path
    const parts = path.split('/');
    const stack = currentDir === '/' ? [] : currentDir.split('/').filter(Boolean);

    for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
            stack.pop();
        } else {
            stack.push(part);
        }
    }

    const resolved = '/' + stack.join('/');
    return resolved || '/';
};

// Get node at path
export const getNode = (path: string): FSNode | null => {
    if (path === '/') return { type: 'dir', children: initialFS }; // Root maps to top level

    const parts = path.split('/').filter(Boolean);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = { type: 'dir', children: initialFS };

    for (const part of parts) {
        // Check if current has children and the part exists
        if (!current.children || !current.children[part]) {
            return null;
        }
        current = current.children[part];
    }

    return current as FSNode;
};

// Read file content
export const readFile = (path: string): string | null => {
    const node = getNode(path);
    if (node && node.type === 'file') return node.content || '';
    return null;
};

// List directory
export const listDir = (path: string): string[] | null => {
    const node = getNode(path);
    if (node && node.type === 'dir' && node.children) return Object.keys(node.children);
    return null;
};
