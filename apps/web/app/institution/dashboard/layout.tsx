import type React from "react"
import { InstitutionSidebar } from "@/components/institution-sidebar"

export default function InstitutionDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <InstitutionSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}

