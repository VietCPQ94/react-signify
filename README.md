# Signify Library

This is a simple library called Signify that provides a way to manage and reactively update a value. It can be particularly useful in React applications for managing state and triggering re-renders when the value changes.

## Usage

To use Signify, you can import it into your React component:

import React from 'react';
import { signify } from 'react-signify';

const myValue = signify(0);

## API

signify(initialValue: T)

- Creates a new instance of Signify with the initial value provided.

## Signify

Properties

- value: The current value stored in the Signify instance.

## Methods

- use(): Hook that returns the current value and triggers a re-render when the value changes.
- Wrap({ children }): Component that accepts a function as children and re-renders when the value changes.
- HardWrap: Same as Wrap but memoized to avoid unnecessary re-renders.

## Example

```tsx
const myValue = signify(0);

function MyComponent() {
  const value = myValue.use();

  return (
    <div>
      <span>{value}</span>
      <button onClick={() => (myValue.value += 1)}>Increment</button>
    </div>
  );
}
```

In this example, MyComponent will automatically update whenever myValue changes.

Feel free to explore and integrate react-signify into your React projects for efficient state management and reactivity.
