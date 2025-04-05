"use client"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import Link from "next/link"
import { ArrowRight, Shield, Wallet, Building } from "lucide-react"
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi"; // 使用 wagmi 來獲取當前錢包地址
import Image from "next/image"

export default function Home() {
  const institutionAddress = "0x941AE41b7e08001c02C910f72CA465B07435903C";
  const { address: currentAddress } = useAccount(); // 獲取當前錢包地址

  useEffect(() => {
    if (currentAddress) {
      if (currentAddress === institutionAddress) {
        redirect("/institution/review"); // 如果是機構，直接重定向到 dashboard
      } else {
        // redirect("/"); // 如果不是機構，重定向到首頁
      }
    } else {
      redirect("/"); // 如果沒有連接錢包，重定向到首頁
    }
  }, [currentAddress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="text-xl font-bold">luluchill</span>
        </div>
        <ConnectWalletButton />
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Trade Real-World Assets.
            <span className="block text-primary">Verified, Compliant, Decentralized.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform enables secure, compliant trading of tokenized real-world assets with institutional
            verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/user/register">
                <Wallet className="h-5 w-5" />
                Connect Wallet to Trade
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Institutional Verification</h3>
            <p className="text-muted-foreground">
              Trusted institutions verify user identities and issue compliance proofs on-chain.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compliant Trading</h3>
            <p className="text-muted-foreground">
              Trade with confidence knowing all participants meet regulatory requirements.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-World Assets</h3>
            <p className="text-muted-foreground">
              Access tokenized real estate, commodities, and other traditional assets on-chain.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
