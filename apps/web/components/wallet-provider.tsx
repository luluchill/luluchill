'use client'
import { createContext, useContext, type ReactNode } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import {
  wagmiAdapter,
  projectId,
  polygonAmoy,
  hashKeyChainTestnet,
} from '../../web/walletconnect-config'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// 創建 QueryClient
const queryClient = new QueryClient()

// 設置元數據
const metadata = {
  name: 'luluchill',
  description: 'AppKit Example',
  url: 'https://reown.com/appkit',
  icons: ['https://assets.reown.com/reown-profile-pic.png'],
}

// 創建 modal，添加自定義網路
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygonAmoy, hashKeyChainTestnet], // 添加自定義網路
  defaultNetwork: polygonAmoy,
  metadata: metadata,
  features: {
    analytics: true,
  },
})

// 錢包相關邏輯的類型
type WalletContextType = {
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// 內部 WalletProvider 處理錢包邏輯
function InternalWalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const connect = async () => {
    try {
      await modal.open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected: isConnected || false,
        address: address || null,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// 外部 ContextProvider 處理 Provider 嵌套
export function WalletProvider({
  children,
  cookies = null,
}: {
  children: ReactNode
  cookies?: string | null
}) {
  const initialState = cookies
    ? cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    : undefined

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <InternalWalletProvider>{children}</InternalWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// 暴露使用錢包的 hook
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context as WalletContextType
}
