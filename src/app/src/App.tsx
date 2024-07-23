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
    const user = sUser.use();
    const ageFake = sUser.use(n => n.info.age);
    const [isWatch, setIsWatch] = useState(false);
    const [isWatchSlice, setIsWatchSlice] = useState(false);
    const [isWatchUser, setIsWatchUser] = useState(false);
    sCount.watch(v => {
        setIsWatch(true);
    });

    ssAge.watch(v => {
        setIsWatchSlice(true);
    });

    sUser.watch(v => {
        setIsWatchUser(true);
    });

    return (
        <>
            <h1>Normal Case</h1>
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
                <button data-testid="btn-countEnableConditionRender" onClick={() => sCount.conditionRendering(v => v < 1)}>
                    Enable condition render
                </button>
                <button data-testid="btn-countDisableConditionRender" onClick={() => sCount.conditionRendering(() => true)}>
                    Disable condition render
                </button>
                <button data-testid="btn-countEnableConditionUpdate" onClick={() => sCount.conditionUpdating(pre => pre < 1)}>
                    Enable condition update
                </button>
                <button data-testid="btn-countDisableConditionUpdate" onClick={() => sCount.conditionUpdating(() => true)}>
                    Disable condition update
                </button>
            </div>
            <p data-testid="p-html">{sCount.html}</p>
            <p data-testid="p-value">{sCount.value}</p>
            <p data-testid="p-use">{count}</p>
            <sCount.Wrap>{n => <p data-testid="p-wrap">{n}</p>}</sCount.Wrap>
            <sCount.HardWrap>{n => <p data-testid="p-hardwrap">{n}</p>}</sCount.HardWrap>
            <p data-testid="pw-watch">{isWatch && 'OK'}</p>
            <hr />
            <h1>Slice</h1>
            <div>
                <button
                    data-testid="btn-setAge"
                    onClick={() =>
                        sUser.set(pre => ({
                            ...pre,
                            info: {
                                ...pre.info,
                                age: pre.info.age + 1
                            }
                        }))
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
                <button data-testid="btn-ageEnableConditionRender" onClick={() => ssAge.conditionRendering(v => v < 29)}>
                    Enable condition render
                </button>
                <button data-testid="btn-ageDisableConditionRender" onClick={() => ssAge.conditionRendering(() => true)}>
                    Disable condition render
                </button>
            </div>
            <p data-testid="ps-html">{ssAge.html}</p>
            <p data-testid="ps-value">{ssAge.value}</p>
            <p data-testid="ps-use">{age}</p>
            <ssAge.Wrap>{n => <p data-testid="ps-wrap">{n}</p>}</ssAge.Wrap>
            <ssAge.HardWrap>{n => <p data-testid="ps-hardwrap">{n}</p>}</ssAge.HardWrap>
            <p data-testid="psw-watch">{isWatchSlice && 'OK'}</p>
            <hr />
            <h1>Object Case</h1>
            <div>
                <button
                    data-testid="btnu-set"
                    onClick={() =>
                        sUser.set(pre => ({
                            ...pre,
                            info: {
                                ...pre.info,
                                age: pre.info.age + 1
                            }
                        }))
                    }
                >
                    set
                </button>
                <button data-testid="btnu-stop" onClick={sUser.stop}>
                    stop
                </button>
                <button data-testid="btnu-resume" onClick={sUser.resume}>
                    resume
                </button>
                <button data-testid="btnu-reset" onClick={sUser.reset}>
                    reset
                </button>
                <button data-testid="btnu-countEnableConditionRender" onClick={() => sUser.conditionRendering(v => v.info.age < 29)}>
                    Enable condition render
                </button>
                <button data-testid="btnu-countDisableConditionRender" onClick={() => sUser.conditionRendering(() => true)}>
                    Disable condition render
                </button>
                <button data-testid="btnu-countEnableConditionUpdate" onClick={() => sUser.conditionUpdating(pre => pre.info.age < 1)}>
                    Enable condition update
                </button>
                <button data-testid="btnu-countDisableConditionUpdate" onClick={() => sUser.conditionUpdating(() => true)}>
                    Disable condition update
                </button>
            </div>

            <p data-testid="pu-value">{sUser.value.info.age}</p>
            <p data-testid="pu-use">{user.info.age}</p>
            <sUser.Wrap>{n => <p data-testid="pu-wrap">{n.info.age}</p>}</sUser.Wrap>
            <sUser.HardWrap>{n => <p data-testid="pu-hardwrap">{n.info.age}</p>}</sUser.HardWrap>
            <p data-testid="puw-watch">{isWatchUser && 'OK'}</p>
        </>
    );
}
