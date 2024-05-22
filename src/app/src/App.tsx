import React from 'react';
import { signify } from './dist';

const a = signify(0, {
  syncKey: 'key'
});

export default function App() {
  return (
    <div>
      <h1>{a.html}</h1>
      <button onClick={() => (a.value += 1)}>UP</button>
    </div>
  );
}
