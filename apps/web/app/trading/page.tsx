"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/components/wallet-provider"
import { AlertCircle, ArrowUpDown, Clock, CheckCircle2, Building, Wallet } from "lucide-react"

// Mock data for tokens
const tokens = [
  {
    id: 1,
    name: "Tokenized Real Estate Fund",
    symbol: "TREF",
    price: 125.42,
    change: 2.34,
    liquidity: "2.5M",
    type: "Real Estate",
  },
  {
    id: 2,
    name: "Carbon Credit Token",
    symbol: "CCT",
    price: 18.75,
    change: -0.89,
    liquidity: "1.2M",
    type: "Commodity",
  },
  {
    id: 3,
    name: "Infrastructure Bond Token",
    symbol: "IBT",
    price: 98.12,
    change: 0.54,
    liquidity: "3.8M",
    type: "Bond",
  },
  {
    id: 4,
    name: "Fractional Art Ownership",
    symbol: "FAO",
    price: 452.67,
    change: 5.21,
    liquidity: "950K",
    type: "Collectible",
  },
  {
    id: 5,
    name: "Renewable Energy Fund",
    symbol: "REF",
    price: 75.3,
    change: 1.12,
    liquidity: "4.2M",
    type: "Energy",
  },
]

export default function TradingPage() {
  const { isConnected } = useWallet()
  const [isVerified, setIsVerified] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RWA Trading</h1>
          <p className="text-muted-foreground mt-1">Trade tokenized real-world assets on our compliant platform.</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isVerified ? "default" : "outline"} className="gap-1 py-1.5 px-2.5">
            {isVerified ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                <span>Pending Verification</span>
              </>
            )}
          </Badge>

          <Button variant="outline" size="sm" onClick={() => setIsVerified(!isVerified)} className="gap-1">
            <Wallet className="h-4 w-4" />
            Toggle Status (Demo)
          </Button>
        </div>
      </div>

      {!isVerified && (
        <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-500">Verification Required</AlertTitle>
          <AlertDescription>
            You need institution approval before trading. Please complete the verification process.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
            asChild
          >
            <a href="/user/register">Complete Verification</a>
          </Button>
        </Alert>
      )}

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="real-estate">Real Estate</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm" className="gap-1">
            <ArrowUpDown className="h-4 w-4" />
            Sort by Price
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <Card key={token.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{token.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{token.symbol}</Badge>
                        <Badge variant="secondary" className="bg-secondary/50">
                          {token.type}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-xl font-bold">${token.price.toFixed(2)}</p>
                      <p className={`text-xs ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {token.change >= 0 ? "+" : ""}
                        {token.change}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Liquidity</p>
                      <p className="text-xl font-bold">${token.liquidity}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-2">
                  <Button className="w-full" disabled={!isVerified}>
                    {isVerified ? "Trade Now" : "Verification Required"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="real-estate" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens
              .filter((t) => t.type === "Real Estate")
              .map((token) => (
                <Card key={token.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{token.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{token.symbol}</Badge>
                          <Badge variant="secondary" className="bg-secondary/50">
                            {token.type}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 py-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-xl font-bold">${token.price.toFixed(2)}</p>
                        <p className={`text-xs ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {token.change >= 0 ? "+" : ""}
                          {token.change}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Liquidity</p>
                        <p className="text-xl font-bold">${token.liquidity}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-2">
                    <Button className="w-full" disabled={!isVerified}>
                      {isVerified ? "Trade Now" : "Verification Required"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Other tabs would follow the same pattern */}
      </Tabs>
    </div>
  )
}

