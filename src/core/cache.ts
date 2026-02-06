export class CachedApi {
  private readonly cached = new Map<string, unknown>();

  get<T, A extends unknown[]>(key: string, Api: new (...args: A) => T, ...args: A): T {
    let api = this.cached.get(key) as T | undefined;
    if (!api) {
      api = new Api(...args);
      this.cached.set(key, api);
    }
    return api;
  }

  clear(): void {
    this.cached.clear();
  }
}
