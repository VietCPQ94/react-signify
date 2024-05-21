import React, { memo, useLayoutEffect, useState } from 'react';

declare class Signify<T = any> {
  constructor(initialValue: T);
  value: T;
  use: () => T;
  html: React.JSX.Element;
  Wrap: ({ children }: { children: (value: T) => React.JSX.Element }) => React.JSX.Element;
  HardWrap: typeof this.Wrap;
}

function Signify<T>(this: Signify<T>, initialValue: T) {
  let _value = initialValue;
  const listeners = new Set<(newValue: T) => void>();

  const inform = () => {
    listeners.forEach(l => l(_value));
  };

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

  this.html = (() => {
    const Cmp = memo(this.use as () => React.JSX.Element, () => true);

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

  Object.defineProperties(this, {
    value: {
      get() {
        return _value;
      },
      set(v) {
        _value = v;
        inform();
      },
      configurable: false,
      enumerable: false
    }
  });
}

export const signify = <T,>(initialValue: T) => {
  return new Signify(initialValue);
};
