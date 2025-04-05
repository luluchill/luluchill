'use client'

import { useState } from 'react'
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
  ArrowUpDown,
} from 'lucide-react'
import Image from 'next/image'
type Property = {
  id: number
  name: string
  abbr: string
  agency: string
  location: {
    county: string
    township: string
  }
  landArea: string
  landType: string
  contract: string
  tokenPrice: number
  priceChange: string
  trending: 'up' | 'down'
  totalTokens: number
  totalValue: number
}
import { useWallet, WalletProvider } from '@/components/wallet-provider'
import { ConnectWalletButton } from '@/components/connect-wallet-button'

export default function RWAPlatform() {
  const [showModal, setShowModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [usdtAmount, setUsdtAmount] = useState(0)
  const [tokenQuantity, setTokenQuantity] = useState(0)
  const [showGainers, setShowGainers] = useState(true)

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
      name: 'Brand New Townhouse in Toufen',
      abbr: 'TREG-MTC',
      agency: 'TREG',
      location: {
        county: 'Miaoli County',
        township: 'Toufen Township',
      },
      landArea: '38.78 Acre',
      landType: 'Residential',
      contract: '0x7a58c0Be72BE218B41C608b7Fe7C5bB630736C71',
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
      location: {
        county: 'Taichung City',
        township: 'Dali District',
      },
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
      location: {
        county: 'Taipei City',
        township: 'Neihu District',
      },
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
      location: {
        county: 'Taoyuan City',
        township: 'Xinwu District',
      },
      landArea: '120.45 Acre',
      landType: 'Agricultural',
      contract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      tokenPrice: 11.55,
      priceChange: '+7.2%',
      trending: 'up',
      totalTokens: 100,
      totalValue: 1155,
    },
  ]

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

  const { isConnected, address, connect, disconnect } = useWallet()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-[#2C2A25] text-white">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#D4C19C] whitespace-nowrap">
              TOKENEST
            </span>
            <span className="text-sm ml-2 text-[#D4C19C]">
              Real Estate Assets
            </span>
          </div>

          {/* Simplified Navigation */}
          <ConnectWalletButton />
        </div>
      </header>

      {/* Hero Section with Background */}
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1600"
            alt="City skyline"
            fill
            className="object-cover"
          />
        </div>

        {/* Search Section and Market Rankings Side by Side */}
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Section - 左側佔2/4 */}
            <div className="lg:col-span-2">
              <div className="bg-[#F5F2EA] bg-opacity-90 rounded-lg p-4 h-full">
                <h2 className="text-xl font-bold text-[#2C2A25] mb-3">
                  Find Properties
                </h2>
                {/* Search Input */}
                <div className="mb-3">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter keywords"
                      className="w-full p-2 border border-[#D4C19C] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#D4C19C]"
                    />
                    <button className="bg-[#2C2A25] text-white px-3 py-2 rounded-r-md">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Reorganized Filter Options - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                      County/City
                    </label>
                    <select className="w-full p-2 border border-[#D4C19C] rounded-md bg-white text-sm">
                      <option>Any County/City</option>
                      <option>Taipei City</option>
                      <option>New Taipei City</option>
                      <option>Taoyuan City</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                      Township/District
                    </label>
                    <select className="w-full p-2 border border-[#D4C19C] rounded-md bg-white text-sm">
                      <option>Any Township/District</option>
                      <option>Zhongzheng District</option>
                      <option>Da'an District</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                      Property Type
                    </label>
                    <select className="w-full p-2 border border-[#D4C19C] rounded-md bg-white text-sm">
                      <option>Any Type</option>
                      <option>Apartment</option>
                      <option>Condominium</option>
                    </select>
                  </div>
                </div>

                {/* Reorganized Filter Options - Row 2 */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                      Token Price (USDT)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#D4C19C] rounded-l-md text-sm"
                        placeholder="Min"
                      />
                      <span className="mx-1">-</span>
                      <input
                        type="text"
                        className="w-full p-2 border border-[#D4C19C] rounded-r-md text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                      Size (Acre)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-full p-2 border border-[#D4C19C] rounded-l-md text-sm"
                        placeholder="Min"
                      />
                      <span className="mx-1">-</span>
                      <input
                        type="text"
                        className="w-full p-2 border border-[#D4C19C] rounded-r-md text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <button className="text-sm text-[#2C2A25] underline">
                      Advanced
                    </button>
                  </div>
                  <div>
                    <button className="bg-[#2C2A25] text-white px-3 py-2 rounded-md text-sm">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Cap 排行榜 - 右側第一個1/4 */}
            <div className="lg:col-span-1">
              <div className="bg-[#F5F2EA] bg-opacity-90 rounded-lg p-4 h-full">
                <h2 className="text-lg font-bold text-[#2C2A25] mb-3">
                  Top 5 Market Cap
                </h2>
                <div className="bg-white rounded-lg p-3">
                  <div className="overflow-hidden rounded-lg">
                    <table className="min-w-full">
                      <thead className="bg-[#2C2A25] text-white">
                        <tr>
                          <th className="py-1 px-1 text-left text-xs font-medium">
                            #
                          </th>
                          <th className="py-1 px-1 text-left text-xs font-medium">
                            Token
                          </th>
                          <th className="py-1 px-1 text-right text-xs font-medium">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getTopMarketCap().map((property, index) => (
                          <tr
                            key={property.id}
                            className={`${property.id.toString().includes('placeholder') ? '' : 'hover:bg-gray-50 cursor-pointer'}`}
                            onClick={() =>
                              property.id.toString().includes('placeholder')
                                ? null
                                : openModal(property)
                            }
                          >
                            <td className="py-1 px-1 text-xs">{index + 1}</td>
                            <td className="py-1 px-1">
                              {property.id
                                .toString()
                                .includes('placeholder') ? (
                                <div className="h-6"></div>
                              ) : (
                                <div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-[#D4C19C] rounded-full mr-1 flex items-center justify-center">
                                      <Image
                                        src="/placeholder.svg?height=12&width=12"
                                        alt={`${property.agency} Logo`}
                                        width={12}
                                        height={12}
                                        className="rounded-full"
                                      />
                                    </div>
                                    <span className="text-xs font-medium">
                                      {property.abbr}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500 ml-4">
                                    ${property.totalValue}{' '}
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="py-1 px-1 text-xs text-right">
                              {property.id.toString().includes('placeholder')
                                ? ''
                                : `${property.tokenPrice} USDT`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Gainers/Losers 排行榜 - 右側第二個1/4 */}
            <div className="lg:col-span-1">
              <div className="bg-[#F5F2EA] bg-opacity-90 rounded-lg p-4 h-full">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-[#2C2A25]">
                    {showGainers ? 'Top Gainers' : 'Top Losers'}
                  </h2>
                  <div className="flex items-center bg-white rounded-full p-0.5">
                    <button
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        showGainers
                          ? 'bg-[#2C2A25] text-white'
                          : 'text-[#2C2A25]'
                      }`}
                      onClick={() => setShowGainers(true)}
                    >
                      Gainers
                    </button>
                    <button
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        !showGainers
                          ? 'bg-[#2C2A25] text-white'
                          : 'text-[#2C2A25]'
                      }`}
                      onClick={() => setShowGainers(false)}
                    >
                      Losers
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="overflow-hidden rounded-lg">
                    <table className="min-w-full">
                      <thead className="bg-[#2C2A25] text-white">
                        <tr>
                          <th className="py-1 px-1 text-left text-xs font-medium">
                            #
                          </th>
                          <th className="py-1 px-1 text-left text-xs font-medium">
                            Token
                          </th>
                          <th className="py-1 px-1 text-right text-xs font-medium">
                            24h
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {getTopGainersLosers().map((property, index) => (
                          <tr
                            key={property.id}
                            className={`${property.id.toString().includes('placeholder') ? '' : 'hover:bg-gray-50 cursor-pointer'}`}
                            onClick={() =>
                              property.id.toString().includes('placeholder')
                                ? null
                                : openModal(property)
                            }
                          >
                            <td className="py-1 px-1 text-xs">{index + 1}</td>
                            <td className="py-1 px-1">
                              {property.id
                                .toString()
                                .includes('placeholder') ? (
                                <div className="h-6"></div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-[#D4C19C] rounded-full mr-1 flex items-center justify-center">
                                    <Image
                                      src="/placeholder.svg?height=12&width=12"
                                      alt={`${property.agency} Logo`}
                                      width={12}
                                      height={12}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <span className="text-xs font-medium">
                                    {property.abbr}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td
                              className={`py-1 px-1 text-xs text-right font-medium ${
                                property.id.toString().includes('placeholder')
                                  ? ''
                                  : property.trending === 'up'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                              }`}
                            >
                              {property.id
                                .toString()
                                .includes('placeholder') ? (
                                ''
                              ) : (
                                <div className="flex items-center justify-end">
                                  {property.trending === 'up' ? (
                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                  )}
                                  <span>{property.priceChange}</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Property Listings */}
      <div className="bg-[#F5F2EA] py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-[#2C2A25] uppercase">
              HOT PROPERTIES
            </h2>
            <h3 className="text-2xl font-bold text-[#2C2A25]">
              Featured Listings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openModal(property)}
              >
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt={property.name}
                    width={400}
                    height={200}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-2 py-1 rounded-md text-sm text-[#2C2A25] flex items-center">
                    <div className="w-5 h-5 bg-[#D4C19C] rounded-full mr-2 flex items-center justify-center text-white text-xs">
                      <Image
                        src="/placeholder.svg?height=20&width=20"
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
                  <div className="flex items-center mb-2 bg-[#F5F2EA] p-2 rounded-md">
                    <MapPin className="h-4 w-4 text-[#2C2A25] mr-2" />
                    <div>
                      <span className="text-sm font-bold text-[#2C2A25]">
                        {property.location.county}
                      </span>
                      <span className="text-sm text-[#2C2A25] mx-1">›</span>
                      <span className="text-sm text-[#2C2A25]">
                        {property.location.township}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-[#2C2A25] mb-1">
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
                        className={`flex items-center text-xs ${property.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}
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
                      <div className="text-sm font-bold text-red-600">
                        {property.totalValue} USDT
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="w-full flex items-center justify-center py-2 px-4 bg-[#2C2A25] text-white hover:bg-[#3A382F] transition-colors rounded-md text-sm">
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
          <div className="relative bg-white rounded-lg w-full max-w-5xl mx-4 flex flex-col max-h-[90vh] overflow-hidden">
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
                    src="/placeholder.svg?height=300&width=600"
                    alt={`${(selectedProperty as any).name} - Image ${currentSlide + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1"
                  >
                    <ChevronLeft className="h-4 w-4 text-[#2C2A25]" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1"
                  >
                    <ChevronRight className="h-4 w-4 text-[#2C2A25]" />
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-1.5 h-1.5 rounded-full ${currentSlide === index ? 'bg-[#D4C19C]' : 'bg-white bg-opacity-50'}`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="text-lg font-bold text-[#2C2A25]">
                    {(selectedProperty as any).name}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      ({selectedProperty.abbr})
                    </span>
                  </h2>

                  <div className="flex items-center my-1 bg-[#F5F2EA] p-1.5 rounded-md">
                    <MapPin className="h-3 w-3 text-[#2C2A25] mr-1" />
                    <div>
                      <span className="font-bold text-[#2C2A25] text-xs">
                        {selectedProperty.location.county}
                      </span>
                      <span className="text-[#2C2A25] mx-1 text-xs">›</span>
                      <span className="text-[#2C2A25] text-xs">
                        {selectedProperty.location.township}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-[#F5F2EA] p-1.5 rounded-md">
                      <h3 className="font-medium text-[#2C2A25] text-xs mb-0.5">
                        Property Details
                      </h3>
                      <div className="text-xs">
                        <div className="flex justify-between py-0.5 border-b border-gray-200">
                          <span className="text-gray-600">Land Area:</span>
                          <span>{selectedProperty.landArea}</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-gray-200">
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

                    <div className="bg-[#F5F2EA] p-1.5 rounded-md">
                      <h3 className="font-medium text-[#2C2A25] text-xs mb-0.5">
                        Token Details
                      </h3>
                      <div className="text-xs">
                        <div className="flex justify-between py-0.5 border-b border-gray-200">
                          <span className="text-gray-600">Token Symbol:</span>
                          <span>{selectedProperty.abbr}</span>
                        </div>
                        <div className="flex justify-between py-0.5 border-b border-gray-200">
                          <span className="text-gray-600">Total Supply:</span>
                          <span>{selectedProperty.totalTokens} Tokens</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-gray-600">Current Price:</span>
                          <div className="flex items-center">
                            <span>{selectedProperty.tokenPrice} USDT</span>
                            <div
                              className={`flex items-center text-xs ml-1 ${selectedProperty.trending === 'up' ? 'text-green-600' : 'text-red-600'}`}
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

                  <div className="bg-[#F5F2EA] p-1.5 rounded-md mb-2">
                    <h3 className="font-medium text-[#2C2A25] text-xs mb-0.5">
                      Contract Address
                    </h3>
                    <div className="text-xs font-mono bg-white p-1 rounded overflow-hidden text-ellipsis">
                      {selectedProperty.contract}
                    </div>
                  </div>

                  <div className="bg-[#F5F2EA] p-1.5 rounded-md">
                    <h3 className="font-medium text-[#2C2A25] text-xs mb-0.5">
                      Description
                    </h3>
                    <p className="text-xs text-gray-600">
                      This {selectedProperty.landType.toLowerCase()} property is
                      located in {selectedProperty.location.township},{' '}
                      {selectedProperty.location.county}. The property has been
                      tokenized into {selectedProperty.totalTokens} tokens, each
                      representing partial ownership. Investors can purchase
                      tokens to gain exposure to this real estate asset without
                      having to buy the entire property.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Uniswap-like Purchase Section - 2/5 width */}
              <div className="bg-[#F5F2EA] p-2 rounded-lg flex flex-col col-span-2">
                <h3 className="text-base font-bold text-[#2C2A25] mb-2">
                  Swap Tokens
                </h3>

                {/* Uniswap-like Swap Interface */}
                <div className="bg-white rounded-lg p-2 mb-2 flex-1">
                  {/* From (USDT) */}
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-500">From</span>
                      <span className="text-gray-500">
                        Balance: 1,245.00 USDT
                      </span>
                    </div>
                    <div className="flex items-center bg-[#F5F2EA] p-2 rounded-lg">
                      <input
                        type="number"
                        value={usdtAmount}
                        onChange={(e) => {
                          const usdtAmount =
                            Number.parseFloat(e.target.value) || 0
                          setUsdtAmount(usdtAmount)
                          setTokenQuantity(
                            usdtAmount / selectedProperty.tokenPrice,
                          )
                        }}
                        className="bg-transparent outline-none flex-1 text-base font-medium"
                        placeholder="0.0"
                      />
                      <div className="flex items-center bg-white py-0.5 px-2 rounded-md ml-2">
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
                    <div className="bg-[#F5F2EA] p-1 rounded-full">
                      <ArrowUpDown className="h-4 w-4 text-[#2C2A25]" />
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
                    <div className="flex items-center bg-[#F5F2EA] p-2 rounded-lg">
                      <input
                        type="number"
                        value={tokenQuantity}
                        onChange={(e) => {
                          setTokenQuantity(
                            Number.parseFloat(e.target.value) || 0,
                          )
                          setUsdtAmount(
                            Number.parseFloat(e.target.value) *
                              selectedProperty.tokenPrice,
                          )
                        }}
                        className="bg-transparent outline-none flex-1 text-base font-medium"
                        placeholder="0.0"
                      />
                      <div className="flex items-center bg-white py-0.5 px-2 rounded-md ml-2">
                        <div className="w-4 h-4 bg-[#D4C19C] rounded-full mr-1 flex items-center justify-center text-white text-xs">
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
                  <div className="mt-2 bg-[#F5F2EA] p-1.5 rounded-lg">
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
                  <div className="mt-1.5 bg-[#F5F2EA] p-1.5 rounded-lg">
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
                      <span className="text-green-600">{'<'}0.01%</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={closeModal}
                    className="py-1.5 px-3 bg-white text-[#2C2A25] border border-[#D4C19C] hover:bg-[#F5F2EA] transition-colors rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button className="py-1.5 px-3 bg-[#2C2A25] text-white hover:bg-[#3A382F] transition-colors rounded-md flex items-center justify-center text-sm">
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                    <span>Swap</span>
                  </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-2">
                  <h4 className="font-medium text-[#2C2A25] text-xs mb-0.5">
                    Payment Methods
                  </h4>
                  <div className="flex space-x-1.5">
                    <div className="bg-white p-1 rounded border border-[#D4C19C]">
                      <Image
                        src="/placeholder.svg?height=16&width=32"
                        alt="USDT"
                        width={32}
                        height={16}
                      />
                    </div>
                    <div className="bg-white p-1 rounded border border-gray-200">
                      <Image
                        src="/placeholder.svg?height=16&width=32"
                        alt="ETH"
                        width={32}
                        height={16}
                      />
                    </div>
                    <div className="bg-white p-1 rounded border border-gray-200">
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
                    <a href="#" className="text-[#2C2A25] underline">
                      Terms of Service
                    </a>{' '}
                    and acknowledge that you have read our{' '}
                    <a href="#" className="text-[#2C2A25] underline">
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
