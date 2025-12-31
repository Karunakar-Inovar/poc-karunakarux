// NOTE:
// NativeWind v4's runtime supports `cssInterop`, but the published TypeScript types
// don't always expose it as a named export depending on the entrypoint resolution.
// Importing via namespace + `any` keeps this package buildable while still using
// `cssInterop` when it exists at runtime.

import * as NativeWind from "nativewind";

export const cssInterop: any = (NativeWind as any).cssInterop;


