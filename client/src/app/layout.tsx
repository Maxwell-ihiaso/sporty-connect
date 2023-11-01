// "use client"

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { theme } from '@/styles/theme'
import { ThemeProvider } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
  title: 'Sporty Connect',
  description: 'Stay connected with sport lovers of your kind around the globe.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>

        {children}
        </ThemeProvider>
        </body>
    </html>
  )
}
