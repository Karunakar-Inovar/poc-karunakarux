"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";
import { Icon } from "../atoms/icon";
import { Button } from "../atoms/button";
import { ThemeToggle } from "../molecules/theme-toggle";
import { Eye, Bell, LogOut, BarChart, FileText } from "../utils/icons";

interface StakeholderLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  userName?: string;
  onLogout?: () => void;
}

const StakeholderLayout = React.forwardRef<HTMLDivElement, StakeholderLayoutProps>(
  ({ children, currentPath, userName = "Stakeholder", onLogout }, ref) => {
    return (
      <div ref={ref} className="flex h-screen w-full flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          {/* Left: Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/stakeholder/reports" className="flex items-center gap-2">
              <Icon icon={Eye} className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Aegis Vision</span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/stakeholder/reports"
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPath === "/stakeholder/reports" &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon icon={FileText} className="h-4 w-4" />
                Reports
              </Link>
              <Link
                href="/stakeholder/analytics"
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  currentPath === "/stakeholder/analytics" &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon icon={BarChart} className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" title="Notifications">
              <Icon icon={Bell} className="h-5 w-5" />
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
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    );
  }
);
StakeholderLayout.displayName = "StakeholderLayout";

export { StakeholderLayout };














