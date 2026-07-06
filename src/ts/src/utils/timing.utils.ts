import type { AliasLogger } from "./log.utils";

export function time<TFn extends (...args: any) => any>(
  logger: AliasLogger,
  fn: TFn,
  ...args: Parameters<TFn>
): ReturnType<TFn> {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  const duration = end - start;
  logger.debug(`${fn.name} execution took ${duration}ms`);
  return result;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
