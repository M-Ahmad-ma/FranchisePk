export function Log(tag: string, ...args: unknown[]) {
  console.log(`[${tag}]`, ...args)
}
