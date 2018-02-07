const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');

const input = {
  input: './AudioPipeline.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};

const output = {
  file: './dist/AudioPipeline.js',
  format: 'umd',
  name: 'AudioPipeline',
};

(async () => {
  const bundle = await rollup.rollup(input);
  await bundle.generate(output);
  await bundle.write(output);
})();
