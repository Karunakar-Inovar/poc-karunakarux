import "react-native";

// NativeWind adds `className` support at runtime via babel/JSX transform and cssInterop,
// but React Native types don't include it. Augment the prop types so TS accepts `className`.
declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
}


