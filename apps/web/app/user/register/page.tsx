"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@/components/wallet-provider"
import { CheckCircle2, Clock, ArrowRight } from "lucide-react"

export default function UserRegistration() {
  const { isConnected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [proofSubmitted, setProofSubmitted] = useState(false)

  const handleSubmitProof = () => {
    setProofSubmitted(true)
    setCurrentStep(3)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">User Registration</h1>
        <p className="text-muted-foreground mt-2">
          Complete the verification process to start trading real-world assets.
        </p>
      </div>

      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />

        {[1, 2, 3].map((step) => (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
            </div>
            <span className="text-sm mt-2 font-medium">
              {step === 1 && "Connect Wallet"}
              {step === 2 && "Submit Proof"}
              {step === 3 && "Get Verified"}
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
              <div />
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
              <CardTitle>Submit Verification Proof</CardTitle>
              <CardDescription>Submit your proof via Self Protocol to get verified by an institution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h3 className="font-medium mb-2">What is Self Protocol?</h3>
                <p className="text-sm text-muted-foreground">
                  Self Protocol enables secure, privacy-preserving identity verification. Your personal information
                  remains encrypted while allowing institutions to verify your eligibility to trade.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Wallet Connected</p>
                    <p className="text-sm text-muted-foreground">Your wallet is successfully connected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Submit Proof</p>
                    <p className="text-sm text-muted-foreground">Click the button below to submit your proof</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="rounded-full bg-muted w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Institution Verification</p>
                    <p className="text-sm text-muted-foreground">Wait for institution approval</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmitProof} className="gap-2">
                Submit Proof
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
    </div>
  )
}

