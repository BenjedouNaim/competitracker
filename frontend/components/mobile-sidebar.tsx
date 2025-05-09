"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavigationByRole } from "@/lib/navigation";
import { createClient } from "@/lib/client";

export default function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Get the user's role from Supabase
  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient();

      try {
        // First get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Then get their role from the users table
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Get navigation items based on user role
  const navigationItems = getNavigationByRole(userRole);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b">
            <Menu className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">Competitracker</span>
          </div>
          <nav className="flex-1 overflow-auto p-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === "/dashboard" + item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={"/dashboard" + item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
