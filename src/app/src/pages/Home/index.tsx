import { signify } from 'react-signify';

export const sNumber = signify(0);
export const sString = signify('AAA');
export const sObj = signify({
    name: {
        first: 'B',
        last: 'C'
    }
});
export const sArr = signify<[number, string, { name: string }, string[]]>([10, 'D', { name: 'E' }, ['F']]);
export const ssNumber = sArr.slice(v => v[0]);
export const ssString = sArr.slice(v => v[1]);
export const ssObj = sArr.slice(v => v[2]);
export const ssArr = sArr.slice(v => v[3]);

export default function Home() {
    return (
        <>
            <div>
                <h1>Show HTML</h1>
                <p>{sNumber.html}</p>
                <p>{sString.html}</p>
                <p>{ssNumber.html}</p>
                <p>{sString.html}</p>
            </div>
        </>
    );
}
