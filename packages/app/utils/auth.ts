/**
 * Authentication utility functions for Aegis Vision
 * Simulates authentication using LocalStorage for prototype
 */

import { getItem, setItem, removeItem, STORAGE_KEYS } from "./storage";

export type UserRole = "admin" | "monitor" | "stakeholder";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  isFirstLogin: boolean;
  loginTime: string;
}

/**
 * Simulate login (for prototype)
 */
export function login(email: string, password: string, role: UserRole): AuthUser | null {
  // In prototype, any email/password combination works
  // Just validate they're not empty
  if (!email || !password) {
    return null;
  }

  const user: AuthUser = {
    userId: generateUserId(),
    email,
    name: getRoleDisplayName(role),
    role,
    isFirstLogin: !hasCompletedSetup(),
    loginTime: new Date().toISOString(),
  };

  setItem(STORAGE_KEYS.AUTH, user);
  return user;
}

/**
 * Logout current user
 */
export function logout(): void {
  removeItem(STORAGE_KEYS.AUTH);
  // Optionally clear shift data for monitor users
  const user = getCurrentUser();
  if (user?.role === "monitor") {
    removeItem(STORAGE_KEYS.SHIFT);
  }
}

/**
 * Get currently logged in user
 */
export function getCurrentUser(): AuthUser | null {
  return getItem<AuthUser>(STORAGE_KEYS.AUTH);
}

/**
 * Get user role
 */
export function getRole(): UserRole | null {
  const user = getCurrentUser();
  return user?.role || null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * Check if this is first time setup (for admin users)
 */
export function isFirstTimeSetup(): boolean {
  const user = getCurrentUser();
  if (user?.role !== "admin") return false;

  const org = getItem(STORAGE_KEYS.ORGANIZATION);
  return !org || !org.setupCompleted;
}

/**
 * Mark setup as completed
 */
export function completeSetup(): void {
  const org = getItem(STORAGE_KEYS.ORGANIZATION) || {};
  setItem(STORAGE_KEYS.ORGANIZATION, {
    ...org,
    setupCompleted: true,
  });

  // Update user's first login flag
  const user = getCurrentUser();
  if (user) {
    setItem(STORAGE_KEYS.AUTH, {
      ...user,
      isFirstLogin: false,
    });
  }
}

/**
 * Check if user needs to reset password
 */
export function needsPasswordReset(): boolean {
  const passwordReset = getItem<string>("passwordReset");
  return passwordReset !== "true";
}

/**
 * Get redirect path based on role
 */
export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "admin":
      // First time admin: password reset → setup → dashboard
      if (needsPasswordReset()) {
        return "/admin/reset-password";
      }
      return isFirstTimeSetup() ? "/admin/setup" : "/admin/dashboard";
    case "monitor":
      // First time monitor: password reset → dashboard
      if (needsPasswordReset()) {
        return "/monitor/reset-password";
      }
      return "/monitor/summary"; // Shift handover page
    case "stakeholder":
      return "/stakeholder/reports";
    default:
      return "/";
  }
}

/**
 * Helper: Check if setup has been completed
 */
function hasCompletedSetup(): boolean {
  const org = getItem(STORAGE_KEYS.ORGANIZATION);
  return org?.setupCompleted === true;
}

/**
 * Helper: Generate a simple user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper: Get display name for role
 */
function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin User";
    case "monitor":
      return "Monitor User";
    case "stakeholder":
      return "Stakeholder";
    default:
      return "User";
  }
}

/**
 * Initialize demo data (for prototype testing)
 */
export function initializeDemoData(): void {
  // Only initialize if no data exists
  if (getItem(STORAGE_KEYS.ORGANIZATION)) return;

  // Set up basic organization
  setItem(STORAGE_KEYS.ORGANIZATION, {
    name: "Demo Organization",
    domain: "demo.aegis.com",
    setupCompleted: false,
  });

  // Initialize empty arrays
  setItem(STORAGE_KEYS.CAMERAS, []);
  setItem(STORAGE_KEYS.PIPELINES, []);
  setItem(STORAGE_KEYS.MODELS, [
    {
      id: "model_ppe",
      name: "PPE Detection",
      type: "default",
      tech: "YOLO",
      description: "Detects personal protective equipment (helmets, vests, gloves)",
    },
    {
      id: "model_intrusion",
      name: "Intrusion Detection",
      type: "default",
      tech: "YOLO",
      description: "Detects unauthorized personnel in restricted areas",
    },
    {
      id: "model_fire",
      name: "Fire Detection",
      type: "default",
      tech: "TensorFlow",
      description: "Detects fire and smoke in monitored areas",
    },
    {
      id: "model_defect",
      name: "Defect Detection",
      type: "default",
      tech: "PyTorch",
      description: "Identifies product defects in manufacturing lines",
    },
  ]);
  setItem(STORAGE_KEYS.INCIDENTS, []);
  setItem(STORAGE_KEYS.USERS, []);
  setItem(STORAGE_KEYS.NOTIFICATIONS, {
    global: {
      email: { enabled: false, recipients: [] },
      sms: { enabled: false, recipients: [] },
      whatsapp: { enabled: false, recipients: [] },
      webhook: { enabled: false, url: "" },
      plc: { enabled: false, config: {} },
    },
    pipelines: {},
  });
}

