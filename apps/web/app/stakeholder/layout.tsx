"use client";

import { StakeholderLayout } from "ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "app/utils/auth";

export default function StakeholderLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push("/");
      return;
    }
    if (currentUser.role !== "stakeholder") {
      router.push("/");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

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

  return (
    <StakeholderLayout
      currentPath={pathname}
      userName={user.name}
      onLogout={handleLogout}
    >
      {children}
    </StakeholderLayout>
  );
}

