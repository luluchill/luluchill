"use client"

import React, { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Shield } from "lucide-react"

// Dynamically import the SelfQRcodeWrapper to avoid SSR issues
const SelfQRcodeWrapper = dynamic(() => import("@selfxyz/qrcode").then((mod) => mod.default), { ssr: false })

// Import the SelfAppBuilder class directly
import { SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode"

interface SelfQrCodeComponentProps {
  userId: string | null
  onSuccess: () => void
}

export function SelfQrCodeComponent({ userId, onSuccess }: SelfQrCodeComponentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use a valid fallback address format
  const fallbackUserId = "0x0123456789abcdef0123456789abcdef01234567"

  // Format and validate the userId
  const formattedUserId = React.useMemo(() => {
    // If no userId is provided, use the fallback
    if (!userId) return fallbackUserId

    // Ensure the address has the 0x prefix and is the correct length
    let address = userId.toLowerCase()
    if (!address.startsWith("0x")) {
      address = `0x${address}`
    }

    // Validate the address format (simple check)
    const isValidAddress = /^0x[a-f0-9]{40}$/i.test(address)
    if (!isValidAddress) {
      console.error("Invalid Ethereum address format:", address)
      return fallbackUserId
    }

    return address
  }, [userId])

  // Create the Self app configuration
  const selfApp = React.useMemo(() => {
    try {
      return new SelfAppBuilder({
        appName: "LuLuChill",
        scope: "luluchill",
        endpoint: "http://luluchill.kth.tw/api/self/verify",
        endpointType: "staging_https",
        logoBase64:
          "https://upload.wikimedia.org/wikipedia/commons/f/f9/L_cursiva.gif",
        userIdType: "hex",
        userId: formattedUserId,
        disclosures: {
          name: true,
          minimumAge: 18,
          nationality: true,
        },
        devMode: true,
      } as Partial<SelfApp>).build()
    } catch (err) {
      console.error("Error building Self app:", err)
      setError((err as Error).message)
      return null
    }
  }, [formattedUserId])

  useEffect(() => {
    // Set loading to false after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-64 h-64 bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <Shield className="h-12 w-12 text-primary/30" />
          <p className="text-sm text-muted-foreground mt-2">Loading QR code...</p>
        </div>
      </div>
    )
  }

  if (error || !selfApp) {
    return (
      <div className="flex items-center justify-center w-64 h-64 bg-white">
        <div className="flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-destructive/50 mb-2" />
          <p className="text-sm text-destructive font-medium">Error loading QR code</p>
          <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg">
      <SelfQRcodeWrapper
        selfApp={selfApp}
        onSuccess={() => {
          console.log("Verification successful")
          onSuccess()
        }}
        darkMode={false}
      />
    </div>
  )
}

