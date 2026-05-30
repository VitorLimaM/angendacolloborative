'use client'

import { Calendar, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  const initials = (user?.displayName || user?.name || 'U')
    .split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

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

      {/* User footer */}
      <div className="p-3 border-t border-surface-600">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-surface-600 transition-colors cursor-default">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
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
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-surface-800 border-r border-surface-600 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile: hamburguer */}
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