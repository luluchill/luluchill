'use client'

import { useState, useEffect } from 'react'
import {
  Wallet,
  UserCheck,
  UserX,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  Calendar,
  RefreshCw,
} from 'lucide-react'

import { useWallet } from '@/components/wallet-provider'
import NetworkDisplay from '@/components/NetworkDisplay'
import { ConnectWalletButton } from '@/components/connect-wallet-button'

export default function InstitutionalReviewBack() {
  const { isConnected, connect, address } = useWallet() // 使用 wallet-provider 提供的功能
  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number
    name: string
    email: string
    walletAddress: string
    status: string
    applicationDate: string
    documents: string[]
    notes: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedCustomer) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedCustomer])

  // Customer data for review
  const customers = [
    {
      id: 1,
      name: 'Wang, Ming-Hua',
      email: 'minghua.wang@example.com',
      walletAddress: '0x7a58c0Be72BE218B41C608b7Fe7C5bB630736C71',
      status: 'pending', // pending, approved, rejected
      applicationDate: '2025-03-28',
      documents: ['ID Verification', 'Proof of Address', 'Bank Statement'],
      notes:
        'Customer has provided all required documents. Awaiting final review.',
    },
    {
      id: 2,
      name: 'Chen, Li-Wei',
      email: 'liwei.chen@example.com',
      walletAddress: '0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4',
      status: 'pending',
      applicationDate: '2025-03-29',
      documents: ['ID Verification', 'Proof of Address'],
      notes:
        'Proof of address document quality is low. May need to request a clearer copy.',
    },
    {
      id: 3,
      name: 'Lin, Yu-Ting',
      email: 'yuting.lin@example.com',
      walletAddress: '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
      status: 'approved',
      applicationDate: '2025-03-25',
      documents: [
        'ID Verification',
        'Proof of Address',
        'Bank Statement',
        'Source of Funds',
      ],
      notes: 'All documents verified successfully.',
    },
    {
      id: 4,
      name: 'Huang, Jia-Cheng',
      email: 'jiacheng.huang@example.com',
      walletAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      status: 'rejected',
      applicationDate: '2025-03-26',
      documents: ['ID Verification', 'Proof of Address'],
      notes: 'Inconsistencies found between ID and address documents.',
    },
    {
      id: 5,
      name: 'Chang, Wei-Jen',
      email: 'weijen.chang@example.com',
      walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      status: 'pending',
      applicationDate: '2025-03-30',
      documents: ['ID Verification', 'Proof of Address', 'Bank Statement'],
      notes:
        'Bank statement shows insufficient activity. May need additional verification.',
    },
    {
      id: 6,
      name: 'Hsu, Mei-Ling',
      email: 'meiling.hsu@example.com',
      walletAddress: '0x1CBd3b2eC6e4C005eFE9825686461B8F58da57Fc',
      status: 'pending',
      applicationDate: '2025-03-30',
      documents: ['ID Verification', 'Proof of Address'],
      notes: '',
    },
    {
      id: 7,
      name: 'Kuo, Tzu-Chien',
      email: 'tzuchien.kuo@example.com',
      walletAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
      status: 'pending',
      applicationDate: '2025-03-29',
      documents: [
        'ID Verification',
        'Proof of Address',
        'Bank Statement',
        'Source of Funds',
      ],
      notes: 'Source of funds document requires additional scrutiny.',
    },
    {
      id: 8,
      name: 'Tsai, Yi-Chen',
      email: 'yichen.tsai@example.com',
      walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
      status: 'pending',
      applicationDate: '2025-03-28',
      documents: ['ID Verification', 'Proof of Address', 'Bank Statement'],
      notes: '',
    },
    {
      id: 9,
      name: 'Yang, Chih-Wei',
      email: 'chihwei.yang@example.com',
      walletAddress: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
      status: 'pending',
      applicationDate: '2025-03-27',
      documents: ['ID Verification'],
      notes: 'Missing proof of address document.',
    },
    {
      id: 10,
      name: 'Wu, Hsiao-Ting',
      email: 'hsiaoting.wu@example.com',
      walletAddress: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
      status: 'pending',
      applicationDate: '2025-03-26',
      documents: ['ID Verification', 'Proof of Address', 'Bank Statement'],
      notes: '',
    },
    {
      id: 11,
      name: 'Cheng, Shih-Chieh',
      email: 'shihchieh.cheng@example.com',
      walletAddress: '0x17F6AD8Ef982297579C203069C1DbfFE4348c372',
      status: 'pending',
      applicationDate: '2025-03-25',
      documents: [
        'ID Verification',
        'Proof of Address',
        'Bank Statement',
        'Source of Funds',
      ],
      notes: 'All documents submitted, pending final review.',
    },
    {
      id: 12,
      name: 'Lee, Tzu-Yun',
      email: 'tzuyun.lee@example.com',
      walletAddress: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678',
      status: 'pending',
      applicationDate: '2025-03-24',
      documents: ['ID Verification', 'Proof of Address'],
      notes: '',
    },
  ]

  // Handle approve
  const handleApprove = (customerId) => {
    // This is just simulating a frontend state change; in reality, you'd call an API
    const updatedCustomers = customers.map((customer) => {
      if (customer.id === customerId) {
        return { ...customer, status: 'approved' }
      }
      return customer
    })
    // In a real application, you'd send an API request here, then update the state
    console.log(`Customer ${customerId} approved`)
    setSelectedCustomer(null)
  }

  // Handle reject
  const handleReject = (customerId) => {
    // This is just simulating a frontend state change; in reality, you'd call an API
    const updatedCustomers = customers.map((customer) => {
      if (customer.id === customerId) {
        return { ...customer, status: 'rejected' }
      }
      return customer
    })
    // In a real application, you'd send an API request here, then update the state
    console.log(`Customer ${customerId} rejected`)
    setSelectedCustomer(null)
  }

  // Filter customer list
  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus =
      filterStatus === 'all' || customer.status === filterStatus
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Count customers by status
  const pendingCount = customers.filter((c) => c.status === 'pending').length
  const approvedCount = customers.filter((c) => c.status === 'approved').length
  const rejectedCount = customers.filter((c) => c.status === 'rejected').length
  const totalCount = customers.length

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: '#F5F2EA', color: '#2C2A25' }}
    >
      {/* Navigation Bar */}
      <header className="bg-[#2C2A25] text-white">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#D4C19C] whitespace-nowrap">
              TOKENEST
            </span>
            <span className="text-sm ml-2 text-[#D4C19C]">
              Institutional Review Panel
            </span>
          </div>
          <ConnectWalletButton />
          {/* Updated Wallet Connection */}
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex-1 py-6"
        style={{ backgroundColor: '#F5F2EA', color: '#2C2A25' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-2xl font-bold text-[#2C2A25] mb-4 md:mb-0">
              Customer Verification Management
            </h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  filterStatus === 'all'
                    ? 'bg-[#2C2A25] text-white'
                    : 'bg-white text-[#2C2A25] border border-[#D4C19C]'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  filterStatus === 'pending'
                    ? 'bg-[#2C2A25] text-white'
                    : 'bg-white text-[#2C2A25] border border-[#D4C19C]'
                }`}
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  filterStatus === 'approved'
                    ? 'bg-[#2C2A25] text-white'
                    : 'bg-white text-[#2C2A25] border border-[#D4C19C]'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                  filterStatus === 'rejected'
                    ? 'bg-[#2C2A25] text-white'
                    : 'bg-white text-[#2C2A25] border border-[#D4C19C]'
                }`}
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Rejected ({rejectedCount})
              </button>
            </div>
          </div>

          {/* Status Summary Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="rounded-full bg-amber-100 p-2 mr-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">
                    Verification Summary
                  </h3>
                  <p className="text-2xl font-bold text-[#2C2A25]">
                    {pendingCount}{' '}
                    <span className="text-sm text-gray-500">pending</span> /{' '}
                    {totalCount}{' '}
                    <span className="text-sm text-gray-500">total</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-2 mr-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Approved</h3>
                    <p className="text-xl font-bold text-[#2C2A25]">
                      {approvedCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="rounded-full bg-red-100 p-2 mr-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Rejected</h3>
                    <p className="text-xl font-bold text-[#2C2A25]">
                      {rejectedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex md:w-1/2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email or wallet address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-[#D4C19C] rounded-md focus:outline-none focus:ring-1 focus:ring-[#D4C19C]"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <button className="ml-2 bg-[#2C2A25] text-white px-4 py-2 rounded-md">
                  Search
                </button>
              </div>
              <div className="flex space-x-2 md:w-1/2 justify-end">
                <button
                  className="flex items-center bg-white border border-[#D4C19C] text-[#2C2A25] px-4 py-2 rounded-md"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Advanced Filters</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                <button className="flex items-center bg-white border border-[#D4C19C] text-[#2C2A25] px-4 py-2 rounded-md">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Date Range</span>
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                    Document Status
                  </label>
                  <select className="w-full p-2 border border-[#D4C19C] rounded-md">
                    <option>All Statuses</option>
                    <option>Complete Documents</option>
                    <option>Missing Documents</option>
                    <option>Additional Verification Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                    Application Date
                  </label>
                  <select className="w-full p-2 border border-[#D4C19C] rounded-md">
                    <option>All Time</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2A25] mb-1">
                    Sort By
                  </label>
                  <select className="w-full p-2 border border-[#D4C19C] rounded-md">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Customer List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#2C2A25] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Customer ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Customer Info
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Wallet Address
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Application Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="py-3 px-4 text-sm">
                        {customer.id.toString().padStart(6, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#2C2A25]">
                            {customer.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {customer.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-xs font-mono bg-gray-100 p-1 rounded">
                            {customer.walletAddress.slice(0, 6)}...
                            {customer.walletAddress.slice(-4)}
                          </span>
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(
                                customer.walletAddress,
                              )
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {customer.applicationDate}
                      </td>
                      <td className="py-3 px-4">
                        {customer.status === 'pending' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        ) : customer.status === 'approved' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedCustomer(customer)
                            }}
                            className="bg-[#F5F2EA] text-[#2C2A25] px-2 py-1 rounded text-xs"
                          >
                            View
                          </button>
                          {customer.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleApprove(customer.id)
                                }}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center"
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReject(customer.id)
                                }}
                                className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center"
                              >
                                <UserX className="h-3 w-3 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-[#D4C19C] text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'text-gray-400 bg-gray-100'
                        : 'text-[#2C2A25] bg-white hover:bg-[#F5F2EA]'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-[#D4C19C] text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 bg-gray-100'
                        : 'text-[#2C2A25] bg-white hover:bg-[#F5F2EA]'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredCustomers.length,
                        )}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">
                        {filteredCustomers.length}
                      </span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#D4C19C] ${
                          currentPage === 1
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-[#2C2A25] bg-white hover:bg-[#F5F2EA]'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-[#D4C19C] text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-[#2C2A25] text-white'
                              : 'bg-white text-[#2C2A25] hover:bg-[#F5F2EA]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#D4C19C] ${
                          currentPage === totalPages
                            ? 'text-gray-400 bg-gray-100'
                            : 'text-[#2C2A25] bg-white hover:bg-[#F5F2EA]'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setSelectedCustomer(null)}
          ></div>
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-5xl mx-4 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#2C2A25] text-white p-4">
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-white hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information - Left Side */}
                <div>
                  <h3 className="text-xl font-semibold text-[#2C2A25] mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-1/3 text-gray-500">Customer ID</div>
                      <div className="w-2/3 font-medium">
                        {selectedCustomer.id.toString().padStart(6, '0')}
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-500">Name</div>
                      <div className="w-2/3 font-medium">
                        {selectedCustomer.name}
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-500">Email</div>
                      <div className="w-2/3 font-medium">
                        {selectedCustomer.email}
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-500">Wallet Address</div>
                      <div className="w-2/3 font-medium"></div>
                      <div className="flex items-center">
                        <span
                          className="font-mono bg-gray-100 p-1 rounded text-xs truncate max-w-[200px] md:max-w-[280px]"
                          title={selectedCustomer.walletAddress}
                        >
                          {selectedCustomer.walletAddress}
                        </span>
                        <button
                          className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              selectedCustomer.walletAddress,
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/3 text-gray-500">Application Date</div>
                    <div className="w-2/3 font-medium">
                      {selectedCustomer.applicationDate}
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/3 text-gray-500">Status</div>
                    <div className="w-2/3">
                      {selectedCustomer.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      ) : selectedCustomer.status === 'approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Self Protocol Verification - Right Side */}
              <div>
                <h3 className="text-xl font-semibold text-[#2C2A25] mb-4 pb-2 border-b border-gray-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#D4C19C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Self Protocol Verification
                </h3>

                <div className="bg-[#F5F2EA] bg-opacity-60 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-[#D4C19C] flex items-center justify-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verified via</p>
                      <p className="text-md font-medium text-[#2C2A25]">
                        Passport
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-sm font-medium">
                        {selectedCustomer.name}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Nationality</p>
                      <p className="text-sm font-medium">Taiwan</p>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Age</p>
                      <p className="text-sm font-medium">35</p>
                    </div>
                    <div className="bg-white p-3 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Gender</p>
                      <p className="text-sm font-medium">Male</p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-[#D4C19C]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Verified on {selectedCustomer.applicationDate} through
                      Self Protocol
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
            {selectedCustomer.status === 'pending' ? (
              <>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="py-2 px-4 border border-[#D4C19C] rounded-md text-[#2C2A25] hover:bg-[#F5F2EA] transition-colors"
                >
                  Close
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(selectedCustomer.id)}
                    className="py-2 px-4 border border-red-300 bg-red-50 rounded-md text-red-700 hover:bg-red-100 transition-colors flex items-center"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedCustomer.id)}
                    className="py-2 px-4 bg-[#2C2A25] rounded-md text-white hover:bg-[#3A382F] transition-colors flex items-center"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Approve Application
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="py-2 px-4 border border-[#D4C19C] rounded-md text-[#2C2A25] hover:bg-[#F5F2EA] transition-colors"
                >
                  Close
                </button>
                <button className="py-2 px-4 bg-[#2C2A25] rounded-md text-white hover:bg-[#3A382F] transition-colors">
                  Edit Customer Information
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
