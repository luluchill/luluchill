"use client"
import {ethers} from "ethers"
import { useEffect, useState } from "react"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  MapPin,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown
} from "lucide-react"
import Image from "next/image"
import { useAccount, useBlockNumber, useReadContracts, useWriteContract } from "wagmi"
type Property = {
  id: number
  name: string
  abbr: string
  agency: string
  landArea: string
  landType: string
  contract: string
  tokenPrice: number
  priceChange: string
  trending: 'up' | 'down'
  totalTokens: number
  totalValue: number
}
import { ConnectWalletButton } from '@/components/connect-wallet-button'
import { useReadContract } from 'wagmi'
import { wagmiContractConfig } from "@/usdc.abi"
import { luluchillRWAContractConfig } from "@/luluchillRWAToken.abi"
import { poolContractConfig } from "@/pool.abi"

export default function RWAPlatform() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  const [usdtAmount, setUsdtAmount] = useState(0)
  const [tokenQuantity, setTokenQuantity] = useState(0)

  const [showGainers, setShowGainers] = useState(true)
  const { address, isConnected } = useAccount(); // 獲取當前錢包地址和連接狀態


  const { data: hash, writeContract } = useWriteContract()



  const { data: usdcBalanceData } = useReadContract({
    ...wagmiContractConfig,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const formattedUsdcBalance = usdcBalanceData
    ? (Number(usdcBalanceData.toString()) / 1e6).toFixed(2)
    : "Loading..."

  const { data: luluchillRWAToken } = useReadContract({
    ...luluchillRWAContractConfig,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  })

  const formattedLuluchillRWATokenBalance = luluchillRWAToken
    ? (Number(luluchillRWAToken.toString()) / 1e18).toFixed(2)
    : "Loading..."


  const { data: blockNumber } = useBlockNumber({ watch: true })

  const connectWallet = () => {
    setWalletConnected(true)
  }

  const openModal = (property) => {
    setSelectedProperty(property)
    setShowModal(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentSlide(0)
    setTokenQuantity(0)
    document.body.style.overflow = 'auto'
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1))
  }

  const properties = [
    {
      id: 1,
      name: "THE LULUCHILL RWA",
      abbr: "LULUCHILLRWA",
      agency: "LLCRWA",
      landArea: "38.78 Acre",
      landType: "Residential",
      contract: "0x3c01c27726BA247a708aB15C0A9430648202773E",
      tokenPrice: 120,
      priceChange: '+5.2%',
      trending: 'up',
      totalTokens: 100,
      totalValue: 12000,
    },
    {
      id: 2,
      name: 'Dapu High-Rise Elevator Building',
      abbr: 'FPA-TCD',
      agency: 'FPA',
      landArea: '14.22 Acre',
      landType: 'Commercial',
      contract: '0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4',
      tokenPrice: 1.58,
      priceChange: '+2.8%',
      trending: 'up',
      totalTokens: 100,
      totalValue: 158,
    },
    {
      id: 3,
      name: 'Large Land Area Detached House',
      abbr: 'TBP-TND',
      agency: 'TBP',
      landArea: '73.26 Acre',
      landType: 'Residential',
      contract: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
      tokenPrice: 56,
      priceChange: '-1.3%',
      trending: 'down',
      totalTokens: 100,
      totalValue: 5600,
    },
    {
      id: 4,
      name: 'Xinwu Square Agricultural Land',
      abbr: 'DAR-TXL',
      agency: 'DAR',
      landArea: '120.45 Acre',
      landType: 'Agricultural',
      contract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      tokenPrice: 11.55,
      priceChange: '+7.2%',
      trending: 'up',
      totalTokens: 100,
      totalValue: 1155,
    },
  ] as Property[]

  // Create empty placeholder rows if needed to always have 5 rows
  const createPlaceholderRows = (count) => {
    const placeholders: any[] = []
    for (let i = 0; i < count; i++) {
      placeholders.push({
        id: `placeholder-${i}`,
        abbr: '',
        agency: '',
        tokenPrice: '',
        priceChange: '',
        trending: 'up',
        totalValue: '',
      })
    }
    return placeholders
  }

  // Get top 5 by market cap with placeholders if needed
  const getTopMarketCap = () => {
    const sorted = [...properties].sort((a, b) => b.totalValue - a.totalValue)
    const top5 = sorted.slice(0, 5)

    if (top5.length < 5) {
      return [...top5, ...createPlaceholderRows(5 - top5.length)]
    }

    return top5
  }

  // Get top 5 gainers/losers with placeholders if needed
  const getTopGainersLosers = () => {
    const filtered = properties.filter((property) =>
      showGainers ? property.trending === 'up' : property.trending === 'down',
    )

    const sorted = filtered.sort((a, b) => {
      const aChange = Number.parseFloat(a.priceChange.replace('%', ''))
      const bChange = Number.parseFloat(b.priceChange.replace('%', ''))
      return showGainers ? bChange - aChange : aChange - bChange
    })

    const top5 = sorted.slice(0, 5)

    if (top5.length < 5) {
      return [...top5, ...createPlaceholderRows(5 - top5.length)]
    }

    return top5
  }

  const handleSwap = () => {
    if (!usdtAmount || usdtAmount <= 0) {
      console.error("Invalid USDT amount");
      return;
    }

    writeContract({
      ...poolContractConfig,
      functionName: "swap",
      args: [
        '0xd737545bE0FFcC4e3ACE1A9E664cA05e58F046f9' as `0x${string}`,
        ethers.parseUnits(usdtAmount.toString(), 6), // 使用動態計算的 USDT 數量
      ],
    });


  };

  const handleApprove = () => {

    writeContract({
      ...wagmiContractConfig,
      functionName: "approve",
      args: [
        poolContractConfig.address, // Approve spender address
        ethers.MaxUint256
      ],
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-primary text-white">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white p-1">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
            <span className="text-2xl font-bold text-accent whitespace-nowrap">
              luluchill
            </span>
            <span className="text-sm ml-2 text-accent">Real Estate Assets</span>
          </div>

          {/* Simplified Navigation */}
          <ConnectWalletButton />
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">USDC Balance</h2>
        {isConnected ? (
          <>
            <p className="text-lg">
              BlockNumber: <span className="font-bold">{blockNumber?.toString() || "Loading..."}</span>
            </p>

            <p className="text-lg">
              USDC : <span className="font-bold">{formattedUsdcBalance} USDC</span>
            </p>

            <p className="text-lg">
              RWA Token: <span className="font-bold">{formattedLuluchillRWATokenBalance?.toString() || "Loading..."}</span>
            </p>

            {/* Approve USDC Section */}
            <div className="mt-4">
              <h3 className="text-base font-bold text-primary mb-2">Approve USDC</h3>
              <button
                onClick={handleApprove}
                className="py-1.5 px-3 bg-primary text-white hover:bg-primary/80 transition-colors rounded-md flex items-center justify-center text-sm"
              >
                Approve
              </button>
            </div>
          </>

        ) : (
          <p className="text-lg text-red-500">Please connect your wallet to view your USDC balance.</p>
        )}
      </div>

      {/* Property Listings */}
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-primary uppercase">
              HOT PROPERTIES
            </h2>
            <h3 className="text-2xl font-bold text-primary">
              Featured Listings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openModal(property)}
              >
                <div className="relative">
                  <Image
                    src="/rwa.png"
                    alt={property.name}
                    width={400}
                    height={200}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-card bg-opacity-90 px-2 py-1 rounded-md text-sm text-primary flex items-center">
                    <div className="w-5 h-5 bg-accent rounded-full mr-2 flex items-center justify-center text-white text-xs">
                      <Image
                        src="/rwa.png"
                        alt={`${property.agency} Logo`}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <span>{property.agency}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-primary mb-1">
                    {property.name}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      ({property.abbr})
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Land Area: {property.landArea}</div>
                    <div>Land Type: {property.landType}</div>
                    <div className="text-xs mt-1 font-mono">
                      Contract: {property.contract}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 border-t pt-3">
                    <div>
                      <div className="text-xs text-gray-500">Token Price</div>
                      <div className="text-sm font-medium">
                        {property.tokenPrice} USDT
                      </div>
                      <div
                        className={`flex items-center text-xs ${property.trending === 'up' ? 'text-success' : 'text-danger'}`}
                      >
                        {property.trending === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span>{property.priceChange}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Tokens</div>
                      <div className="text-sm font-medium">
                        {property.totalTokens}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Value</div>
                      <div className="text-sm font-bold text-danger">
                        {property.totalValue} USDT
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="w-full flex items-center justify-center py-2 px-4 bg-primary text-white hover:bg-primary/80 transition-colors rounded-md text-sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span>More Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Detail Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={closeModal}
          ></div>
          <div className="relative bg-card rounded-lg w-full max-w-5xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 overflow-auto">
              {/* Left Side - Image Carousel and Property Info - 3/5 width */}
              <div
                className="col-span-3 overflow-y-auto pr-2"
                style={{ maxHeight: '80vh' }}
              >
                <div className="relative h-[250px] rounded-lg overflow-hidden">
                  <Image
                    src="/rwa.png"
                    alt={`${(selectedProperty as any).name} - Image ${currentSlide + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-opacity-80 rounded-full p-1"
                  >
                    <ChevronLeft className="h-4 w-4 text-primary" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-opacity-80 rounded-full p-1"
                  >
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full ${currentSlide === index ? 'bg-accent' : 'bg-opacity-50'}`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="text-lg font-bold text-primary">
                    {(selectedProperty as any).name}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      ({selectedProperty.abbr})
                    </span>
                  </h2>


                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-secondary p-1.5 rounded-md">
                      <h3 className="font-medium text-primary text-xs mb-0.5">
                        Property Details
                      </h3>
                      <div className="text-xs">
                        <div className="flex justify-between py-0.5 border-b border-sidebar-border">
                          <span className="text-gray-600">Land Area:</span>
                          <span>{selectedProperty.landArea}</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-sidebar-border">
                          <span className="text-gray-600">Land Type:</span>
                          <span>{selectedProperty.landType}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-600">Property ID:</span>
                          <span>
                            RWA-
                            {selectedProperty.id.toString().padStart(6, '0')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-secondary p-1.5 rounded-md">
                      <h3 className="font-medium text-primary text-xs mb-0.5">
                        Token Details
                      </h3>
                      <div className="text-xs">
                        <div className="flex justify-between py-0.5 border-b border-sidebar-border">
                          <span className="text-gray-600">Token Symbol:</span>
                          <span>{selectedProperty.abbr}</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-sidebar-border">
                          <span className="text-gray-600">Total Supply:</span>
                          <span>{selectedProperty.totalTokens} Tokens</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-600">Current Price:</span>
                          <div className="flex items-center">
                            <span>{selectedProperty.tokenPrice} USDT</span>
                            <div
                              className={`flex items-center text-xs ml-1 ${selectedProperty.trending === 'up' ? 'text-success' : 'text-danger'}`}
                            >
                              {selectedProperty.trending === 'up' ? (
                                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                              ) : (
                                <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                              )}
                              <span>{selectedProperty.priceChange}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary p-1.5 rounded-md mb-2">
                    <h3 className="font-medium text-primary text-xs mb-0.5">
                      Contract Address
                    </h3>
                    <div className="text-xs font-mono p-1 rounded overflow-hidden text-ellipsis">
                      {selectedProperty.contract}
                    </div>
                  </div>

                  <div className="bg-secondary p-1.5 rounded-md">
                    <h3 className="font-medium text-primary text-xs mb-0.5">
                      Description
                    </h3>
                    <p className="text-xs text-gray-600">
                      {selectedProperty.landType.toLowerCase()}. The property has been
                      tokenized into {selectedProperty.totalTokens} tokens, each
                      representing partial ownership. Investors can purchase
                      tokens to gain exposure to this real estate asset without
                      having to buy the entire property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Uniswap-like Purchase Section - 2/5 width */}
              <div className="bg-secondary p-2 rounded-lg flex flex-col col-span-2">
                <h3 className="text-base font-bold text-primary mb-2">
                  Swap Tokens
                </h3>

                {/* Uniswap-like Swap Interface */}
                <div className="rounded-lg p-2 mb-2 flex-1">
                  {/* From (USDT) */}
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-500">From</span>
                      <span className="text-gray-500">Balance: ${usdcBalanceData?.toString()}USDT</span>
                    </div>
                    <div className="flex items-center bg-secondary p-2 rounded-lg">
                      <input
                        type="number"
                        value={usdtAmount}
                        onChange={(e) => {
                          const amount = Number.parseFloat(e.target.value) || 0;
                          setUsdtAmount(amount);
                          setTokenQuantity(amount * 0.99 ); // 動態更新 Token 數量
                        }}
                        className="bg-transparent outline-none flex-1 text-base font-medium"
                        placeholder="0.0"
                      />
                      <div className="flex items-center bg-card py-0.5 px-2 rounded-md ml-2">
                        <Image
                          src="/placeholder.svg?height=16&width=16"
                          alt="USDT"
                          width={16}
                          height={16}
                          className="rounded-full mr-1"
                        />
                        <span className="font-medium text-sm">USDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Swap Icon */}
                  <div className="flex justify-center my-1">
                    <div className="bg-secondary p-1 rounded-full">
                      <ArrowUpDown className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* To (Token) */}
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-500">To</span>
                      <span className="text-gray-500">
                        Balance: 0.00 {selectedProperty.abbr}
                      </span>
                    </div>
                    <div className="flex items-center bg-secondary p-2 rounded-lg">
                      <input
                        type="number"
                        value={tokenQuantity}
                        // onChange={(e) => {
                        //   const quantity = Number.parseFloat(e.target.value) || 0;
                        //   setTokenQuantity(quantity);
                        //   setUsdtAmount(quantity / Number(usdtToRWANormalRate)); // 動態更新 USDT 數量
                        // }}
                        className="bg-transparent outline-none flex-1 text-base font-medium"
                        placeholder="0.0"
                      />
                      <div className="flex items-center bg-card py-0.5 px-2 rounded-md ml-2">
                        <div className="w-4 h-4 bg-accent rounded-full mr-1 flex items-center justify-center text-white text-xs">
                          <Image
                            src="/placeholder.svg?height=16&width=16"
                            alt={`${selectedProperty.agency} Logo`}
                            width={16}
                            height={16}
                            className="rounded-full"
                          />
                        </div>
                        <span className="font-medium text-sm">
                          {selectedProperty.abbr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="mt-2 bg-secondary p-1.5 rounded-lg">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium">
                        1 {selectedProperty.abbr} ={' '}
                        {selectedProperty.tokenPrice} USDT
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Slippage Tolerance</span>
                      <span className="font-medium">0.5%</span>
                    </div>
                  </div>

                  {/* Liquidity Pool Info */}
                  <div className="mt-1.5 bg-secondary p-1.5 rounded-lg">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Liquidity Pool</span>
                      <span className="font-medium">
                        {selectedProperty.abbr}/USDT
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Pool Tokens</span>
                      <span className="font-medium">
                        {selectedProperty.totalTokens} {selectedProperty.abbr}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Pool Depth</span>
                      <span className="font-medium">
                        {selectedProperty.totalValue} USDT
                      </span>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Minimum received</span>
                      <span>
                        {(tokenQuantity * 0.995).toFixed(4)}{' '}
                        {selectedProperty.abbr}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network fee</span>
                      <span>~0.05 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price impact</span>
                      <span className="text-success">{'<'}0.01%</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={closeModal}
                    className="py-1.5 px-3 bg-background text-primary border border-accent hover:bg-accent transition-colors rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button className="py-1.5 px-3 bg-primary text-white hover:bg-primary/80 transition-colors rounded-md flex items-center justify-center text-sm"
                    onClick={handleSwap}>

                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    <span>Swap</span>

                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-2">
                  <h4 className="font-medium text-primary text-xs mb-0.5">
                    Payment Methods
                  </h4>
                  <div className="flex space-x-1.5">
                    <div className=" p-1 rounded border border-accent">
                      <Image
                        src="/placeholder.svg?height=16&width=32"
                        alt="USDT"
                        width={32}
                        height={16}
                      />
                    </div>
                    <div className=" p-1 rounded border border-sidebar-border">
                      <Image
                        src="/placeholder.svg?height=16&width=32"
                        alt="ETH"
                        width={32}
                        height={16}
                      />
                    </div>
                    <div className=" p-1 rounded border border-sidebar-border">
                      <Image
                        src="/placeholder.svg?height=16&width=32"
                        alt="BTC"
                        width={32}
                        height={16}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 text-[10px] text-gray-500">
                  <p>
                    By confirming your swap, you agree to our{' '}
                    <a href="#" className="text-primary underline">
                      Terms of Service
                    </a>{' '}
                    and acknowledge that you have read our{' '}
                    <a href="#" className="text-primary underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
