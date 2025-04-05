"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Building, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InstitutionRegister() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Move to success step
      setStep(3)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Institution Registration</h1>
        <p className="text-muted-foreground mt-2">
          Register your institution to issue compliance proofs for RWA trading.
        </p>
      </div>

      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />

        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            <span className="text-sm mt-2 font-medium">
              {s === 1 && "Institution Details"}
              {s === 2 && "Verification"}
              {s === 3 && "Confirmation"}
            </span>
          </div>
        ))}
      </div>

      <Card className="w-full">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Institution Details</CardTitle>
              <CardDescription>Provide information about your institution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Institution Name</Label>
                <Input id="name" placeholder="Acme Financial Services" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Institution Type</Label>
                  <Select required>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="investment">Investment Firm</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                      <SelectItem value="government">Government Entity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select required>
                    <SelectTrigger id="jurisdiction">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your institution and its role in RWA verification..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/">Back</Link>
              </Button>
              <Button onClick={() => setStep(2)} className="gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Verification Information</CardTitle>
              <CardDescription>Provide details for institutional verification.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" placeholder="John Doe" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Registration Number</Label>
                    <Input id="regNumber" placeholder="e.g. LLC12345678" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input id="taxId" placeholder="e.g. 123-45-6789" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Institution Wallet Address</Label>
                  <Input id="walletAddress" placeholder="0x..." required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofTypes">Proof Types to Issue</Label>
                  <Select required>
                    <SelectTrigger id="proofTypes">
                      <SelectValue placeholder="Select proof types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Proof Types</SelectItem>
                      <SelectItem value="kyc">KYC Only</SelectItem>
                      <SelectItem value="aml">AML Only</SelectItem>
                      <SelectItem value="accredited">Accredited Investor Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="font-medium mb-2">Verification Process</h3>
                  <p className="text-sm text-muted-foreground">
                    After submission, our team will review your application and may request additional documentation.
                    Once approved, you'll receive access to the institution dashboard where you can issue compliance
                    proofs.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Application Submitted</CardTitle>
              <CardDescription>Your institution registration has been submitted successfully.</CardDescription>
            </CardHeader>
            <CardContent className="py-8 flex flex-col items-center text-center">
              <div className="rounded-full bg-green-500/10 w-20 h-20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Thank You for Registering</h3>
              <p className="text-muted-foreground max-w-md">
                Your application has been received and is under review. We'll contact you at the provided email address
                with next steps or if we need additional information.
              </p>

              <div className="mt-8 w-full max-w-md p-4 border border-primary/20 bg-primary/5 rounded-lg flex items-center gap-3">
                <Building className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Application ID:</span> INS-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/">Return to Home</a>
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

