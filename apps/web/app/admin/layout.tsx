"use client";

import { AdminLayout, ThemeToggle } from "ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "app/utils/auth";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if we're on the setup wizard or reset password page
  const isSetupPage =
    pathname?.startsWith("/admin/setup") || pathname === "/admin/reset-password";

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push("/");
      return;
    }
    if (currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router, pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If on setup / reset pages, render minimal full-width header and a single centered column
  if (isSetupPage) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        {/* Minimal Header (full width) */}
        <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-xl font-bold text-foreground">Aegis Vision</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Centered content column */}
        <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </div>
    );
  }

  return (
    <AdminLayout
      currentPath={pathname ?? undefined}
      userName={user.name}
      userEmail={user.email}
      whatsNewCount={3}
      onLogout={handleLogout}
    >
      {children}
    </AdminLayout>
  );
}

