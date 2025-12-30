"use client";

/**
 * Monitor Reset Password Screen Wrapper
 *
 * Uses the standalone web ResetPassword component with Next.js navigation.
 * Redirects to monitor dashboard after password reset.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { ResetPassword as WebResetPassword } from "app/screens/reset-password-web-standalone";

export default function MonitorResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (data: { newPassword: string }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // For prototype: Store password reset flag
      if (typeof window !== "undefined") {
        localStorage.setItem("passwordReset", "true");
      }

      // Redirect to monitor dashboard after password reset
      router.push("/monitor/dashboard");
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRequest2FA = () => {
    // Handle 2FA request - could open a modal or navigate
    alert("2FA early access request submitted!");
  };

  return (
    <WebResetPassword
      onSubmit={handleSubmit}
      onRequest2FA={handleRequest2FA}
      isLoading={isLoading}
      errorMessage={errorMessage}
    />
  );
}

