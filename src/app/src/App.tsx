import { useState } from 'react';
import { signify } from 'react-signify';

export const sCount = signify(0);

export const sUser = signify({
    name: 'Viet',
    info: {
        age: 27,
        address: 'USA'
    }
});

const ssAge = sUser.slice(n => n.info.age);

export default function App() {
    const count = sCount.use();
    const age = ssAge.use();
    const [isWatch, setIsWatch] = useState(false);
    const [isWatchSlice, setIsWatchSlice] = useState(false);
    sCount.watch(v => {
        setIsWatch(true);
    });

    ssAge.watch(v => {
        setIsWatchSlice(true);
    });

    return (
        <>
            <div>
                <button data-testid="btn-set" onClick={() => sCount.set(pre => pre + 1)}>
                    set
                </button>
                <button data-testid="btn-stop" onClick={sCount.stop}>
                    stop
                </button>
                <button data-testid="btn-resume" onClick={sCount.resume}>
                    resume
                </button>
                <button data-testid="btn-reset" onClick={sCount.reset}>
                    reset
                </button>
            </div>
            <h1>Normal Case</h1>
            <p data-testid="p-html">{sCount.html}</p>
            <p data-testid="p-value">{sCount.value}</p>
            <p data-testid="p-use">{count}</p>
            <sCount.Wrap>{n => <p data-testid="p-wrap">{n}</p>}</sCount.Wrap>
            <sCount.HardWrap>{n => <p data-testid="p-hardwrap">{n}</p>}</sCount.HardWrap>
            <p data-testid="pw-watch">{isWatch && 'OK'}</p>
            <hr />
            <div>
                <button
                    data-testid="btn-setAge"
                    onClick={() =>
                        sUser.set(pre => {
                            let temp = { ...pre };
                            temp.info.age = temp.info.age + 1;
                            return temp;
                        })
                    }
                >
                    set Age
                </button>
                <button data-testid="btn-resetUser" onClick={sUser.reset}>
                    reset
                </button>
                <button data-testid="btn-stopAge" onClick={ssAge.stop}>
                    stop
                </button>
                <button data-testid="btn-resumeAge" onClick={ssAge.resume}>
                    resume
                </button>
            </div>
            <h1>Slice</h1>
            <p data-testid="ps-html">{ssAge.html}</p>
            <p data-testid="ps-value">{ssAge.value}</p>
            <p data-testid="ps-use">{age}</p>
            <ssAge.Wrap>{n => <p data-testid="ps-wrap">{n}</p>}</ssAge.Wrap>
            <ssAge.HardWrap>{n => <p data-testid="ps-hardwrap">{n}</p>}</ssAge.HardWrap>
            <p data-testid="psw-watch">{isWatchSlice && 'OK'}</p>
        </>
    );
}
