'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { Calendar, Mail, Lock, User, AlertCircle } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode]       = useState('login')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (name.trim().length < 2) throw new Error('Digite seu nome completo.')
        await signup(email, password, name.trim())
      } else {
        await login(email, password)
      }
      router.push('/dashboard')
    } catch (err) {
      const messages = {
        'auth/email-already-in-use':  'Este e-mail já está cadastrado.',
        'auth/invalid-credential':    'E-mail ou senha incorretos.',
        'auth/weak-password':         'A senha deve ter pelo menos 6 caracteres.',
        'auth/invalid-email':         'E-mail inválido.',
        'auth/user-not-found':        'Usuário não encontrado.',
        'auth/wrong-password':        'Senha incorreta.',
      }
      setError(messages[err.code] || err.message || 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-semibold">AgendaTeam</span>
        </div>

        <div className="bg-surface-800 border border-surface-600 rounded-2xl p-8">
          <h1 className="text-white text-2xl font-bold mb-1">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            {mode === 'login'
              ? 'Entre para ver a agenda do time'
              : 'Junte-se ao time e compartilhe sua disponibilidade'}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-zinc-300 text-sm font-medium block mb-1.5">Nome</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm
                               focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500
                               placeholder:text-zinc-600 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-zinc-300 text-sm font-medium block mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm
                             focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500
                             placeholder:text-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-300 text-sm font-medium block mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm
                             focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500
                             placeholder:text-zinc-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Criar conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-500 text-sm">
              {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}
              {' '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}