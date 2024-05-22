# React Signify

![image](https://files.notice.studio/workspaces/d8b84700-32ef-4e9d-9d5e-3eebb0e5e197/7261764d-6870-4fee-9de9-379ad2e9f80a.png)

# Introduction

This is a simple library called React Signify that provides an efficient way to manage and update global state. It can be particularly useful in React applications for managing state and automatically syncing when their values change.
Advantages of the library:

- Lightweight library (< 2kB)
- Simple syntax
- Efficient re-render control support

# Installation

React Signify is available as a package on NPM for use with React applications:

```
# NPM
npm install react-signify

# Yarn
yarn add react-signify
```

# Guide

## Initialization

You can initialize Signify in any file, refer to the following example

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);
```

Here we create a variable `sCount` with an initial value of `0`.

## Usage

### Display on the interface

You will use the `html` attribute to display the value on the interface.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  return (
    <div>
      <h1>{sCount.html}</h1>
    </div>
  );
}
```

### Update value

Also with the example above, we will create a button to update the value of Signify.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  return (
    <div>
      <h1>{sCount.html}</h1>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

When clicking the `button`, the value of `sCount` will be incremented by 1 unit.
Changing the Signify value will update the display value at the `<h1>` tag without re-rendering the App Component.

## Advanced

### Use

The tool allows getting the value of Signify and using it as a component state.

```tsx
import { useEffect } from 'react';
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  const countValue = sCount.use();

  useEffect(() => {
    console.log(countValue);
  }, [countValue]);

  return (
    <div>
      <h1>{countValue}</h1>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

Use `use()` when integrating Signify with other React hooks such as `useEffect`, `useCallback`, `useMemo`, etc...
When using `use()`, changing the value of Signify will cause the component to be re-rendered.

### watch

The tool allows safely tracking the value changes of Signify.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  sCount.watch(newValue => {
    console.log(newValue);
  }, []);
  return (
    <div>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

`watch` does not cause the component to re-render when the value of Signify changes
`watch` is often used in cases where events are triggered when the value of Signify satisfies certain conditions.

### wrap

The tool allows applying the value of Signify in a specific interface area.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  return (
    <div>
      <sCount.Wrap>
        {value => (
          <div>
            <h1>{value}</h1>
          </div>
        )}
      </sCount.Wrap>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

By using `wrap`, we will isolate the interface scope being re-rendered when the Signify value changes.

### hardwrap

Similar to `wrap`, but more optimized when not re-rendering when component re-renders.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
  return (
    <div>
      <sCount.HardWrap>
        {value => (
          <div>
            <h1>{value}</h1>
          </div>
        )}
      </sCount.HardWrap>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

`hardwrap` self-isolates to avoid being affected by re-render from other components.
Cannot use states from outside the `hardwrap` scope as they cannot be updated when inside the Hardwrap scope.

### reset

The tool allows restoring the default value.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

sCount.reset();
```

# Cache

## Localstorage

The tool allows synchronizing the value of Signify to local storage.

```tsx
import { CacheType, signify } from 'react-signify';

const sCount = signify(0, {
  cache: {
    key: 'countKey',
    type: CacheType.LocalStorage
  }
});

export default function App() {
  return (
    <div>
      <h1>{sCount.html}</h1>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

Suitable when you need to store and reuse when creating or reloading browser tabs.

###

## IndexDB

comming soon...

# Synchronize on the browser

## Idea

The development feature aims to synchronize Signify between tabs on the browser. Now we can easily communicate data between different tabs.

## Implementation

```tsx
import { signify } from 'react-signify';

const sCount = signify(0, {
  syncKey: 'data_key'
});

export default function App() {
  return (
    <div>
      <h1>{sCount.html}</h1>
      <button onClick={() => (sCount.value += 1)}>UP</button>
    </div>
  );
}
```

With the above code, Signify along with the `syncKey` of the browser tabs will synchronize data with each other.

# Q&A

Frequently asked questions when using React Signify

## When to use React Signify?

When you need a simple but effective global state management system.

## Is React Signify difficult to use?

According to the survey, programmers only need 10 minutes to get acquainted and apply it to real projects.

## Does React Signify changes lead to re-render?

Yes, essentially, the component needs to re-render to update the latest value, but with React Signify, managing re-rendering becomes much easier by effectively isolating the re-render scope.

## Is React Signify library supported in the long term?

Yes, if the library encounters an error during use, please submit the issue to us here: [https://github.com/VietCPQ/react-signify/issues](https://github.com/VietCPQ/react-signify/issues)

# Project information

- Git: [https://github.com/VietCPQ/react-signify](https://github.com/VietCPQ/react-signify)
- NPM: [https://www.npmjs.com/package/react-signify](https://www.npmjs.com/package/react-signify)
