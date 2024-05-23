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
    input: 'src/package/index.tsx',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    globals: {
      react: 'React'
    },
    resolve: () => {},
    plugins: [
      alias({
        entries: [
          { find: 'react', replacement: path.resolve(__dirname, 'node_modules/react') },
          { find: 'react-dom', replacement: path.resolve(__dirname, 'node_modules/react-dom') }
        ]
      }),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'] // Các phần mở rộng mà Rollup sẽ xử lý
      }),
      commonjs({
        include: /node_modules/
      }),
      peerDepsExternal(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
      postcss()
    ],
    external: ['react', 'react-dom']
  },
  {
    input: 'src/package/index.tsx',
    output: [{ file: packageJson.types, format: 'cjs' }],
    plugins: [dts.default()],
    external: [/\.css$/]
  }
];
