import { signify } from 'react-signify';

const a = signify(0, {
  syncKey: 'key',
  cache: {
    key: 'abc',
    type: 'SesionStorage'
  }
});

export default function App() {
  console.log(123);

  return (
    <div>
      <h1>{a.html}</h1>
      <a.Wrap>{data => <h1>{data}</h1>}</a.Wrap>
      <a.HardWrap>{data => <h1>{data}</h1>}</a.HardWrap>
      <button onClick={() => a.set(pre => pre + 1)}>UP</button>
    </div>
  );
}
