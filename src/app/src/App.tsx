import React from 'react';
import { CacheType, signify } from './dist';

const a = signify(0, {
  cache: {
    key: 'data',
    type: CacheType.LocalStorage,
    isSync: true
  }
});

export default function App() {
  return (
    <div>
      App
      {a.html}
      <button onClick={() => (a.value += 1)}>UP</button>
    </div>
  );
}
