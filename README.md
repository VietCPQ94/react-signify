# React Signify

![image](https://files.notice.studio/workspaces/d8b84700-32ef-4e9d-9d5e-3eebb0e5e197/7261764d-6870-4fee-9de9-379ad2e9f80a.png)

# Introduction

React Signify is a simple library that provides efficient management and updating of global state. It can be particularly useful in React applications to manage state and synchronize automatically when their values change.
Advantages of the library:

-   Compact library
-   Simple syntax
-   Efficiently control re-render support

# Project information

-   Git : [https://github.com/VietCPQ94/react-signify](https://github.com/VietCPQ94/react-signify)
-   NPM: [https://www.npmjs.com/package/react-signify](https://www.npmjs.com/package/react-signify)

# Installation

React Signify is available as a package on NPM for use with React applications:

```
# NPM
npm install react-signify

# Yarn
yarn add react-signify
```

# Basic feature

## Initialization

You can initialize Signify in any file, refer to the following example

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);
```

Here we create a variable `sCount` with an initial value of `0`.

## Usage

### Display on the interface

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

Also with the above example, we will create a button to update the value of Signify.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    return (
        <div>
            <h1>{sCount.html}</h1>
            <button onClick={() => sCount.set(1)}>Set 1</button>
            <button onClick={() => sCount.set(pre => pre + 1)}>UP 1</button>
        </div>
    );
}
```

When clicking the `button`, the value of `sCount` will be increased by 1 unit.
Changing the Signify value will update the displayed value in the `<h1>` tag without causing the App Component to re-render.

## Advanced features

### Use

Feature that allows fetching the value of Signify and using it as a component state.

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
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

Use `use( )` when integrating Signify with other React hooks such as `useEffect`, `useCallback`, `useMemo`, etc...
When using `use( )`, changing the value of Signify will cause the component to be re-rendered.

### watch

Tool that allows tracking the value changes of Signify safely.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

export default function App() {
    sCount.watch(newValue => {
        console.log(newValue);
    }, []);
    return (
        <div>
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

`watch` does not cause component re-render when the value of Signify changes.
`watch` is often used in cases where events are triggered when the value of Signify satisfies certain conditions.

### Wrap

Tool that allows applying the value of Signify in a specific interface area.

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
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

By using `Wrap`, we isolate the interface scope being re-rendered when the Signify value changes.

### Hardwrap

Similar to `Wrap`, but more optimized because `Hardwrap` limits unnecessary re-renders when the parent component re-renders.

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
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

`Hardwrap` isolates itself to avoid being affected by re-render from parent components.
Cannot use states from outside the `Hardwrap` scope because they cannot be updated when inside the `Hardwrap` scope.

### reset

Tool that allows restoring the default value.

```tsx
import { signify } from 'react-signify';

const sCount = signify(0);

sCount.reset();
```

# Cache

## Localstorage

Tool that allows synchronizing Signify values into localstorage.

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
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

Suitable for storing and reusing when creating or reloading browser tabs.

###

## IndexDB

coming soon...

# Synchronized across browsers

## Idea

Development features aim to synchronize the Global State of Signify across tabs in the browser. Now we can easily communicate data between different tabs.

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
            <button onClick={() => sCount.set(pre => pre + 1)}>UP</button>
        </div>
    );
}
```

With the above code, Signify uses `syncKey` to support data synchronization between browser tabs.

# Q&A

Frequently asked questions when using React Signify

## When to use React Signify?

When you need a simple but effective global state management system.

## Is React Signify difficult to use?

According to the survey of programmers who have used it, they only need 10 minutes to get acquainted and apply it immediately to real projects.

## Does React Signify changes lead to re-render?

Yes, because essentially, the component needs to re-render to update the latest value, but with React Signify, managing re-render becomes much easier by effectively isolating the re-render scope.

## Does React Signify have long-term support?

Yes, if the library encounters errors during usage, please submit the issue to us here: [https://github.com/VietCPQ94/react-signify/issues](https://github.com/VietCPQ94/react-signify/issues)
