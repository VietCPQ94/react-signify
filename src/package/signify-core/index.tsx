import { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { TSetterCallback, TSignifyConfig, TWrapProps } from './signify.model';

class Signify<T = unknown> {
  private _isRender = true;
  private _initialValue: T;
  private _value: T;
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

  private fireUpdate() {
    cacheUpdateValue(this.value, this._config?.cache);
    this.syncSetter?.(this.value);
    this.inform();
  }

  get value() {
    return this._value as Readonly<T>;
  }

  set(v: T | TSetterCallback<T>) {
    let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

    if (!Object.is(this.value, tempVal)) {
      this._value = tempVal;
      this.fireUpdate()
    }
  }

  update(cb: (value: T) => void) {
    cb(this._value);
    this.fireUpdate()
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

    return this.value as Readonly<T>;
  }

  watch(callback: (newValue: T) => void, deps?: DependencyList) {
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

  slice<P>(pick: (value: T) => P) {
    let value: Readonly<P> = pick(this.value);
    const listeners = new Set<(newValue: P) => void>();

    this.listeners.add((v) => {
      if (!Object.is(pick(v), value)) {
        value = pick(v);
        listeners.forEach(listener => listener(value));
      }
    });

    const use = () => {
      const trigger = useState({})[1];

      useLayoutEffect(() => {
        const listener = () => trigger({});
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      }, []);

      return value;
    }

    const html = jsx(() => {
      const value = use();
      return <>{value}</>;
    }, {})

    const Wrap = ({ children }: TWrapProps<P>) => {
      const value = use();
      return children(value);
    }

    const HardWrap = memo(Wrap, () => true) as typeof Wrap;

    return { value, use, html, Wrap, HardWrap };
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
