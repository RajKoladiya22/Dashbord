// If you’re listening to scroll or resize in your layout (e.g. to set navbar fill), debounce that handler to avoid flooding React state updates:
export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 100) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  
