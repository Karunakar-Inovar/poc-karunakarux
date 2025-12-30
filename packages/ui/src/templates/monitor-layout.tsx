"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { ThemeToggle } from "../molecules/theme-toggle";
import {
  Eye,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  AlertTriangle,
} from "../utils/icons";

interface MonitorLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  userName?: string;
  alertCount?: number;
  onLogout?: () => void;
}

const MonitorLayout = React.forwardRef<HTMLDivElement, MonitorLayoutProps>(
  ({ children, currentPath, userName = "Monitor User", alertCount = 0, onLogout }, ref) => {
    return (
      <div ref={ref} className="flex h-screen w-full flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/monitor/dashboard" className="flex items-center gap-2">
              <Icon icon={Eye} className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Aegis Vision</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/monitor/dashboard"
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPath === "/monitor/dashboard" &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon icon={LayoutDashboard} className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/monitor/summary"
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPath === "/monitor/summary" &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon icon={FileText} className="h-4 w-4" />
                Summary
              </Link>
              <Link
                href="/monitor/incidents"
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPath?.startsWith("/monitor/incidents") &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon icon={AlertTriangle} className="h-4 w-4" />
                Incidents
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" title="Notifications">
              <Icon icon={Bell} className="h-5 w-5" />
              {alertCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground">
                  {alertCount > 9 ? "9+" : alertCount}
                </span>
              )}
            </Button>

            <div className="mx-2 h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{userName}</span>
            </div>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              title="Logout"
              onClick={onLogout}
            >
              <Icon icon={LogOut} className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    );
  }
);
MonitorLayout.displayName = "MonitorLayout";

export { MonitorLayout };














