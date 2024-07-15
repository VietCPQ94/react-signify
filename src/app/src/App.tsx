import { signify } from 'react-signify';

const a = signify(
  { a: 1, b: 2 },
  {
    syncKey: 'key',
    cache: {
      key: 'abc'
    }
  }
);
const b = a.slice(v => v.b);

export default function App() {
  return (
    <div>
      <a.Wrap>
        {data => {
          console.log('A');

          return <h1>{data.a}</h1>;
        }}
      </a.Wrap>
      <b.Wrap>
        {data => {
          console.log('B');

          return <h1>{data}</h1>;
        }}
      </b.Wrap>
      <a.HardWrap>{data => <h1>{data.a}</h1>}</a.HardWrap>
      <button
        onClick={() =>
          a.set(pre => ({
            ...pre,
            a: pre.a + 1
          }))
        }
      >
        UP A
      </button>
      <button
        onClick={() =>
          a.set(pre => ({
            ...pre,
            b: pre.b + 1
          }))
        }
      >
        UP B
      </button>
      <button onClick={() => a.stop()}>STOP</button>
      <button
        onClick={() => {
          a.resume();
        }}
      >
        RESUME
      </button>
    </div>
  );
}
