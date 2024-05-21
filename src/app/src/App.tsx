import React from 'react';
import { signify } from './dist';

const a = signify(0);

export default function App() {
  return (
    <div>
      App
      {a.html}
      <button onClick={() => (a.value += 1)}>UP</button>
    </div>
  );
}
