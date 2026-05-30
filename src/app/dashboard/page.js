'use client'

import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import AuthGuard from '../../components/AuthGuard'
import Sidebar from '../../components/Sidebar'
import WeeklyTable from '../../components/WeeklyTable'
import ScheduleModal from '../../components/ScheduleModal'
import { useSchedules } from '../../hooks/useSchedules'
import { useAuth } from '../../context/AuthContext'

export default function DashboardPage() {
  const {
    schedules, loading,
    weekDays, weekLabel,
    goToPrevWeek, goToNextWeek, goToToday,
    addSchedule, updateSchedule, deleteSchedule,
  } = useSchedules()

  const { user } = useAuth()

  const [modalOpen, setModalOpen]         = useState(false)
  const [editTarget, setEditTarget]       = useState(null)
  const [defaultDateKey, setDefaultDateKey] = useState(null)

  const handleAdd = (dateKey = null) => {
    setEditTarget(null)
    setDefaultDateKey(dateKey)
    setModalOpen(true)
  }

  const handleEdit = (schedule) => {
    setEditTarget(schedule)
    setDefaultDateKey(null)
    setModalOpen(true)
  }

  const handleDelete = async (id, ownerId) => {
    if (!confirm('Remover este compromisso?')) return
    await deleteSchedule(id, ownerId)
  }

  const handleSave = async (data) => {
    if (editTarget) {
      await updateSchedule(editTarget.id, data, editTarget.userId)
    } else {
      await addSchedule(data)
    }
  }

  const members = [...new Map(
    schedules.map((s) => [s.userId, { id: s.userId, name: s.userName }])
  ).values()]

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-surface-900">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-white text-2xl font-bold">Agenda da Semana</h1>
              <p className="text-zinc-400 text-sm mt-1">
                {loading
                  ? 'Carregando...'
                  : `${schedules.length} compromisso${schedules.length !== 1 ? 's' : ''} • ${members.length} membro${members.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => handleAdd()}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white
                         px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-brand-600/20"
            >
              <Plus size={16} />
              Adicionar compromisso
            </button>
          </div>

          {members.length > 0 && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Membros:</span>
              {members.map(({ id, name }) => {
                const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
                const isMe = id === user?.uid
                return (
                  <div key={id} className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold
                                    ${isMe ? 'bg-brand-600 ring-2 ring-brand-400' : 'bg-surface-600'}`}>
                      {initials}
                    </div>
                    <span className={`text-xs ${isMe ? 'text-brand-300' : 'text-zinc-400'}`}>
                      {name.split(' ')[0]}{isMe ? ' (você)' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
              <RefreshCw size={18} className="animate-spin" />
              <span className="text-sm">Sincronizando em tempo real...</span>
            </div>
          ) : (
            <WeeklyTable
              schedules={schedules}
              weekDays={weekDays}
              weekLabel={weekLabel}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrevWeek={goToPrevWeek}
              onNextWeek={goToNextWeek}
              onToday={goToToday}
            />
          )}
        </main>
      </div>

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={
          editTarget || (defaultDateKey
            ? { dateKey: defaultDateKey, startTime: '09:00', endTime: '10:00', reason: '' }
            : null)
        }
      />
    </AuthGuard>
  )
}