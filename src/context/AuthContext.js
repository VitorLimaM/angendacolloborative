'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef  = doc(db, 'users', firebaseUser.uid)
        const docSnap = await getDoc(docRef)
        setUser({ ...firebaseUser, ...(docSnap.exists() ? docSnap.data() : {}) })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signup = async (email, password, name) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const { uid } = credential.user
    await updateProfile(credential.user, { displayName: name })
    await setDoc(doc(db, 'users', uid), {
      uid,
      name,
      email,
      color: 'violet',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      createdAt: serverTimestamp(),
    })
    return credential.user
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const updateColor = async (color) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { color })
    setUser((prev) => ({ ...prev, color }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateColor }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}