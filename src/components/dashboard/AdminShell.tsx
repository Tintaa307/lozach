import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface AdminShellProps {
  user: {
    name: string
    email: string
    avatar: string
  }
  children: ReactNode
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <AppSidebar variant="inset" user={user} />
        <SidebarInset className="flex-1 w-full">
          <SiteHeader />
          <div className="flex flex-1 flex-col w-full">
            <div className="@container/main flex flex-1 flex-col gap-2 w-full">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
