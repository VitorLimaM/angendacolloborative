'use client'

import { Calendar, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

const COLORS = [
  { name: 'violet',  bg: 'bg-violet-500',  label: 'Roxo' },
  { name: 'emerald', bg: 'bg-emerald-500', label: 'Verde' },
  { name: 'amber',   bg: 'bg-amber-500',   label: 'Amarelo' },
  { name: 'rose',    bg: 'bg-rose-500',    label: 'Rosa' },
  { name: 'cyan',    bg: 'bg-cyan-500',    label: 'Ciano' },
  { name: 'pink',    bg: 'bg-pink-500',    label: 'Pink' },
  { name: 'indigo',  bg: 'bg-indigo-500',  label: 'Índigo' },
  { name: 'orange',  bg: 'bg-orange-500',  label: 'Laranja' },
  { name: 'teal',    bg: 'bg-teal-500',    label: 'Teal' },
  { name: 'red',     bg: 'bg-red-500',     label: 'Vermelho' },
]

export default function Sidebar() {
  const { user, logout, updateColor } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [showColors, setShowColors] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  const handleColorChange = async (colorName) => {
    await updateColor(colorName)
    setShowColors(false)
  }

  const initials = (user?.displayName || user?.name || 'U')
    .split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

  const currentColor = COLORS.find((c) => c.name === user?.color) || COLORS[0]

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-surface-600">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
          <Calendar size={16} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm">AgendaTeam</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <a href="/dashboard"
           className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-brand-600/20 text-brand-300 text-sm font-medium">
          <Calendar size={15} />
          Agenda Semanal
        </a>
        <a href="#"
           className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-surface-600 text-sm transition-colors">
          <Users size={15} />
          Membros
        </a>
      </nav>

      {/* Seletor de cor */}
      {showColors && (
        <div className="px-3 pb-2">
          <p className="text-zinc-500 text-xs font-medium mb-2 px-1">Sua cor na agenda:</p>
          <div className="grid grid-cols-5 gap-1.5">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.name)}
                title={color.label}
                className={`w-7 h-7 rounded-full ${color.bg} transition-transform hover:scale-110
                            ${user?.color === color.name ? 'ring-2 ring-white ring-offset-1 ring-offset-surface-800' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* User footer */}
      <div className="p-3 border-t border-surface-600">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-surface-600 transition-colors">
          <button
            onClick={() => setShowColors(!showColors)}
            title="Trocar cor"
            className="shrink-0"
          >
            <div className={`w-7 h-7 rounded-full ${currentColor.bg} flex items-center justify-center text-white text-xs font-bold`}>
              {initials}
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {user?.displayName || user?.name || 'Usuário'}
            </p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded"
          >
            <LogOut size={14} />
          </button>
        </div>
        <p className="text-zinc-600 text-xs text-center mt-1">Clique no avatar para trocar a cor</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-surface-800 border-r border-surface-600 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-surface-800 border border-surface-600 rounded-lg"
        >
          <Menu size={18} className="text-white" />
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-56 bg-surface-800 border-r border-surface-600 h-full">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
              {content}
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
          </div>
        )}
      </div>
    </>
  )
}