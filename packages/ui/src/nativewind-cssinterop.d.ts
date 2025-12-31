declare module "nativewind" {
  // NativeWind runtime provides `cssInterop`, but some type entrypoints don't declare it.
  // Provide a permissive type so `import { cssInterop } from "nativewind"` compiles.
  export const cssInterop: any;
}


