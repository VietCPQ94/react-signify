# React Signify

![image](https://files.notice.studio/workspaces/d8b84700-32ef-4e9d-9d5e-3eebb0e5e197/ee5da14e-f977-4016-a664-4169e7888ccf.png)

# Introduction

React Signify is a simple library that provides features for managing and updating global state efficiently. It is particularly useful in React applications for managing state and auto-syncing when their values change.
Advantages of the library:

-   Lightweight library
-   Simple syntax
-   Supports effective re-render control

# Project information

-   Git: https://github.com/VietCPQ94/react-signify
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

## Initialize

You can initialize Signify in any file, please refer to the following example

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);
```

Here we create a variable `sCount` with an initial value of `0`.

## Used in many places

The usage is simple with the export/import tool of the module.
File Store.js (export Signify)

```tsx
import { signify } from 'react-signify';

export const sCount = signify(0);
```

Component A (import Signify)

```tsx
import { sCount } from './store';

export default function ComponentA() {
    const countValue = sCount.use();
    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };

    return (
        <div>
            <h1>{countValue}</h1>
            <button onClick={handleUp}>UP</button>
        </div>
    );
}
```

From here we can see the flexibility of Signify, simple declaration, usable everywhere.

## Basic features

### Display on the interface

We will use the `html` attribute to display the value as a `string` or `number` on the interface.

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
    const handleSet = () => {
        sCount.set(1);
    };

    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };

    return (
        <div>
            <h1>{sCount.html}</h1>
            <button onClick={handleSet}>Set 1</button>
            <button onClick={handleUp}>UP 1</button>
        </div>
    );
}
```

Pressing the button will change the value of Signify and will be automatically updated on the interface.

## Advanced features

### Use

The feature allows retrieving the value of Signify and using it as a state of the component.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    const countValue = sCount.use();
    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };

    return (
        <div>
            <h1>{countValue}</h1>
            <button onClick={handleUp}>UP</button>
        </div>
    );
}
```

### watch

The feature allows for safe tracking of the value changes of Signify.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };

    sCount.watch(value => {
        console.log(value);
    });

    return (
        <div>
            <button onClick={handleUp}>UP</button>
        </div>
    );
}
```

### Wrap

The feature applies the value of Signify in a specific interface area.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };
    return (
        <div>
            <sCount.Wrap>
                {value => (
                    <div>
                        <h1>{value}</h1>
                    </div>
                )}
            </sCount.Wrap>
            <button onClick={handleUp}>UP</button>
        </div>
    );
}
```

### Hardwrap

The feature applies the value of Signify in a specific interface area and limits unnecessary re-renders when the parent component re-renders.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    const handleUp = () => {
        sCount.set(pre => {
            pre.value += 1;
        });
    };
    return (
        <div>
            <sCount.HardWrap>
                {value => (
                    <div>
                        <h1>{value}</h1>
                    </div>
                )}
            </sCount.HardWrap>
            <button onClick={handleUp}>UP</button>
        </div>
    );
}
```

### reset

A tool that allows restoring the default value. Helps free up resources when no longer in use.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

sCount.reset();
```

# See more

-   [Reference API](https://reactsignify.dev?page=178ffe42-6184-4973-8c66-4990023792cb)
-   [Render & Update](https://reactsignify.dev?page=6fea6251-87d1-4066-97a1-ff3393ded797)
-   [Usage with TypeScript](https://reactsignify.dev?page=ecc96837-657b-4a13-9001-d81262ae78d8)
-   [Devtool](https://reactsignify.dev?page=e5e11cc8-10a6-4979-90a4-a310e9f5c8b8)
-   [Style Guide](https://reactsignify.dev?page=074944b4-eb6c-476f-b293-e8768f45e5dc)
-   [Structure](https://reactsignify.dev?page=159467bd-4bed-4d5f-af11-3b9bb20fc9d6)
-   [Understand Signify](https://reactsignify.dev?page=a022737b-5f0e-47a5-990f-fa9a3b62662d)
