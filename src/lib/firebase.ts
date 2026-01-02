//firebases.ts 
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, push, update, serverTimestamp } from 'firebase/database';

// Firebase configuration - Replace with your own config from Firebase Console
// To get your config:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Add a web app
// 4. Copy the firebaseConfig object here
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo.firebaseio.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Check if we're in demo mode (no real Firebase config)
export const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY;

let app: ReturnType<typeof initializeApp> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;

// Manages initialization errors, vital for HMR safety
try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.warn('Firebase initialization failed, running in demo mode:', error);
}

export { database, ref, set, get, onValue, push, update, serverTimestamp };
