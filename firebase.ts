import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-pBGo-xJ5mOvuTHA9jOoC7W04uHUkxRk",
    authDomain: "chore-388a5.firebaseapp.com",
    databaseURL: "https://chore-388a5-default-rtdb.firebaseio.com",
    projectId: "chore-388a5",
    storageBucket: "chore-388a5.firebasestorage.app",
    messagingSenderId: "903328952755",
    appId: "1:903328952755:web:d405cda0e386df815f9bc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, off };
