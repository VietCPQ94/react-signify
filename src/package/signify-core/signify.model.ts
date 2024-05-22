import { TCacheConfig } from '../singify-cache/cache.model';

export type TSignifyConfig = {
  cache?: TCacheConfig;
  syncKey?: string;
};
