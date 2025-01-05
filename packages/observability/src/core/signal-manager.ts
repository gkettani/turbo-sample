import type { Resource } from '@opentelemetry/resources';
import type { SignalConfig } from './types';

export abstract class SignalManager<TConfig extends SignalConfig> {
  protected readonly resource: Resource;
  protected readonly config: TConfig;

  constructor(config: TConfig, resource: Resource) {
    this.config = config;
    this.resource = resource;
  }

  abstract init(): void;
  abstract shutdown(): Promise<void>;
  abstract isEnabled(): boolean;
}
