"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { Wallet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConnectWalletButton() {
  const { isConnected, address, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

