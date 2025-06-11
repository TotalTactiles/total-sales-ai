import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Grid, Users, Bot, Phone, BarChart3, GraduationCap, Wrench } from 'lucide-react'
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
  { label: 'Dashboard', href: '/sales/dashboard', icon: Grid },
  { label: 'Lead Management', href: '/sales/lead-management', icon: Users },
  { label: 'AI Agent', href: '/sales/ai', icon: Bot },
  { label: 'Dialer', href: '/sales/dialer', icon: Phone },
  { label: 'Analytics', href: '/sales/analytics', icon: BarChart3 },
  { label: 'Academy', href: '/sales/academy', icon: GraduationCap },
  { label: 'Settings', href: '/sales/settings', icon: Wrench }
]

interface SalesSidebarProps {
  children: React.ReactNode
  profileName?: string
}

export default function SalesSidebar({ children, profileName }: SalesSidebarProps) {
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
                const active = location.pathname === item.href ||
                  (item.href.includes('dashboard') && location.pathname === '/sales') ||
                  (item.href.includes('lead-management') && location.pathname.includes('lead-management'))
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
            <UserProfile name={profileName || 'Sales Rep'} role="Sales Representative" />
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
