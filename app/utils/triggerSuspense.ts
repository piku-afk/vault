export function triggerSuspense() {
  throw new Promise(() => {});
}
