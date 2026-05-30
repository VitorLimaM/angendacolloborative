'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading]     = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { user } = useAuth()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd   = endOfWeek(currentWeek,   { weekStartsOn: 1 })

  const weekLabel = `${format(weekStart, "d 'de' MMM", { locale: ptBR })} – ${format(weekEnd, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`

  // Gera os 7 dias da semana atual com data real
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      label:     format(date, 'EEE', { locale: ptBR }).toUpperCase().replace('.', ''),
      dateLabel: format(date, 'd'),
      dateKey:   format(date, 'yyyy-MM-dd'),
      isToday:   format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    }
  })

  useEffect(() => {
    const q = query(
      collection(db, 'schedules'),
      orderBy('dateKey'),
      orderBy('startTime')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setSchedules(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Filtra só os compromissos da semana visível
  const visibleSchedules = schedules.filter((s) =>
    s.dateKey >= format(weekStart, 'yyyy-MM-dd') &&
    s.dateKey <= format(weekEnd,   'yyyy-MM-dd')
  )

  const goToPrevWeek = () => setCurrentWeek((w) => subWeeks(w, 1))
  const goToNextWeek = () => setCurrentWeek((w) => addWeeks(w, 1))
  const goToToday    = () => setCurrentWeek(new Date())

  const addSchedule = async (data) => {
    if (!user) throw new Error('Você precisa estar logado.')
    return addDoc(collection(db, 'schedules'), {
      ...data,
      userId:    user.uid,
      userName:  user.displayName || user.name || 'Usuário',
      createdAt: serverTimestamp(),
    })
  }

  const updateSchedule = async (id, data, ownerId) => {
    if (!user) throw new Error('Você precisa estar logado.')
    if (user.uid !== ownerId) throw new Error('Sem permissão.')
    return updateDoc(doc(db, 'schedules', id), data)
  }

  const deleteSchedule = async (id, ownerId) => {
    if (!user) throw new Error('Você precisa estar logado.')
    if (user.uid !== ownerId) throw new Error('Sem permissão.')
    return deleteDoc(doc(db, 'schedules', id))
  }

  return {
    schedules: visibleSchedules,
    loading,
    weekDays,
    weekLabel,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  }
}