import React from "react";
import {
  TextInput as ReactNativeTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "../utils/cn";

export interface TextInputProps extends RNTextInputProps {
  className?: string;
  variant?: "default" | "outline";
  disabled?: boolean;
  /**
   * Web-friendly input type.
   * Mapped to React Native props (`secureTextEntry`, `keyboardType`) so it stays cross-platform.
   */
  type?: "text" | "email" | "password" | "tel";
}

cssInterop(ReactNativeTextInput, {
  className: "style",
});

const baseInputClasses =
  "h-10 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50";

const outlineClasses = "border-2 border-input bg-background focus-visible:border-primary";

export const TextInput = React.forwardRef<
  React.ElementRef<typeof ReactNativeTextInput>,
  TextInputProps
>(
  (
    {
      className,
      variant = "default",
      type,
      disabled,
      secureTextEntry,
      keyboardType,
      editable,
      ...props
    },
    ref
  ) => {
    const resolvedSecureTextEntry = secureTextEntry ?? type === "password";
    const resolvedKeyboardType =
      keyboardType ??
      (type === "email"
        ? "email-address"
        : type === "tel"
          ? "phone-pad"
          : undefined);
    const resolvedEditable = editable ?? !disabled;

    return (
      <ReactNativeTextInput
        ref={ref}
        className={cn(baseInputClasses, variant === "outline" && outlineClasses, className)}
        secureTextEntry={resolvedSecureTextEntry}
        keyboardType={resolvedKeyboardType}
        editable={resolvedEditable}
        {...props}
      />
    );
  }
);

TextInput.displayName = "TextInput";

