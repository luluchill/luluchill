"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@/components/wallet-provider"
import { CheckCircle2, Clock, ArrowRight, Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SelfQrCodeComponent } from "@/components/self-qrcode-component"
import Link from "next/link"

export default function UserRegistration() {
  const { isConnected, address } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [proofSubmitted, setProofSubmitted] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null)

  // Format the address when it changes
  useEffect(() => {
    if (address) {
      // Ensure the address is properly formatted for Self Protocol
      // This is a simplified check - in production you'd want more validation
      let formatted = address.toLowerCase()
      if (!formatted.startsWith("0x")) {
        formatted = `0x${formatted}`
      }

      // Pad the address if needed (Self Protocol expects a full-length address)
      if (formatted.length < 42) {
        const paddingNeeded = 42 - formatted.length
        const padding = "0".repeat(paddingNeeded - 2) // -2 for the '0x' prefix
        formatted = `0x${padding}${formatted.substring(2)}`
      }

      setFormattedAddress(formatted)
    } else {
      setFormattedAddress(null)
    }
  }, [address])

  const handleVerify = () => {
    setIsQrModalOpen(true)
  }

  const handleQrScanned = () => {
    setIsQrModalOpen(false)
    setProofSubmitted(true)
    setCurrentStep(3)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">User Registration</h1>
        <p className="text-muted-foreground mt-2">
          Complete the verification process to start trading real-world assets.
        </p>
      </div>

      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle>Verification Required</AlertTitle>
        <AlertDescription>
          To ensure regulatory compliance, you&#39;ll need to reveal limited personal information through Self Protocol.
          This information is securely verified without exposing your full identity.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />

        {[1, 2, 3].map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
            </div>
            <span className="text-sm mt-2 font-medium">
              {step === 1 && "Connect Wallet"}
              {step === 2 && "Verify Identity"}
              {step === 3 && "Get Approved"}
            </span>
          </div>
        ))}
      </div>

      <Card className="w-full">
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Connect your Web3 wallet to begin the verification process.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <ConnectWalletButton />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">Back</Link>
              </Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!isConnected} className="gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle>Verify Your Identity</CardTitle>
              <CardDescription>
                Verify your identity through Self Protocol to meet regulatory requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="font-medium mb-2">What information will be verified?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Self Protocol will verify the following information while preserving your privacy:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Age (to confirm you&#39;re over 18)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Nationality (for regulatory compliance)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Accreditation status (for certain assets)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-500/5 rounded-lg p-4 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-500 mb-1">Privacy Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      Your personal information is never stored on-chain. Only cryptographic proofs of verification are
                      published, preserving your privacy while ensuring compliance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleVerify} size="lg" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Verify with Self Protocol
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!proofSubmitted} className="gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle>Waiting for Verification</CardTitle>
              <CardDescription>Your proof has been submitted and is awaiting institution approval.</CardDescription>
            </CardHeader>
            <CardContent className="py-8 flex flex-col items-center text-center">
              <div className="rounded-full bg-amber-500/10 w-20 h-20 flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Verification In Progress</h3>
              <p className="text-muted-foreground max-w-md">
                An institution will review your submission and issue an on-chain attestation. This process typically
                takes 1-2 business days.
              </p>

              <div className="mt-8 w-full max-w-md p-4 border border-amber-500/20 bg-amber-500/5 rounded-lg flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium text-amber-500">Status:</span> Waiting for institution approval
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/trading">Go to Trading Page</a>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan with Self Protocol App</DialogTitle>
            <DialogDescription>
              Scan this QR code with the Self Protocol mobile app to verify your identity.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="bg-white p-4 rounded-lg mb-4">
              <SelfQrCodeComponent
                userId={formattedAddress || "0x0123456789abcdef0123456789abcdef01234567"}
                onSuccess={handleQrScanned}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Don&#39;t have the Self Protocol app?{" "}
              <a 
                href="https://self.xyz/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download here
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

