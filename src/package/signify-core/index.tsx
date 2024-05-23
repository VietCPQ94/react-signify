import { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { TSignifyConfig } from './signify.model';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { syncSystem } from '../signify-sync';

class Signify<T = unknown> {
  private _value: T;
  private _config?: TSignifyConfig;
  private listeners = new Set<(newValue: T) => void>();
  private syncSetter?: (data: T) => void;

  constructor(initialValue: T, config?: TSignifyConfig) {
    this._value = getInitialValue(initialValue, config?.cache);
    this._config = config;

    this.syncSetter = syncSystem<T>({
      key: config?.syncKey,
      cb: data => {
        this._value = data;
        this.inform();
      }
    });
  }

  private inform() {
    this.listeners.forEach(listener => listener(this._value));
  }

  get value() {
    return this._value;
  }

  set value(v: T) {
    this._value = v;
    cacheUpdateValue(this._value, this._config?.cache);
    this.syncSetter?.(this._value);
    this.inform();
  }

  use() {
    const trigger = useState({})[1];

    useLayoutEffect(() => {
      const listener = () => trigger({});
      this.listeners.add(listener);

      return () => {
        this.listeners.delete(listener);
      };
    }, []);

    return this._value;
  }

  watch(callback: (newValue: T) => void, deps?: DependencyList) {
    useLayoutEffect(() => {
      this.listeners.add(callback);
      return () => {
        this.listeners.delete(callback);
      };
    }, deps ?? []);
  }

  html = jsx(() => {
    const value = this.use();
    return <>{value}</>;
  }, {});

  Wrap = ({ children }: { children: (value: T) => React.JSX.Element }) => {
    const value = this.use();
    return children(value);
  };

  HardWrap = memo(this.Wrap, () => true) as typeof this.Wrap;

  reset() {
    this.value = getInitialValue(this._value, this._config?.cache);
  }
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig) => new Signify(initialValue, config);
