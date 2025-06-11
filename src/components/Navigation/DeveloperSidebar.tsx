import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Monitor, Brain, Activity, Code, AlertTriangle, Database, CheckSquare, TestTube, GitBranch, Settings } from 'lucide-react'
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
  { href: '/developer/dashboard', label: 'Dashboard', icon: Monitor },
  { href: '/developer/ai-brain-logs', label: 'AI Brain Hub', icon: Brain },
  { href: '/developer/system-monitor', label: 'System Monitor', icon: Activity },
  { href: '/developer/api-logs', label: 'API Logs', icon: Code },
  { href: '/developer/error-logs', label: 'Error Logs', icon: AlertTriangle },
  { href: '/developer/crm-integrations', label: 'CRM Integration Dashboard', icon: Database },
  { href: '/developer/qa-checklist', label: 'QA Checklist', icon: CheckSquare },
  { href: '/developer/testing-sandbox', label: 'Testing Tools', icon: TestTube },
  { href: '/developer/version-control', label: 'Version Control', icon: GitBranch },
  { href: '/developer/settings', label: 'Settings', icon: Settings }
]

interface DeveloperSidebarProps {
  children: React.ReactNode
  profileName?: string
}

export default function DeveloperSidebar({ children, profileName }: DeveloperSidebarProps) {
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
            <UserProfile name={profileName || 'Developer'} role="Developer" />
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
