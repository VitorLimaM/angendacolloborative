import { Geist } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata = {
  title: 'AgendaTeam — Disponibilidade Colaborativa',
  description: 'Visualize e gerencie a disponibilidade de toda a equipe.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} bg-surface-900 text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}