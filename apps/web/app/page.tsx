"use client";

import React, { useState, useEffect } from "react";

// Import with timeout to detect hanging
function useSignInComponent() {
  const [SignIn, setSignIn] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (!SignIn && !error && !cancelled) {
        console.error("Import timeout - SignIn component import is taking too long");
        setError("Import timeout: The SignIn component is taking too long to load. This may indicate a circular dependency or module resolution issue.");
        setLoading(false);
      }
    }, 5000);

    // Import from app package (which now exports the standalone version)
    import("app")
      .then((module) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        if (module.SignIn) {
          console.log("SignIn loaded successfully from direct path");
          setSignIn(() => module.SignIn);
          setLoading(false);
        } else {
          setError("SignIn not found in module. Available: " + Object.keys(module).join(", "));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        clearTimeout(timeoutId);
        console.error("Failed to import SignIn from direct path:", err);
        // Fallback: try the barrel export
        import("app")
          .then((module) => {
            if (cancelled) return;
            if (module.SignIn) {
              console.log("SignIn loaded successfully from barrel export");
              setSignIn(() => module.SignIn);
              setLoading(false);
            } else {
              setError("SignIn not found in app module");
              setLoading(false);
            }
          })
          .catch((err2) => {
            if (cancelled) return;
            setError(err2.message || "Failed to load SignIn component from both paths");
            setLoading(false);
          });
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return { SignIn, loading, error };
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <h2 style={{ color: "#c00", marginBottom: "20px" }}>Error rendering SignIn component</h2>
          <pre style={{ 
            whiteSpace: "pre-wrap", 
            backgroundColor: "#fee", 
            padding: "20px", 
            borderRadius: "8px",
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          {this.state.error?.stack && (
            <details style={{ marginTop: "20px", textAlign: "left", maxWidth: "600px", margin: "20px auto" }}>
              <summary style={{ cursor: "pointer", color: "#666", marginBottom: "10px" }}>Stack trace</summary>
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: "12px", 
                backgroundColor: "#fee", 
                padding: "20px", 
                borderRadius: "8px",
                overflow: "auto"
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default function HomePage() {
  const { SignIn, loading, error } = useSignInComponent();

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>Loading SignIn component...</div>
          <div style={{ fontSize: "14px", color: "#666" }}>This should only take a moment</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "#c00", marginBottom: "20px" }}>Error Loading Component</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>{error}</p>
        <p style={{ fontSize: "14px", color: "#888" }}>
          Check the browser console (F12) for more details.
        </p>
      </div>
    );
  }

  if (!SignIn) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <p>SignIn component not available</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SignIn />
    </ErrorBoundary>
  );
}
