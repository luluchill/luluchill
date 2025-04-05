'use client'

import { Button } from '@/components/ui/button'
import { useWallet } from '@/components/wallet-provider'
import { Wallet } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NetworkDisplay from '@/components/NetworkDisplay'

export function ConnectWalletButton() {
  const { isConnected, address, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center py-2 px-4 bg-[#D4C19C] text-[#2C2A25] hover:bg-[#C4B18B] transition-colors rounded-md"
          >
            <Wallet className="h-4 w-4" />
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="p-2 border-b">
            <NetworkDisplay />
          </div>
          <DropdownMenuItem onClick={disconnect}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
