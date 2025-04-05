"use client"

import React, { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Shield } from "lucide-react"

// Dynamically import the SelfQRcodeWrapper to avoid SSR issues
const SelfQRcodeWrapper = dynamic(() => import("@selfxyz/qrcode").then((mod) => mod.default), { ssr: false })

interface SelfQrCodeComponentProps {
  userId: string | null
  onSuccess: () => void
}

export function SelfQrCodeComponent({ userId, onSuccess }: SelfQrCodeComponentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selfApp, setSelfApp] = useState<any>(null)

  const fallbackUserId = "0x0123456789abcdef0123456789abcdef01234567"

  const formattedUserId = useMemo(() => {
    if (!userId) return fallbackUserId

    let address = userId.toLowerCase()
    if (!address.startsWith("0x")) {
      address = `0x${address}`
    }

    const isValidAddress = /^0x[a-f0-9]{40}$/i.test(address)
    if (!isValidAddress) {
      console.error("Invalid Ethereum address format:", address)
      return fallbackUserId
    }

    return address
  }, [userId])

  useEffect(() => {
    const buildSelfApp = async () => {
      try {
        const { SelfAppBuilder } = await import("@selfxyz/qrcode")
        const app = new SelfAppBuilder({
          appName: "LuLuChill",
          scope: "luluchill",
          endpoint: "https://luluchill.vercel.app/api/self/verify",
          endpointType: "staging_https",
          logoBase64: "https://upload.wikimedia.org/wikipedia/commons/f/f9/L_cursiva.gif",
          userIdType: "hex",
          userId: formattedUserId,
          disclosures: {
            passport_number: true,
            name: true,
            minimumAge: 18,
            nationality: true,
            ofac: true,
          },
          devMode: true,
        }).build()
        setSelfApp(app)
      } catch (err) {
        console.error("Error building Self app:", err)
        setError((err as Error).message)
      }
    }

    buildSelfApp()
  }, [formattedUserId])

  useEffect(() => {
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
