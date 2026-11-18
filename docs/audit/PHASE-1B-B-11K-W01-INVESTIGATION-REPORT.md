# B-11K-W01 Investigation Report

## 1. Document control and authorization

- Authorization scope: Project Owner authorized the read-only investigation for W-01 only.
- Scope boundary: This report documents static evidence only and does not authorize remediation, dependency changes, build execution, or runtime verification.
- Source of truth: Repository state and file evidence were inspected as checked into the workspace; no configuration or dependency state was modified.

## 2. Investigation scope and exclusions

### In scope
- Repository-owned evidence:
  - [vite.config.ts](../../vite.config.ts)
  - [package.json](../../package.json)
  - [tsconfig.json](../../tsconfig.json)
- Installed dependency evidence (read only; not repository-tracked source files):
  - [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json)
  - [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js)
  - [node_modules/vite-tsconfig-paths/package.json](../../node_modules/vite-tsconfig-paths/package.json)

This investigation inspected the installed package files read-only; no dependency installation or restoration occurred during the investigation.

### Excluded
- Editing source or configuration files
- Installing or restoring dependencies
- Running npm scripts, Vite, Nitro, or application config
- Running a build, test, or runtime operation
- Accessing secrets, production systems, or deployment configuration
- Staging, committing, or pushing

## 3. Repository-owned Vite configuration findings

