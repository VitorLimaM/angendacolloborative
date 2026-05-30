import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBaHhCz6BqvdGETlloGxuPzcwYBaFsid-E",
  authDomain: "sync-c2673.firebaseapp.com",
  databaseURL: "https://sync-c2673-default-rtdb.firebaseio.com",
  projectId: "sync-c2673",
  storageBucket: "sync-c2673.firebasestorage.app",
  messagingSenderId: "182643683720",
  appId: "1:182643683720:web:1b1b2f62be1d3e31b20a3d"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app