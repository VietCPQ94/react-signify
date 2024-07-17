import { signify } from 'react-signify';

const sData = signify({
    count: 1,
    age: 0
});
const sCountSlice = sData.slice(n => n.count);
const sAgeSlice = sData.slice(n => n.age);

export default function App() {
    sAgeSlice.watch(n => {
        console.log(n);
    });
    return (
        <div>
            {/* <sData.Wrap>
        {
          v => {
            console.log("Count change");

            return <h1>{v.count}</h1>
          }
        }
      </sData.Wrap>
      <sData.Wrap>
        {
          v => {
            console.log("Age change");

            return <h1>{v.age}</h1>
          }
        }
      </sData.Wrap> */}
            <button onClick={() => sData.set(n => ({ ...n, count: n.count + 1 }))}>Update Count</button>
            <button
                onClick={() =>
                    sData.set(n => ({
                        ...n,
                        age: n.age + 1
                    }))
                }
            >
                Update Age
            </button>
            <br />
            <h1>{sCountSlice.html}</h1>
            <h1>{sAgeSlice.html}</h1>
            <sCountSlice.Wrap>
                {v => {
                    console.log('sCountSlice');
                    return <h1>{v}</h1>;
                }}
            </sCountSlice.Wrap>
            <sAgeSlice.Wrap>
                {v => {
                    console.log('sAgeSlice');
                    return <h1>{v}</h1>;
                }}
            </sAgeSlice.Wrap>
        </div>
    );
}
