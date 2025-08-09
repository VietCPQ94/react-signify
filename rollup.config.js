import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import path from 'path';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/package/index.ts',
        output: [
            {
                dir: 'dist/cjs',
                format: 'cjs',
                sourcemap: true,
                entryFileNames: 'index.js'
            },
            {
                dir: 'dist',
                format: 'esm',
                sourcemap: true,
                entryFileNames: 'index.js'
            }
        ],
        plugins: [
            alias({
                entries: [
                    { find: 'react', replacement: path.resolve(__dirname, 'node_modules/react') },
                    { find: 'react-dom', replacement: path.resolve(__dirname, 'node_modules/react-dom') }
                ]
            }),
            resolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }),
            commonjs({
                include: /node_modules/
            }),
            peerDepsExternal(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser({
                output: {
                    comments: false
                },
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.info', 'console.debug', 'console.warn'],
                    passes: 3,
                    dead_code: true,
                    keep_fargs: false,
                    keep_fnames: false
                }
            }),
            postcss()
        ],
        external: ['react', 'react-dom']
    },
    {
        input: 'src/package/index.ts',
        output: [
            {
                dir: 'dist',
                format: 'cjs',
                entryFileNames: 'index.d.ts'
            }
        ],
        plugins: [dts.default()],
        external: [/\.css$/]
    }
];
