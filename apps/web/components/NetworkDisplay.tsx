'use client'
import { useAccount, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'

const NetworkDisplay = () => {
  // Get current chain info using useAccount
  const account = useAccount()
  // Get chain switching functionality
  const { chains, error, isPending, status, variables, switchChain } =
    useSwitchChain()

  // Display appropriate message if not connected or no chain info
  if (account.status !== 'connected' || !account.chain) {
    return (
      <div className="text-[#2C2A25] text-sm">Not connected to any network</div>
    )
  }

  return (
    <div className="network-display">
      <div className="current-network">
        <p className="font-medium text-white text-sm">
          Current Network:{' '}
          <span className="font-bold text-white">{account.chain.name}</span>
        </p>
      </div>
      <div className="network-switcher mt-2">
        <p className="text-sm mb-1 text-white">Switch Network:</p>
        <div className="flex flex-wrap gap-2">
          {chains.map((c) => (
            <Button
              key={c.id}
              onClick={() => switchChain({ chainId: c.id })}
              disabled={!switchChain || c.id === account.chainId || isPending}
              className={`text-xs py-1 px-2 ${
                c.id === account.chainId
                  ? 'bg-[#D4C19C] text-[#2C2A25] hover:bg-[#C4B18B]'
                  : 'bg-white text-[#2C2A25] border border-[#D4C19C] hover:bg-[#F5F2EA]'
              } transition-colors rounded-md`}
              size="sm"
            >
              {c.name}
              {isPending && variables?.chainId === c.id && ' (switching...)'}
            </Button>
          ))}
        </div>
        {error && (
          <div className="error-message mt-2 text-red-500 text-sm">
            {error.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkDisplay
