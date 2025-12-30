"use client";

/**
 * Standalone Web Sign In Screen
 * 
 * Uses shared UI components from packages/ui for consistent styling
 * across web and native platforms.
 */

import * as React from "react";
import { Pressable } from "react-native";
import { useRouter } from "next/navigation";
import {
  View,
  Text,
  TextInput,
  Button,
  Icon,
  Eye,
  ThemeToggle,
  Settings,
  Camera,
  BarChart,
  Field,
  Label,
  Alert,
} from "ui";
import {
  login,
  getRedirectPath,
  initializeDemoData,
  type UserRole,
} from "../utils/auth";

export function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<UserRole>("admin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [touched, setTouched] = React.useState({ email: false, password: false });

  // Validation
  const emailError =
    touched.email && !email
      ? "Email is required"
      : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Invalid email address"
        : "";

  const passwordError =
    touched.password && !password ? "Password is required" : "";

  // Initialize demo data on mount (client-side only)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      initializeDemoData();
    }
  }, []);

  const handleSignIn = async () => {
    setTouched({ email: true, password: true });
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!email || !password) {
        setErrorMessage("Please enter your email and password");
        setIsLoading(false);
        return;
      }

      if (emailError || passwordError) {
        setIsLoading(false);
        return;
      }

      const user = login(email, password, selectedRole);
    
      if (user) {
        const redirectPath = getRedirectPath(user.role);
        router.push(redirectPath);
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const roleOptions: { value: UserRole; label: string; icon: typeof Settings }[] = [
    { value: "admin", label: "Admin", icon: Settings },
    { value: "monitor", label: "Monitor", icon: Camera },
    { value: "stakeholder", label: "Viewer", icon: BarChart },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Sign In Form */}
      <div className="flex flex-col flex-1 w-full lg:w-1/2">
        <div className="flex flex-col flex-1 px-6 py-8">
          {/* Header with Logo and Theme Toggle */}
          <div className="flex flex-row items-center justify-between mb-8">
            <div className="flex flex-row items-center gap-2">
              <Icon icon={Eye} className="h-8 w-8 text-primary" />
              <Text className="text-2xl font-bold text-foreground">
                Aegis Vision
              </Text>
            </div>
            <ThemeToggle />
          </div>

          {/* Form Container - Centered */}
          <div className="flex flex-col flex-1 justify-center">
            <div className="w-full max-w-md mx-auto">
              {/* Welcome Text */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                  Welcome back!
                </h1>
                <p className="text-base text-muted-foreground">
                  Select your role and sign in to continue
                </p>
              </div>

              {/* Role Selector */}
              <div className="mb-6">
                <Label className="mb-3">Sign in as:</Label>
                <div className="flex flex-row gap-2">
                  {roleOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => setSelectedRole(option.value)}
                      className={`flex-1 items-center gap-2 rounded-xl border-2 p-4 ${
                        selectedRole === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }`}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selectedRole === option.value }}
                    >
                      <Icon
                        icon={option.icon}
                        className={`h-6 w-6 ${
                          selectedRole === option.value
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <Text
                        className={`text-sm font-medium ${
                          selectedRole === option.value
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage ? (
                <Alert variant="destructive" className="mb-4">
                  <Text className="text-sm">{errorMessage}</Text>
                </Alert>
              ) : null}

              {/* Form Fields - Using shared Field component */}
              <div className="flex flex-col gap-4 mb-6">
                <Field label="Email" errorMessage={emailError || undefined}>
                  <TextInput
                    placeholder="email@example.com"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                    className={emailError ? "border-destructive" : ""}
                    accessibilityLabel="Email address"
                  />
                </Field>

                <Field label="Password" errorMessage={passwordError || undefined}>
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    secureTextEntry
                    autoComplete="password"
                    editable={!isLoading}
                    className={passwordError ? "border-destructive" : ""}
                    accessibilityLabel="Password"
                  />
                </Field>

                <Button
                  onPress={handleSignIn}
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>

              {/* Footer Links */}
              <div className="flex flex-row items-center justify-between mb-6">
                <div className="flex flex-row items-center">
                  <Text className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                  </Text>
                  <Pressable onPress={handleSignUp}>
                    <Text className="text-sm text-primary font-medium">
                      Sign Up
                    </Text>
                  </Pressable>
                </div>
                <Pressable onPress={handleForgotPassword}>
                  <Text className="text-sm text-primary">
                    Forgot password?
                  </Text>
                </Pressable>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6">
                <Text className="text-xs text-muted-foreground text-center leading-5">
                  By clicking "Sign In" you agree to the{" "}
                  <Text className="underline">Terms of Service</Text>
                  {" "}and acknowledge the{" "}
                  <Text className="underline">Privacy Notice</Text>.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration (Web only, hidden on mobile) */}
      <div className="hidden lg:flex flex-1 w-1/2 items-center justify-center bg-muted/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full h-full">
          {/* Illustration */}
          <div className="mb-8 relative">
            <div className="h-64 w-64 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon={Eye} className="h-32 w-32 text-primary" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-primary/40" />
            <div className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-primary/30" />
            <div className="absolute top-1/2 -right-8 h-6 w-6 rounded-full bg-primary/50" />
            <div className="absolute top-1/4 -left-8 h-10 w-10 rounded-full bg-primary/20" />
          </div>

          {/* Tagline */}
          <Text className="text-3xl font-bold mb-4 text-center text-foreground">
            AI-Powered Video Surveillance
          </Text>
          <Text className="text-muted-foreground max-w-md text-lg text-center">
            Monitor, detect, and respond to incidents in real-time with
            intelligent video analytics.
          </Text>
        </div>
      </div>
    </div>
  );
}
