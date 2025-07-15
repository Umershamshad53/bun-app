import { SidebarTrigger } from "@/features/common/components/ui/sidebar"
import { Button } from "@/features/common/components/ui/button"
import { Input } from "@/features/common/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/components/ui/dropdown-menu"
import { Badge } from "@/features/common/components/ui/badge"
import { Bell, Search, Plus } from "lucide-react"
 
export function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
      <SidebarTrigger className="-ml-1" />
 
      <div className="flex flex-1 items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search students, receipts..." className="pl-10 bg-gray-50 border-gray-200" />
        </div>
 
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Actions */}
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
         
          <span className="flex items-center gap-1 px-2">     <Plus className="h-4 w-4" />New Payment</span> 
                      
          </Button>
 
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Payment Overdue</p>
                  <p className="text-xs text-gray-500">Student ID: 12345 - Tuition Fee</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">New Payment Received</p>
                  <p className="text-xs text-gray-500">Student ID: 67890 - Library Fee</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">System Update</p>
                  <p className="text-xs text-gray-500">POS system updated to v2.1</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}