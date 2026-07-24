export interface ConfigurationSource<T> {
  load(signal: AbortSignal): Promise<T>;
}
