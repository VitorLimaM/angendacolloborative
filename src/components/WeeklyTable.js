'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

const COLOR_MAP = {
  violet: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
  emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  amber:   'bg-amber-500/20  border-amber-500/40  text-amber-300',
  rose:    'bg-rose-500/20   border-rose-500/40   text-rose-300',
  cyan:    'bg-cyan-500/20   border-cyan-500/40   text-cyan-300',
  pink:    'bg-pink-500/20   border-pink-500/40   text-pink-300',
  indigo:  'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
  orange:  'bg-orange-500/20 border-orange-500/40 text-orange-300',
  teal:    'bg-teal-500/20   border-teal-500/40   text-teal-300',
  red:     'bg-red-500/20    border-red-500/40    text-red-300',
}

const DEFAULT_COLORS = Object.keys(COLOR_MAP)

export default function WeeklyTable({
  schedules, weekDays, weekLabel,
  onAdd, onEdit, onDelete,
  onPrevWeek, onNextWeek, onToday,
}) {
  const { user } = useAuth()
  const [activeDay, setActiveDay] = useState(null)
  const [userColors, setUserColors] = useState({})

  // Busca cores dos usuários em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const colors = {}
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        colors[data.uid] = data.color || 'violet'
      })
      setUserColors(colors)
    })
    return () => unsubscribe()
  }, [])

  const getColorClass = (userId, index) => {
    const color = userColors[userId] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    return COLOR_MAP[color] || COLOR_MAP.violet
  }

  // Mapeia userId para índice fixo
  const userIndexMap = {}
  let idx = 0
  schedules.forEach(({ userId }) => {
    if (userIndexMap[userId] === undefined) {
      userIndexMap[userId] = idx++
    }
  })

  const getSchedulesForDay = (dateKey) =>
    schedules.filter((s) => s.dateKey === dateKey)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="w-full">
      {/* Navegação de semanas */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={onPrevWeek}
          className="p-2 rounded-lg bg-surface-800 border border-surface-600 text-zinc-400 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onNextWeek}
          className="p-2 rounded-lg bg-surface-800 border border-surface-600 text-zinc-400 hover:text-white hover:bg-surface-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <span className="text-white font-medium text-sm capitalize">{weekLabel}</span>
        <button
          onClick={onToday}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-600
                     text-zinc-400 hover:text-white hover:bg-surface-700 transition-colors text-xs font-medium"
        >
          <Calendar size={12} />
          Hoje
        </button>
      </div>

      {/* Mobile */}
      <div className="lg:hidden space-y-3">
        {weekDays.map((day) => {
          const items = getSchedulesForDay(day.dateKey)
          const isOpen = activeDay === day.dateKey
          return (
            <div key={day.dateKey} className={`bg-surface-800 border rounded-xl overflow-hidden ${day.isToday ? 'border-brand-500/50' : 'border-surface-600'}`}>
              <button
                onClick={() => setActiveDay(isOpen ? null : day.dateKey)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{day.label}</span>
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center
                                    ${day.isToday ? 'bg-brand-600 text-white' : 'text-zinc-500'}`}>
                    {day.dateLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <span className="text-xs bg-brand-600/30 text-brand-400 px-2 py-0.5 rounded-full">
                      {items.length} compromisso{items.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="text-zinc-500 text-xs">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-surface-600 pt-3">
                  {items.length === 0 ? (
                    <p className="text-zinc-600 text-xs">Nenhum compromisso</p>
                  ) : (
                    items.map((s) => (
                      <ScheduleCard
                        key={s.id}
                        schedule={s}
                        colorClass={getColorClass(s.userId, userIndexMap[s.userId])}
                        isOwner={user?.uid === s.userId}
                        onEdit={() => onEdit(s)}
                        onDelete={() => onDelete(s.id, s.userId)}
                      />
                    ))
                  )}
                  {user && (
                    <button
                      onClick={() => onAdd(day.dateKey)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-brand-400
                                 py-2 border border-dashed border-surface-500 hover:border-brand-500/50 rounded-lg transition-colors mt-1"
                    >
                      <Plus size={12} /> Adicionar
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-surface-600">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-surface-600">
              {weekDays.map((day) => (
                <th key={day.dateKey} className="px-3 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{day.label}</span>
                    <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
                                      ${day.isToday ? 'bg-brand-600 text-white' : 'text-zinc-600'}`}>
                      {day.dateLabel}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {weekDays.map((day) => {
                const items = getSchedulesForDay(day.dateKey)
                return (
                  <td key={day.dateKey} className={`px-3 py-3 align-top border-r border-surface-700 last:border-r-0 min-w-[130px] ${day.isToday ? 'bg-brand-600/5' : ''}`}>
                    <div className="space-y-2 min-h-[80px]">
                      {items.map((s) => (
                        <ScheduleCard
                          key={s.id}
                          schedule={s}
                          colorClass={getColorClass(s.userId, userIndexMap[s.userId])}
                          isOwner={user?.uid === s.userId}
                          onEdit={() => onEdit(s)}
                          onDelete={() => onDelete(s.id, s.userId)}
                        />
                      ))}
                      {user && (
                        <button
                          onClick={() => onAdd(day.dateKey)}
                          className="w-full flex items-center justify-center gap-1 text-xs text-zinc-600
                                     hover:text-brand-400 py-1.5 border border-dashed border-transparent
                                     hover:border-brand-500/30 rounded-lg transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScheduleCard({ schedule, colorClass, isOwner, onEdit, onDelete }) {
  return (
    <div className={`group relative rounded-lg border px-2.5 py-2 text-xs ${colorClass}`}>
      <div className="font-semibold truncate pr-8">{schedule.userName}</div>
      <div className="opacity-80 mt-0.5">{schedule.startTime} – {schedule.endTime}</div>
      <div className="opacity-70 truncate mt-0.5">{schedule.reason}</div>
      {isOwner && (
        <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5">
          <button onClick={onEdit} className="p-1 rounded hover:bg-white/10 transition-colors" title="Editar">
            <Pencil size={10} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-500/20 transition-colors" title="Remover">
            <Trash2 size={10} />
          </button>
        </div>
      )}
    </div>
  )
}