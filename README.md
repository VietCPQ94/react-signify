# React Signify

![image](https://files.notice.studio/workspaces/d8b84700-32ef-4e9d-9d5e-3eebb0e5e197/ee5da14e-f977-4016-a664-4169e7888ccf.png)

# Introduction

React Signify is a simple library that provides efficient management and updating of global state. It is particularly useful in React applications for managing state and synchronizing when their values change.
Advantages of the library:

-   Compact library
-   Simple syntax
-   Efficient re-render control support

# Project information

-   Git: [https://github.com/VietCPQ94/react-signify](https://github.com/VietCPQ94/react-signify)
-   NPM: [https://www.npmjs.com/package/react-signify](https://www.npmjs.com/package/react-signify)

# Installation

React Signify is available as a package on NPM for use with React applications:

```
# NPM
npm install react-signify

# Yarn
yarn add react-signify
```

# Overview

## Initialization

You can initialize Signify in any file, refer to the following example

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);
```

Here we create a variable `sCount` with the initial value of `0`.

## Used in many places

Simple usage with module export/import tool.
Component A (export Signify)

```tsx
import { signify } from 'react-signify';

export const sCount = signify(0);

export default function ComponentA() {
    return (
        <div>
            <h1>{sCount.html}</h1>
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP</button>
        </div>
    );
}
```

Component B (import Signify)

```tsx
import { sCount } from './ComponentA';

export default function ComponentB() {
    return (
        <div>
            <h1>{sCount.html}</h1>
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP</button>
        </div>
    );
}
```

From here we can see the flexibility of Signify, simple declaration, and usage everywhere.

## Basic features

### Display on interface

We will use the `html` attribute to display the value on the interface.

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

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    return (
        <div>
            <h1>{sCount.html}</h1>
            <button onClick={() => sCount.set(1)}>Set 1</button>
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP 1</button>
        </div>
    );
}
```

Pressing the button will change the value of Signify and be automatically updated on the interface.

## Advanced features

### Use

Feature allows to get the value of Signify and use it as a component state.

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
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP</button>
        </div>
    );
}
```

### watch

Feature allows to track the value changes of Signify safely.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    sCount.watch(newValue => {
        console.log(newValue);
    }, []);
    return (
        <div>
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP</button>
        </div>
    );
}
```

### Wrap

Feature applies the value of Signify in a specific interface area.

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
            <button onClick={() => sCount.set(pre => (pre.value += 1))}>UP</button>
        </div>
    );
}
```

### Hardwrap

Feature applying the value of Signify in a UI area and limiting unnecessary re-renders when the parent component re-renders.

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
            <button onClick={() => sCount.set(pre => (pre += 1))}>UP</button>
        </div>
    );
}
```

### reset

Tool allows to restore the default value.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

sCount.reset();
```

# See more

[Reference API](https://reactsignify.dev?page=178ffe42-6184-4973-8c66-4990023792cb)
[Render & Update](https://reactsignify.dev?page=6fea6251-87d1-4066-97a1-ff3393ded797)
[Devtool](https://reactsignify.dev?page=e5e11cc8-10a6-4979-90a4-a310e9f5c8b8)
[Style Guide](https://reactsignify.dev?page=074944b4-eb6c-476f-b293-e8768f45e5dc)
[Structure](https://reactsignify.dev?page=159467bd-4bed-4d5f-af11-3b9bb20fc9d6)
[Understand Signify](https://reactsignify.dev?page=a022737b-5f0e-47a5-990f-fa9a3b62662d)
