"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { ThemeToggle } from "../molecules/theme-toggle";
import { SidebarNav, type NavItem } from "../molecules/sidebar-nav";
import { PromoCard } from "../molecules/promo-card";
import { BottomNav } from "../molecules/bottom-nav";
import { MoreMenuSheet } from "../molecules/more-menu-sheet";
import {
  Eye,
  Home,
  Camera,
  GitBranch,
  Bell,
  Users,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Gift,
  User,
  LogOut,
  Sparkles,
} from "../utils/icons";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  userName?: string;
  userEmail?: string;
  whatsNewCount?: number;
  onLogout?: () => void;
}

const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Cameras",
    href: "/admin/cameras",
    icon: Camera,
  },
  {
    title: "AI Models",
    href: "/admin/models",
    icon: Sparkles,
  },
  {
    title: "Pipelines",
    href: "/admin/pipelines",
    icon: GitBranch,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Incidents",
    href: "/admin/incidents",
    icon: AlertTriangle,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const AdminLayout = React.forwardRef<HTMLDivElement, AdminLayoutProps>(
  (
    {
      children,
      currentPath,
      userName = "Admin User",
      userEmail = "admin@aegis.com",
      whatsNewCount = 3,
      onLogout,
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);

    return (
      <div ref={ref} className="flex h-screen w-full overflow-hidden bg-background">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
            "fixed lg:static inset-y-0 left-0 z-50",
            collapsed ? "w-16" : "w-64",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo & Brand with Collapse Toggle */}
          <div className={cn(
            "flex h-16 items-center",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}>
            {collapsed ? (
              /* Collapsed: Show logo with expand arrow indicator */
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center gap-1 p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
                title="Expand sidebar"
              >
                <Icon icon={Eye} className="h-7 w-7 text-sidebar-primary" />
                <Icon icon={ChevronRight} className="h-4 w-4 text-sidebar-foreground/50" />
              </button>
            ) : (
              /* Expanded: Show logo, brand name, and toggle */
              <>
                <div className="flex items-center gap-2">
                  <Icon icon={Eye} className="h-8 w-8 text-sidebar-primary" />
                  <span className="text-xl font-bold">Aegis Vision</span>
                </div>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
                  title="Collapse sidebar"
                >
                  <Icon
                    icon={ChevronLeft}
                    className="h-4 w-4 text-sidebar-foreground/70"
                  />
                </button>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {!collapsed ? (
              <div onClickCapture={() => setMobileMenuOpen(false)}>
              <SidebarNav items={defaultNavItems} currentPath={currentPath} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {defaultNavItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-center rounded-md p-2 transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      currentPath === item.href &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    title={item.title}
                  >
                    <Icon icon={item.icon} className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Promo Card */}
          {!collapsed && (
            <div className="border-t border-sidebar-border px-3 pt-3 pb-6">
              <PromoCard
                title="Advanced AI Features"
                description="Bring your own models or create custom AI models without code"
                buttonText="Request Early Access"
                glowText="Unlock AI Power"
                onButtonPress={() => {}}
                dismissible={false}
              />
            </div>
          )}

        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Header */}
          <header className="flex h-16 items-center justify-between bg-background px-4 sm:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
                title="Toggle menu"
              >
                <Icon icon={mobileMenuOpen ? ChevronLeft : ChevronRight} className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* What's New - Hidden */}
              {/* <div className="relative">
                <Button variant="ghost" size="icon" title="What's New">
                <Icon icon={Gift} className="h-5 w-5" />
                </Button>
                {whatsNewCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-600 px-1 text-xs font-semibold"
                    style={{ color: 'white' }}
                  >
                    {whatsNewCount}
                  </span>
                )}
              </div> */}
              {/* Help - Hidden */}
              {/* <Button variant="ghost" size="icon" title="Help">
                <Icon icon={HelpCircle} className="h-5 w-5" />
              </Button> */}
              <Button variant="ghost" size="icon" title="Notifications">
                <Icon icon={Bell} className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  title="User menu"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative"
                >
                  <Icon icon={User} className="h-5 w-5" />
                </Button>
                
                {userMenuOpen && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout?.();
                        }}
                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Icon icon={LogOut} className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 pb-20 lg:pb-6">
            {children}
          </main>
        </div>

        {/* Bottom Navigation (Mobile Only) */}
        <BottomNav onMoreClick={() => setMoreMenuOpen(true)} />

        {/* More Menu Bottom Sheet */}
        <MoreMenuSheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen} />
      </div>
    );
  }
);
AdminLayout.displayName = "AdminLayout";

export { AdminLayout };









