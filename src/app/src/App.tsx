import { useEffect, useState } from 'react';
import { signify } from 'react-signify';

export const sCount = signify(0, { syncKey: 'count' });

export const sUser = signify({
    name: 'Viet',
    info: {
        age: 27,
        address: 'USA'
    }
});

export const sLs = signify([{ count: 0 }]);

const ssAge = sUser.slice(n => n.info.age);
const ssInfo = sUser.slice(n => n.info);

export default function App() {
    const count = sCount.use();
    const age = ssAge.use();
    const ageSlicePick = ssInfo.use(n => n.age);
    const user = sUser.use();
    const agePick = sUser.use(n => n.info.age);
    const ls = sLs.use();
    const arrayPick = sLs.use(n => n[0].count);
    const [isWatch, setIsWatch] = useState(false);
    const [isWatchSlice, setIsWatchSlice] = useState(false);
    const [isWatchUser, setIsWatchUser] = useState(false);
    const [isWatchLs, setIsWatchLs] = useState(false);

    useEffect(() => {
        const { unsubscribe } = sCount.subscribe(v => {
            console.log('sCount', v);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    sCount.watch(v => {
        setIsWatch(true);
    });

    ssAge.watch(v => {
        setIsWatchSlice(true);
    });

    sUser.watch(v => {
        setIsWatchUser(true);
    });

    sLs.watch(v => {
        setIsWatchLs(true);
    });

    return (
        <>
            <h1>Normal Case</h1>
            <div>
                <button
                    data-testid="btn-set"
                    onClick={() => {
                        sCount.set(pre => {
                            pre.value += 1;
                        });
                    }}
                >
                    set
                </button>
                <button data-testid="btn-stop" onClick={sCount.stop}>
                    stop
                </button>
                <button data-testid="btn-resume" onClick={sCount.resume}>
                    resume
                </button>
                <button
                    data-testid="btn-reset"
                    onClick={() => {
                        sCount.reset();
                    }}
                >
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
                <button data-testid="btn-setAge" onClick={() => sUser.set(pre => (pre.value.info.age += 1))}>
                    Set Age
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
            <p data-testid="ps-usePick">{ageSlicePick}</p>
            <ssAge.Wrap>{n => <p data-testid="ps-wrap">{n}</p>}</ssAge.Wrap>
            <ssAge.HardWrap>{n => <p data-testid="ps-hardwrap">{n}</p>}</ssAge.HardWrap>
            <p data-testid="psw-watch">{isWatchSlice && 'OK'}</p>
            <hr />
            <h1>Object Case</h1>
            <div>
                <button data-testid="btnu-set" onClick={() => sUser.set(pre => (pre.value.info.age += 1))}>
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

            <p data-testid="pu-valuePick">{agePick}</p>
            <p data-testid="pu-value">{sUser.value.info.age}</p>
            <p data-testid="pu-use">{user.info.age}</p>
            <sUser.Wrap>{n => <p data-testid="pu-wrap">{n.info.age}</p>}</sUser.Wrap>
            <sUser.HardWrap>{n => <p data-testid="pu-hardwrap">{n.info.age}</p>}</sUser.HardWrap>
            <p data-testid="puw-watch">{isWatchUser && 'OK'}</p>

            <hr />
            <h1>Array Case</h1>
            <div>
                <button data-testid="btnArr-set" onClick={() => sLs.set(pre => (pre.value[0].count += 1))}>
                    set
                </button>
                <button data-testid="btnArr-stop" onClick={sLs.stop}>
                    stop
                </button>
                <button data-testid="btnArr-resume" onClick={sLs.resume}>
                    resume
                </button>
                <button data-testid="btnArr-reset" onClick={sLs.reset}>
                    reset
                </button>
                <button data-testid="btnArr-countEnableConditionRender" onClick={() => sLs.conditionRendering(v => v[0].count < 1)}>
                    Enable condition render
                </button>
                <button data-testid="btnArr-countDisableConditionRender" onClick={() => sLs.conditionRendering(() => true)}>
                    Disable condition render
                </button>
                <button data-testid="btnArr-countEnableConditionUpdate" onClick={() => sLs.conditionUpdating(pre => pre[0].count < 1)}>
                    Enable condition update
                </button>
                <button data-testid="btnArr-countDisableConditionUpdate" onClick={() => sLs.conditionUpdating(() => true)}>
                    Disable condition update
                </button>
            </div>

            <p data-testid="parr-valuePick">{arrayPick}</p>
            <p data-testid="parr-value">{sLs.value[0].count}</p>
            <p data-testid="parr-use">{ls[0].count}</p>
            <sLs.Wrap>{n => <p data-testid="parr-wrap">{n[0].count}</p>}</sLs.Wrap>
            <sLs.HardWrap>{n => <p data-testid="parr-hardwrap">{n[0].count}</p>}</sLs.HardWrap>
            <p data-testid="parrw-watch">{isWatchLs && 'OK'}</p>
        </>
    );
}
