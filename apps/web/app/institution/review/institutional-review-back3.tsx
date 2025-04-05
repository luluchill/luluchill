'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 使用 next/navigation 進行重定向
import { useAccount, useConnect, useChainId } from 'wagmi'; // 使用 wagmi 來管理錢包
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
} from 'lucide-react';


// 定義 User 型別
type User = {
  id: number;
  createdAt: string;
  ethAddress: string;
  passportNumber: string;
  firstName: string;
  lastName: string;
  olderThan: string;
  nationality: string;
  name: string;
  passportNoOfac: boolean;
  attestationUidPolygon?: string | null;
  attestationUidHashkey?: string | null;
  status: 'pending' | 'approved' | 'rejected';
};

export default function InstitutionalReviewBack() {
  const { address, isConnected } = useAccount(); // 獲取當前錢包地址和連接狀態
  const { connect, connectors } = useConnect(); // 用於連接錢包
  const chainId = useChainId(); // 使用 useNetwork 取得 chain 資訊
  const router = useRouter();
  const institutionAddress = "0x941AE41b7e08001c02C910f72CA465B07435903C";

  useEffect(() => {
    if (!isConnected || address !== institutionAddress) {
      router.push('/'); // 若未連接錢包或地址不符合，重定向到首頁
    }
  }, [isConnected, address, router]);

  useEffect(() => {
    // if (chainId !== 80001 && chainId !== 133) {
    //   router.push('/'); // 若 chainId 不符合，重定向到首頁
    // }
  }, [chainId]);

  const [filterStatus, setFilterStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null); // 更新為 User | null
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [customers, setCustomers] = useState<User[]>([]); // 從 API 獲取的使用者資料
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [customerToApprove, setCustomerToApprove] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch(`/api/user/list-no-attestation?chainId=${chainId}`);
        const data = await response.json();
        setCustomers(data); // 設定從 API 獲取的使用者資料
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    }
    fetchCustomers();
  }, []);

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

  // Handle approve
  const handleApprove = (customerId) => {
    // This is just simulating a frontend state change; in reality, you'd call an API
    const updatedCustomers: User[] = customers.map((customer) => {
      if (customer.id === customerId) {
        return { ...customer, status: 'approved' };
      }
      return customer;
    });
    console.log(`Customer ${customerId} approved`);
    setCustomers(updatedCustomers); // 更新狀態
    setSelectedCustomer(null);
    setShowApproveModal(false); // 關閉彈窗
  };


  // Filter customer list
  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus =
      filterStatus === 'all' || customer.status === filterStatus
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.ethAddress.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F5F2EA', color: '#2C2A25' }}>
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

          {/* Updated Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <button className="flex items-center py-2 px-4 bg-[#D4C19C] text-[#2C2A25] hover:bg-[#C4B18B] transition-colors rounded-md">
                <Wallet className="h-4 w-4 mr-2" />
                <span>{address}</span>
              </button>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })} // 修正傳遞正確的參數
                className="flex items-center py-2 px-4 bg-[#D4C19C] text-[#2C2A25] hover:bg-[#C4B18B] transition-colors rounded-md"
              >
                <Wallet className="h-4 w-4 mr-2" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-6" style={{ backgroundColor: '#F5F2EA', color: '#2C2A25' }}>
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

                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-xs font-mono bg-gray-100 p-1 rounded">
                            {customer.ethAddress.slice(0, 6)}...
                            {customer.ethAddress.slice(-4)}
                          </span>
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(customer.ethAddress)
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
                        {customer.createdAt}
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
                                  e.stopPropagation();
                                  setCustomerToApprove(customer.id); // 設定要批准的客戶 ID
                                  setShowApproveModal(true); // 顯示彈窗
                                }}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center"
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Approve
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
                      <div className="w-1/3 text-gray-500">Wallet Address</div>
                      <div className="w-2/3 font-medium"></div>
                        <div className="flex items-center">
                          <span
                            className="font-mono bg-gray-100 p-1 rounded text-xs truncate max-w-[200px] md:max-w-[280px]"
                            title={selectedCustomer.ethAddress}
                          >
                          {selectedCustomer.ethAddress}
                          </span>
                          <button
                            className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                selectedCustomer.ethAddress,
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
                      <div className="w-1/3 text-gray-500">
                        Application Date
                      </div>
                      <div className="w-2/3 font-medium">
                        {selectedCustomer.createdAt}
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
                        <p className="text-xs text-gray-500 mb-1">
                          Nationality
                        </p>
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
                        Verified on {selectedCustomer.createdAt} through
                        Self Protocol
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setShowApproveModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[#2C2A25] mb-4">
                Confirm Approval
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to approve this customer?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => customerToApprove && handleApprove(customerToApprove)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
