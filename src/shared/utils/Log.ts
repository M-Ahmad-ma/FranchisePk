/**
 * Dev-only logging helper.
 *
 * Guarded so the wrapper is a no-op in release builds even if the minifier's
 * `drop_console` pass is ever disabled. Release bundles strip the inner call
 * via metro.config.js as well, so nothing is emitted either way.
 */
export function Log(tag: string, ...args: unknown[]) {
  if (!__DEV__) return;
  console.log(`[${tag}]`, ...args);
}
