'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Calendar, FileText } from 'lucide-react'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, '0')
  return `${h}:00`
})

export default function ScheduleModal({ isOpen, onClose, onSave, initialData }) {
  const [day, setDay]             = useState(initialData?.day || 'Segunda')
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00')
  const [endTime, setEndTime]     = useState(initialData?.endTime || '10:00')
  const [reason, setReason]       = useState(initialData?.reason || '')
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    if (initialData) {
      setDay(initialData.day)
      setStartTime(initialData.startTime)
      setEndTime(initialData.endTime)
      setReason(initialData.reason)
    }
  }, [initialData])

  const handleSave = async () => {
    setError('')
    if (!reason.trim()) { setError('Informe o motivo do compromisso.'); return }
    if (startTime >= endTime) { setError('O horário de início deve ser antes do fim.'); return }

    setSaving(true)
    try {
      await onSave({ day, startTime, endTime, reason: reason.trim() })
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-800 border border-surface-600 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-600">
          <div>
            <h2 className="text-white font-semibold text-lg">
              {initialData ? 'Editar compromisso' : 'Novo compromisso'}
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5">Informe quando você estará ocupado</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-surface-600 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Dia */}
          <div>
            <label className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium mb-1.5">
              <Calendar size={14} /> Dia da semana
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:border-brand-500 transition-colors"
            >
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Horários */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium mb-1.5">
                <Clock size={14} /> Início
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2.5 text-sm
                           focus:outline-none focus:border-brand-500 transition-colors"
              >
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium mb-1.5">
                <Clock size={14} /> Fim
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2.5 text-sm
                           focus:outline-none focus:border-brand-500 transition-colors"
              >
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <label className="flex items-center gap-1.5 text-zinc-300 text-sm font-medium mb-1.5">
              <FileText size={14} /> Motivo
            </label>
            <input
              type="text"
              placeholder="Ex: Reunião de planejamento, Médico, Stand-up..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={100}
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2.5 text-sm
                         focus:outline-none focus:border-brand-500 placeholder:text-zinc-600 transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold
                       rounded-lg transition-colors"
          >
            {saving ? 'Salvando...' : (initialData ? 'Salvar alterações' : 'Adicionar')}
          </button>
        </div>
      </div>
    </div>
  )
}