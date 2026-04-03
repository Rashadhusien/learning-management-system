/**
 * Performance utilities to prevent forced reflows and layout thrashing
 */

// Debounce function to batch rapid DOM operations
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function to limit how often a function can be called
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Batch DOM operations to prevent forced reflows
export function batchDOMOperations(operations: (() => void)[]) {
  requestAnimationFrame(() => {
    operations.forEach((operation) => operation());
  });
}

// Measure layout performance (for development)
export function measureLayoutPerformance(label: string) {
  if (process.env.NODE_ENV !== "development") return () => {};

  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
  };
}

// Safe DOM measurement that doesn't cause forced reflows
export async function safeMeasureLayout<T>(
  element: HTMLElement | null,
  measurementFn: (element: HTMLElement) => T,
): Promise<T | null> {
  if (!element) return Promise.resolve(null);

  // Use requestAnimationFrame to ensure we're not forcing layout
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      try {
        const result = measurementFn(element);
        resolve(result);
      } catch (error) {
        console.error("Layout measurement failed:", error);
        resolve(null);
      }
    });
  });
}

// Optimized scroll handler
export function createOptimizedScrollHandler(
  callback: () => void,
  options: { throttle?: number; passive?: boolean } = {},
) {
  const { throttle: throttleMs = 16, passive = true } = options;

  return throttle(callback, throttleMs);
}

// Check if element is in viewport without forcing layout
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
