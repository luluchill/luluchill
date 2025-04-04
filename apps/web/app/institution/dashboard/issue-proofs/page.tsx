"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileCheck, CheckCircle2 } from "lucide-react"

export default function IssueProofs() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issue Proofs</h1>
        <p className="text-muted-foreground mt-2">
          Issue compliance proofs for users to enable trading on the platform.
        </p>
      </div>

      <Tabs defaultValue="issue">
        <TabsList>
          <TabsTrigger value="issue">Issue New Proof</TabsTrigger>
          <TabsTrigger value="history">Proof History</TabsTrigger>
        </TabsList>

        <TabsContent value="issue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter the user details to generate and publish a compliance proof.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="user@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input id="wallet" placeholder="0x..." required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select required>
                      <SelectTrigger id="nationality">
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="sg">Singapore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type</Label>
                    <Select required>
                      <SelectTrigger id="idType">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driverLicense">Driver's License</SelectItem>
                        <SelectItem value="nationalId">National ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input id="idNumber" placeholder="ID12345678" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proofType">Proof Type</Label>
                  <Select required>
                    <SelectTrigger id="proofType">
                      <SelectValue placeholder="Select proof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kyc">KYC Verification</SelectItem>
                      <SelectItem value="aml">AML Compliance</SelectItem>
                      <SelectItem value="accredited">Accredited Investor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="gap-2 w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      Generate Proof & Publish EAS
                    </>
                  )}
                </Button>

                {isSuccess && (
                  <div className="ml-4 flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Proof successfully published!</span>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Previously Issued Proofs</CardTitle>
              <CardDescription>View and manage all proofs issued by your institution.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">User #{Math.floor(Math.random() * 1000)}</p>
                        <Badge variant="outline" className="ml-2">
                          {["KYC", "AML", "Accredited"][i % 3]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        0x{Math.random().toString(16).substring(2, 10)}...{Math.random().toString(16).substring(2, 10)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued: {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

