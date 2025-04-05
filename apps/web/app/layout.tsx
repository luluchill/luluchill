import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RWA Trading Platform',
  description: 'Trade Real-World Assets. Verified, Compliant, Decentralized.',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 使用 await 解析 headers() 返回的 Promise
  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider cookies={cookies}>{children}</WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
