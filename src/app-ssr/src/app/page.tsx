'use client';

import { sCount } from './store';

export default function Home() {
    const count = sCount.use(n => n.count);
    return (
        <div>
            Count: {count}
            <button onClick={() => sCount.set(n => (n.value.count += 1))}>Up</button>
        </div>
    );
}
