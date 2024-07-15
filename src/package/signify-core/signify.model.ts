import { TCacheConfig } from '../singify-cache/cache.model';

export type TSignifyConfig = {
  cache?: TCacheConfig;
  syncKey?: string;
};

export type TSetterCallback<T> = (preValue: Readonly<T>) => T;

export type TSliceOmit = 'set' | 'stop' | 'resume' | 'reset' | 'slice';

export type TWrapProps<T> = { children(value: Readonly<T>): React.JSX.Element };
