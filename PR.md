# PR: Update dependencies

**Title:** Update all dependencies to latest compatible versions

**Suggested branch name:** `update-dependencies-2026-07`

---

## Summary

Major dependency upgrade covering all open dependabot PRs (#133, #134, #135, #138, #140, #141, #142, #143, #148, #149, #153, #154, #156, #157, #158, #159, #160, #161) and additional modernization work.

## Changes

### Backstage Framework
- Upgraded `@backstage/cli` from `0.26.6` to `0.36.3`
- Added `@backstage/cli-defaults` (required by new CLI)
- Updated `backstage.json` to `1.52.1`
- Removed `@backstage/backend-common` dependency (replaced with `@backstage/backend-plugin-api`)
- Fixed `@backstage/plugin-proxy-backend` import (graduated from `/alpha` to main export)
- Added minimal `catalog` and `auth` config to `app-config.yaml` (required by new backend system)

### React & Frontend
- Upgraded React from `17.0.2` to `18.3.1`
- Migrated `ReactDOM.render()` to `createRoot()` API
- Enabled new JSX transform (`"jsx": "react-jsx"` in tsconfig)
- Removed all `import React from 'react'` default imports (146 files)
- Replaced `JSX.Element` with global `JSX.Element` (React 18 compatible)
- Upgraded `@testing-library/react` from `12.x` to `16.3.2`
- Upgraded `@testing-library/jest-dom` from `5.x` to `6.x`
- Added `@testing-library/dom` (peer dependency of `@testing-library/react` 16)
- Pinned `react-router`/`react-router-dom` to `^6.30.0` (Backstage doesn't support v7)

### MUI Migration (v4 → v5)
- Replaced all `@material-ui/core` imports with `@mui/material` deep imports
- Replaced all `@material-ui/icons/*` with `@mui/icons-material/*`
- Migrated `@material-ui/lab` (Alert, Autocomplete) to `@mui/material`
- Converted all `makeStyles` (37 files) to `@emotion/css`'s `css()` function
- Updated `Select` `onChange` handlers to use `SelectChangeEvent<T>`
- Migrated `Tabs`/`Tab` from `classes` prop to `className`/`TabIndicatorProps`
- Added `@emotion/react`, `@emotion/styled`, `@emotion/css`
- Removed `@material-ui/core`, `@material-ui/icons`, `@material-ui/lab`

### Backend Plugin (`cad-backend`)
- Upgraded `@kubernetes/client-node` from `0.22.3` to `1.4.0`
- Replaced deprecated `request` library with Node.js `https` module
- Replaced `express-promise-router` with Express 5's native `Router`
- Removed `@backstage/backend-common` (only used for `errorHandler`)
- Fixed Express 5 route syntax (`/*` → `/{*path}`)
- Fixed `request.body` null check for GET requests
- Used `kubeConfig.applyToHTTPSOptions()` instead of removed `applyToRequest()`

### Testing
- Added `jest@30` and `@jest/environment-jsdom-abstract` (required by new CLI)
- Added `@monaco-editor/react` mock for test environment
- Fixed `findSelectInput` test utility for MUI v5 (`role="combobox"`)
- Suppressed jsdom CSS parsing errors from `@backstage/ui`'s modern CSS
- Added `jest.setup.js` polyfills for Node.js 22+ compatibility

### Other Dependency Upgrades
- `js-yaml`: `4.x` → `5.2.1` (with API option renames)
- `cypress`: `7.x` → `13.17.0` (with config migration to `cypress.config.ts`)
- `prettier`: `2.x` → `3.9.5`
- `concurrently`: `6.x` → `9.2.3`
- `cross-env`: `7.x` → `10.1.0`
- `better-sqlite3`: `12.10.0` → `12.11.1`
- `typescript`: `5.4.5` → `5.9.3`

### Cleanup
- Removed `lerna` and `lerna.json` (replaced by `backstage-cli repo` commands)
- Removed unused resolutions (`@types/webpack-env`, `@backstage/core-components`)
- Updated `engines.node` to `>=20.0.0`
- Removed `better-sqlite3` from root dependencies
- Removed unused `@mui/lab` dependency
- Updated root scripts to use `backstage-cli repo` commands

## What was tested

- `tsc --noEmit --skipLibCheck` — 0 errors
- `backstage-cli package test` — 5 suites, 42 tests pass (both packages)
- `backstage-cli repo lint` — clean, 0 errors
- Backend startup — all 5 plugins initialize successfully
- Kubernetes API proxy — verified against local porch/kind cluster
- Frontend dev server compiles and serves correctly

## Not included

### `react-router-dom` v7
Backstage's routing layer (`@backstage/core-app-api`, `FlatRoutes`) is built on react-router v6 APIs. Upgrading to v7 would require changes upstream in Backstage. Pinned to `^6.30.0`.

### `@mui/material` v9
MUI v9 introduced breaking changes to the theme object (e.g., `theme.alpha()`) that are incompatible with Backstage's theme provider (`@backstage/theme`). Backstage itself still depends on `@mui/material ^5.12.2` and ships MUI v4 components in `@backstage/core-components`. Stays on v5.18.0.

### `@material-ui/core` in Backstage internals
`@backstage/core-components` still depends on `@material-ui/core ^4.12.2` internally. This is a Backstage upstream concern — our plugin code no longer imports from `@material-ui/*`, but it remains as a transitive dependency via Backstage packages.

### `react` v19
React 19 has breaking changes and Backstage packages currently peer-depend on `react ^17 || ^18`. Upgrading would break compatibility with `@backstage/core-components`, `@backstage/test-utils`, and other framework packages. Stays on `18.3.1`.

### `step-security/harden-runner` (GitHub Actions)
This is a CI workflow update (`2.19.4` → `2.20.0`), not a code dependency. Should be handled as a separate PR to the `.github/workflows/` directory.

### `moment`
`moment` (`2.30.1`) is the latest release and the library is in maintenance mode. A migration to `dayjs` or `date-fns` would be a separate effort with API changes.
