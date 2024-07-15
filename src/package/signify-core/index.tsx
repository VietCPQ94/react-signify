import { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { TSetterCallback, TSignifyConfig, TSliceOmit, TWrapProps } from './signify.model';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { syncSystem } from '../signify-sync';

class Signify<T = unknown> {
  private _isRender = true;
  private _initialValue: Readonly<T>;
  private _value: Readonly<T>;
  private _config?: TSignifyConfig;
  private listeners = new Set<(newValue: T) => void>();
  private syncSetter?(data: T): void;

  constructor(initialValue: T, config?: TSignifyConfig) {
    this._initialValue = initialValue;
    this._value = getInitialValue(initialValue, config?.cache);
    this._config = config;

    if (config?.syncKey) {
      const { post, sync } = syncSystem<T>({
        key: config.syncKey,
        cb: data => {
          this._value = data;
          cacheUpdateValue(this.value, this._config?.cache);
          this.inform();
        }
      });

      this.syncSetter = post;

      sync(() => this.value);
    }
  }

  private inform() {
    if (this._isRender) {
      this.listeners.forEach(listener => listener(this.value));
    }
  }

  get value() {
    return this._value;
  }

  set(v: T | TSetterCallback<T>) {
    let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

    if (!Object.is(this.value, tempVal)) {
      this._value = tempVal;
      cacheUpdateValue(this.value, this._config?.cache);
      this.syncSetter?.(this.value);
      this.inform();
    }
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

    return this.value;
  }

  watch(callback: (newValue: Readonly<T>) => void, deps?: DependencyList) {
    useLayoutEffect(() => {
      this.listeners.add(callback);

      return () => {
        this.listeners.delete(callback);
      };
    }, deps ?? []);
  }

  stop() {
    this._isRender = false;
  }

  resume() {
    this._isRender = true;
    this.inform();
  }

  slice<P>(pick: (value: Readonly<T>) => P): Omit<Signify<P>, TSliceOmit> {
    const signifyElement = new Signify(pick(this.value));
    this.listeners.add(value => signifyElement.set(pick(value)));

    return signifyElement;
  }

  html = jsx(() => {
    const value = this.use();

    return <>{value}</>;
  }, {});

  Wrap = ({ children }: TWrapProps<T>) => {
    const value = this.use();

    return children(value);
  };

  HardWrap = memo(this.Wrap, () => true) as typeof this.Wrap;

  reset() {
    this.set(getInitialValue(this._initialValue, this._config?.cache));
  }
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig) => new Signify(initialValue, config);
