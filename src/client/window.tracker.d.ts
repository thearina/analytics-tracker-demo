/**
 * `export` or `import` can make file a module (instead of a script).
 * See https://www.typescriptlang.org/docs/handbook/2/modules.html#non-modules
 */
import type { Tracker } from "./tracker.types.js";

/**
 * In modules this is the way to augment global types.
 * See https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
 * In a script we would omit `declare global` and use `interface Window { ... }` directly because
 * scripts always have global scope.
 */
declare global {
  interface Window {
    tracker?: Tracker;
  }
}
