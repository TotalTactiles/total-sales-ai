import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { shouldShowNavItem } from './navigationUtils'
import type { NavItem } from './navigationConfig'

interface DesktopNavigationProps {
  navItems: NavItem[]
  activeItem: string
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  activeItem,
}) => {
  const location = useLocation()
  const { profile } = useAuth()

  const filteredNavItems = navItems.filter((item) =>
    shouldShowNavItem(item.href, profile),
  )

  return (
    <div className="hidden lg:block">
      <div className="bg-sidebar text-sidebar-foreground shadow-lg border-r border-sidebar-border w-64 h-screen px-4 py-6 space-y-1">
        {filteredNavItems.map((item, index) => {
          const isActive =
            location.pathname === item.href ||
            (item.href.includes('dashboard') && location.pathname === '/') ||
            activeItem === item.label.toLowerCase().replace(/\s+/g, '-')

          return (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default DesktopNavigation

