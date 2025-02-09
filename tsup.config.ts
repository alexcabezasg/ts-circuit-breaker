import { defineConfig } from "tsup";

export default defineConfig({
    format: ["cjs", "esm"],
    entry: ["./src/CircuitBreaker.ts"],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true
})