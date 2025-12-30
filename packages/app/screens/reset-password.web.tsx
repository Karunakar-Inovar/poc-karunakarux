"use client";

/**
 * Web Reset Password Screen Wrapper
 *
 * Uses the standalone web ResetPassword component with Next.js navigation.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { ResetPassword as WebResetPassword } from "./reset-password-web-standalone";

export function ResetPassword() {
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
        localStorage.removeItem("setupOverviewAcknowledged");
      }

      // Redirect to setup overview before wizard
      router.push("/admin/setup/overview");
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

export default ResetPassword;


