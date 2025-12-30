import * as React from "react";
import { Text, type TextProps } from "react-native";
import { cssInterop } from "nativewind";
import { cn } from "../../utils/cn";

cssInterop(Text, {
  className: "style",
});

export interface LabelProps extends TextProps {
  className?: string;
}

const Label = React.forwardRef<React.ElementRef<typeof Text>, LabelProps>(
  ({ className, children, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-foreground peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
);
Label.displayName = "Label";

export { Label };


