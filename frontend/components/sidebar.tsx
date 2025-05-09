"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PieChart } from 'lucide-react'
import { getNavigationByRole } from "@/lib/navigation"
import { createClient } from "@/lib/client"

export default function Sidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get the user's role from Supabase
  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient()
      
      try {
        // First get the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Then get their role from the users table
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()
            
          if (data && !error) {
            setUserRole(data.role)
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserRole()
  }, [])
  
  // Get navigation items based on user role
  const navigationItems = getNavigationByRole(userRole)

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">Competitracker</span>
          </div>
        </div>
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === '/dashboard' + item.href
            return (
              <Link
                key={item.name}
                href={'/dashboard' + item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