### Evidence observed
- [vite.config.ts](../../vite.config.ts#L1-L16) declares a comment that “@lovable.dev/vite-tanstack-config already includes … tsConfigPaths … nitro … @ path alias …” and warns not to add duplicate plugins.
- [vite.config.ts](../../vite.config.ts#L8-L16) imports `defineConfig` from `@lovable.dev/vite-tanstack-config` and exports a config object with a `tanstackStart.server.entry` override.
- [package.json](../../package.json#L3-L82) declares `vite-tsconfig-paths` in dependencies and `@lovable.dev/vite-tanstack-config` in devDependencies.
- [tsconfig.json](../../tsconfig.json#L1-L31) declares `compilerOptions.paths` mapping `@/*` to `./src/*`.

### Conclusion
- The repository itself does not directly add a Vite plugin list. Instead, it delegates to the Lovable wrapper and explicitly warns against duplicate plugin registration.
- The repository-owned config provides evidence that the wrapper is responsible for injecting at least some Vite plugin responsibilities, including `tsConfigPaths` and the `@` alias.
- The repository config is not equivalent to a full effective Vite config snapshot; it is only the explicit config object the repository exports to the wrapper.

### Limitation
- The checked-in config does not prove the final runtime plugin list, ordered execution, or whether the wrapper internally uses the plugin or an equivalent native Vite path-resolution mechanism.

## 4. Wrapper package identity and version

### Evidence observed
- [package.json](../../package.json#L69-L76) declares `@lovable.dev/vite-tanstack-config` version `2.27.1` in devDependencies.
- [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json#L1-L76) declares the package name `@lovable.dev/vite-tanstack-config`, version `2.27.1`, and identifies its export entry points.

### Conclusion
- The wrapper package identity and version are confirmed in the project metadata and in the installed package metadata.
- The package is a Vite config wrapper for Lovable TanStack Start projects, and its peer dependency list includes `vite-tsconfig-paths` and `nitro`.

## 5. Static wrapper implementation findings

### Evidence observed
- In [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js#L1561-L1595), the wrapper does the following statically:
  - `const tailwindcss = (await import("@tailwindcss/vite")).default;`
  - `internalPlugins.push(tailwindcss());`
  - `const tsConfigPaths = (await import("vite-tsconfig-paths")).default;`
  - `internalPlugins.push(tsConfigPaths({ projects: ["./tsconfig.json"] }));`
- The package’s own metadata in [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json#L27-L46) lists `vite-tsconfig-paths` as a peer dependency.
- [node_modules/vite-tsconfig-paths/package.json](../../node_modules/vite-tsconfig-paths/package.json#L1-L47) confirms the package name, version `6.1.1`, and purpose: “Vite resolver for TypeScript compilerOptions.paths.”
- The repository-owned evidence and installed dependency evidence are distinct categories: the project files are checked-in source/config documents, while the `node_modules` files are installed package metadata and implementation inspected read-only in the working environment.

### Conclusion
- The wrapper statically imports and constructs the `vite-tsconfig-paths` plugin with `projects: ["./tsconfig.json"]`.
- The wrapper therefore owns the visible plugin-based path resolution path in the inspected static implementation.
- The wrapper is not merely a pass-through; it actively appends the plugin to its internal plugin list.

### Limitation
- This still does not prove the exact effective config after all wrapper logic, user config merges, or runtime execution semantics are resolved by Vite itself. It only confirms the static implementation present in the installed package.

## 6. TypeScript path integration analysis

### Evidence observed
- [tsconfig.json](../../tsconfig.json#L17-L30) contains the compiler path mapping for `@/*`.
- The wrapper adds `tsConfigPaths({ projects: ["./tsconfig.json"] })` in [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js#L1569-L1576).
- The project declares `vite-tsconfig-paths` directly in [package.json](../../package.json#L54-L76), while the wrapper also declares it as a peer dependency in [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json#L19-L46).

### Conclusion
- There is direct static evidence that the project’s TypeScript path alias is represented in `tsconfig.json` and that the wrapper constructs a plugin that resolves those paths during Vite processing.
- The wrapper and the project are not independent of each other here: the project declares the package, and the wrapper’s installed implementation also depends on it.

### Limitation
- The evidence does not establish whether the wrapper intentionally chooses the plugin path over a native Vite `resolve.tsconfigPaths` option, because the installed static implementation shows the plugin-based code path but not a separately documented alternative in repository-owned files.

## 7. Explanation of the existing `vite-tsconfig-paths` warning

### Evidence observed
- [vite.config.ts](../../vite.config.ts#L1-L16) explicitly says the wrapper already includes `tsConfigPaths` and warns not to add it manually.
- The wrapper implementation in [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js#L1569-L1576) adds the plugin directly.
- The warning text quoted in the owner decision record says: “The plugin `vite-tsconfig-paths` is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option.”

### Conclusion
- The warning is consistent with the static evidence: the project’s [package.json](../../package.json#L54-L76) declares `vite-tsconfig-paths`, while the installed wrapper implementation in [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js#L1569-L1576) imports the package and constructs the plugin using `tsConfigPaths({ projects: ["./tsconfig.json"] })`.
- The static evidence of plugin construction comes from the wrapper implementation, not merely from the dependency declaration.
- The Vite warning is therefore consistent with a detected plugin and with Vite’s native `resolve.tsconfigPaths` capability.
- The warning does not, by itself, prove that two plugin instances are registered, and it does not prove that the wrapper’s plugin-based implementation is incorrect, unnecessary, or safe to remove.
- Runtime composition and operational materiality remain unverified and undetermined.

### Limitation
- Static evidence confirms the wrapper’s plugin construction, not whether the wrapper has an equivalent native `resolve.tsconfigPaths` switch or whether the plugin is required for compatibility, SSR, or other wrapper semantics. Therefore, the warning cannot be treated as definitively resolved or harmless based solely on static inspection.

## 8. Configuration responsibilities confirmed

### Confirmed
- The repository’s explicit Vite config is a thin wrapper call in [vite.config.ts](../../vite.config.ts#L8-L16).
- The wrapper is the package `@lovable.dev/vite-tanstack-config` at version `2.27.1`.
- The wrapper’s installed implementation statically includes `vite-tsconfig-paths` as a plugin with `projects: ["./tsconfig.json"]`.
- The project declares the `@/*` path alias in [tsconfig.json](../../tsconfig.json#L17-L30).
- The project and wrapper both reference the same TypeScript path-resolution dependency, as evidenced by [package.json](../../package.json#L54-L76) and [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json#L19-L46).

## 9. Configuration responsibilities remaining UNVERIFIED

### UNVERIFIED
- Whether the wrapper has an alternative native `resolve.tsconfigPaths` route that is equivalent under this project’s runtime environment.
- Whether there are additional Vite or Nitro config differences produced after wrapper composition that are not visible from static inspection alone.
- Whether the exact effective plugin ordering and merge semantics are identical to a native Vite configuration path under the evaluated runtime.
- Whether the warning is material in this particular project beyond the static evidence already inspected.

## 10. Technical limitations and alternative explanations

- The repository config is intentionally thin and explicitly defers to the wrapper. The static evidence shows what the wrapper does as implemented in the installed package, but it does not prove the result of Vite runtime composition.
- A reasonable alternative explanation is that the wrapper intentionally chooses plugin-based TypeScript path resolution for compatibility, while still presenting a repository-owned configuration that is intentionally minimal and non-explicit.
- The presence of a direct project dependency on `vite-tsconfig-paths` does not automatically mean the warning is harmless; the combination of direct project dependency and wrapper-owned plugin injection is exactly the pattern the warning is designed to detect.
- The dependency declaration and the plugin construction are distinct evidentiary facts: one is the project’s package declaration, and the other is the wrapper’s actual plugin registration call in the installed implementation.

## 11. Warning materiality assessment

### Assessment
- Warning materiality remains `UNDETERMINED`.
- Static evidence supports that the wrapper adds the plugin and that the project declares the package.
- Static evidence does not establish whether the warning has operational significance in this project’s specific runtime config composition.

## 12. Findings and evidence references

- [vite.config.ts](../../vite.config.ts#L1-L16): wrapper configuration comment and import; repository-owned config delegates to wrapper.
- [package.json](../../package.json#L54-L76): project dependency declarations for `vite-tsconfig-paths` and `@lovable.dev/vite-tanstack-config`.
- [tsconfig.json](../../tsconfig.json#L17-L30): TypeScript `paths` config for `@/*`.
- [node_modules/@lovable.dev/vite-tanstack-config/package.json](../../node_modules/@lovable.dev/vite-tanstack-config/package.json#L1-L76): wrapper package metadata and peer dependency declaration.
- [node_modules/@lovable.dev/vite-tanstack-config/dist/index.js](../../node_modules/@lovable.dev/vite-tanstack-config/dist/index.js#L1569-L1576): direct evidence that the wrapper adds `vite-tsconfig-paths({ projects: ["./tsconfig.json"] })`.
- [node_modules/vite-tsconfig-paths/package.json](../../node_modules/vite-tsconfig-paths/package.json#L1-L47): package identity and purpose.

## 13. Explicit statement of activities not performed

This investigation did not perform any of the following:
- build
- runtime verification
- dependency installation or restoration
- configuration editing
- package or lockfile modification
- deployment or production validation
- staging, commit, or push

## 14. Recommended next steps requiring separate authorization

1. Confirm whether the wrapper’s plugin-based TypeScript path resolution is intentionally preferred over native Vite `resolve.tsconfigPaths` in this project context.
2. If the owner wants a definitive resolution, authorize a focused runtime or build-pipeline inspection in a controlled environment that can evaluate the actual Vite config composition without altering repository state.
3. If a configuration change is later considered, treat it as a separate approved action requiring explicit project-owner authorization and a review of compatibility impacts.

## 15. Executive conclusion

The static evidence confirms that the repository delegates TypeScript path resolution to the Lovable wrapper and that the wrapper’s installed implementation explicitly adds `vite-tsconfig-paths` with `projects: ["./tsconfig.json"]`. The warning is therefore consistent with the static configuration. However, the precise effective runtime composition and the materiality of the warning remain outside what can be proven from repository-checked-in files alone, so the correct status remains `UNDETERMINED` unless a separate owner decision is made after additional authorized evidence is obtained.
