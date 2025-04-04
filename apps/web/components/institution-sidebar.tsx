"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Shield, LayoutDashboard, Users, FileCheck, LogOut } from "lucide-react"

const navItems = [
  {
    name: "Overview",
    href: "/institution/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Issue Proofs",
    href: "/institution/dashboard/issue-proofs",
    icon: FileCheck,
  },
  {
    name: "Registered Users",
    href: "/institution/dashboard/users",
    icon: Users,
  },
]

export function InstitutionSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-border bg-card/50 h-screen flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">Institution Portal</span>
      </div>

      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

