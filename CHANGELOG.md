# Breaking Changes

## v0.0.10
Corresponding microsoft-teams-library-js version: 1.9.0

### New Capabilities organization introduced

The following capabilities have been used to reorganize several existing APIs in the App SDK:

#### `Tasks` namespace has been renamed `Dialog` and the following APIs have been renamed
* `startTask` has been renamed `open`
* `submitTasks` has been renamed `submit`
* `updateTask` has been renamed `resize`
* `TaskModuleDimension` enum has been renamed `DialogDimension`

#### `Settings` namespace has been renamed `Pages.Config` and the following APIs have been renamed
* `getSettings` has been renamed `getConfig`
* `setSettings` has been renamed `setConfig`

#### Several APIs have been moved from `teamsCore` namespace
* `getTabInstances`, `getMruTabInstances`, `navigateToTab` APIs have moved to `pages.tabs` capability
* `navigateCrossDomain`, `returnFocus`, `navigateBack` APIs have moved to `pages` capability

#### Added Notifications capability
* `showNotification` has moved to `notifications` capability

**We reserve the right to change the grouping based on teamsjs API Reviews, which are still in progress.**

### `teamsCore` namespace now exported
Fixed a bug where the `teamsCore` namespace wasn't exported.

## v0.0.7
Corresponding microsoft-teams-library-js version: 1.9.0

### Several core API functions have been moved to 'teamsCore' namespace

API functions that are not directly implemented by the teamsjs Hub SDK that were previously under the 'core' namespace have been moved to a new namespace called 'teamsCore' for now.
This teamsCore namespace is temporary and APIs will move again when the work to organize them by capability is completed.

Kept in 'core':
* Initialize
* getContext
* registerOnThemeChangeHandler
* shareDeepLink
* executeDeepLink

Moved to 'teamsCore':
* enablePrintCapability
* print
* registerFullScreenHandler
* registerAppButtonClickHandler
* registerAppButtonHoverEnterHandler
* registerAppButtonHoverLeaveHandler
* registerBackButtonHandler
* registerOnLoadHandler
* registerBeforeUnloadHandler
* registerChangeSettingsHandler
* getTabInstances
* getMruTabInstances
* setFrameContext
* initializeWithFrameContext

### The teamsjs Test App is moved into the monorepo

The teamsjs Test App contents are now moved into \<root\>/examples/teamsjs-test-app.


## v0.0.6

### The JavaScript library "teams-js" has been renamed to "teamsjs-app-sdk"

Renamed "teams-js" to temporary code name "teamsjs-app-sdk".

### All the public API functions have been moved under 'core' namespace

Using `import * as ... from ...` will now fail. Organized top-level library functions under a core namespace. Importing now follows the following convention:

```typescript
import { core } from "@microsoft/teamsjs-app-sdk";
```

### The teamsjs App SDK repo is now a monorepo

We utilized [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) to turn our repo into a monorepo. The files specific to the App SDK has been moved to an inner directory
with the same name teamsjs-app-sdk. This prepares the repo for the addition of the teamsjs Test App which will be located under \<root\>/examples/teamsjs-test-app/.