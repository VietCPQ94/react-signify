import React, { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { TSignifyConfig } from './signify.model';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { syncSystem } from '../signify-sync';

declare class Signify<T = unknown> {
  constructor(initialValue: T, config?: TSignifyConfig);
  value: T;
  use(): T;
  watch(callback: (newValue: T) => void, deps?: DependencyList): void;
  html: React.JSX.Element;
  Wrap({ children }: { children: (value: T) => React.JSX.Element }): React.JSX.Element;
  HardWrap: typeof this.Wrap;
  reset(): void;
}

function Signify<T>(this: Signify<T>, initialValue: T, config?: TSignifyConfig) {
  let _value: T = getInitialValue(initialValue, config?.cache);

  const listeners = new Set<(newValue: T) => void>();

  const inform = () => listeners.forEach(l => l(_value));

  const syncSetter = syncSystem<T>({
    key: config?.syncKey,
    cb: data => {
      _value = data;
      inform();
    }
  });

  Object.defineProperties(this, {
    value: {
      get() {
        return _value;
      },
      set(v) {
        _value = v;
        cacheUpdateValue(_value, config?.cache);
        syncSetter?.(_value);
        inform();
      },
      configurable: false,
      enumerable: false
    }
  });

  this.use = () => {
    const trigger = useState({})[1];

    useLayoutEffect(() => {
      const listener = () => {
        trigger(() => ({}));
      };

      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    }, []);

    return _value;
  };

  this.watch = (cb, deps) => {
    useLayoutEffect(() => {
      listeners.add(cb);

      return () => {
        listeners.delete(cb);
      };
    }, deps ?? []);
  };

  this.html = (() => {
    const Cmp = this.use as () => React.JSX.Element;

    return <Cmp />;
  })();

  this.Wrap = ({ children }) => {
    const trigger = useState({})[1];

    useLayoutEffect(() => {
      const listener = () => {
        trigger(() => ({}));
      };

      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    }, []);

    return children(_value);
  };

  this.HardWrap = memo(this.Wrap, () => true) as typeof this.Wrap;

  this.reset = () => {
    this.value = initialValue;
  };
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig) => {
  return new Signify(initialValue, config);
};
