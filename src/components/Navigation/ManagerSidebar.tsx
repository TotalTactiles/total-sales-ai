import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, Brain, Database, Shield, FileText, Settings } from 'lucide-react'
import Logo from '@/components/Logo'
import UserProfile from '@/components/UserProfile'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset
} from '@/components/ui/sidebar'

const navItems = [
  { label: 'Dashboard', href: '/manager/dashboard', icon: BarChart3 },
  { label: 'Analytics', href: '/manager/analytics', icon: BarChart3 },
  { label: 'Lead Management', href: '/manager/lead-management', icon: Users },
  { label: 'Company Brain', href: '/manager/company-brain', icon: Database },
  { label: 'AI Assistant', href: '/manager/ai', icon: Brain },
  { label: 'CRM Integrations', href: '/manager/crm-integrations', icon: Database },
  { label: 'Team Management', href: '/manager/team-management', icon: Users },
  { label: 'Security', href: '/manager/security', icon: Shield },
  { label: 'Reports', href: '/manager/reports', icon: FileText },
  { label: 'Settings', href: '/manager/settings', icon: Settings }
]

interface ManagerSidebarProps {
  children: React.ReactNode
  profileName?: string
}

export default function ManagerSidebar({ children, profileName }: ManagerSidebarProps) {
  const location = useLocation()
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="flex items-center gap-2 p-2">
            <Logo />
            <SidebarTrigger className="ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map(item => {
                const Icon = item.icon
                const active = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.href} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="mt-auto flex flex-col gap-2">
            <ThemeToggle />
            <UserProfile name={profileName || 'Manager'} role="Sales Manager" />
          </SidebarFooter>
        </Sidebar>
        <SidebarRail />
        <SidebarInset className="flex flex-col flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
