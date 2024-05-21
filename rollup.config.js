import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [peerDepsExternal(), resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser(), postcss()],
    external: ['react', 'react-dom']
  },
  {
    input: 'src/index.tsx',
    output: [{ file: packageJson.types, format: 'cjs' }],
    plugins: [dts.default()],
    external: [/\.css$/]
  }
];
