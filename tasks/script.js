const task = 'js';
const gulp = require( 'gulp' );
const browserSync = require( 'browser-sync' );
const { rollup } = require( 'rollup' );
const commonjs = require( 'rollup-plugin-commonjs' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const { uglify } = require( 'rollup-plugin-uglify' );
const babel = require( 'rollup-plugin-babel' );
const config = require('./config');

const params = {
  src: `${config.rootDir}/src/select-a11y.js`,
  name: 'Select',
  dest: `${config.rootDir}/dist/select-a11y.js`
}

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    presets: [
      [ '@babel/preset-env', {
        modules: false,
        targets: {
          browsers: config.browser,
        }
      }]
    ]
  }),
];

const rollupIn = {
  input: params.src,
  plugins
};

const rollupOut = {
  file: params.dest,
  format: 'iife',
  name: params.name,
};

gulp.task( 'script:dev', () => {
  const entry = { ...rollupIn };
  const out = { ...rollupOut };

  out.sourcemap = true

  return rollup( entry )
    .then( bundle => bundle.write( out ))
    .then(() => {
      browserSync.reload();
    });
});

gulp.task( 'script:build', () => {

  const script = rollup( rollupIn )
    .then( bundle => bundle.write( rollupOut ))
    .then(() => {
      browserSync.reload();
    });

  const entryMin = { ...rollupIn };
  const outMin = { ...rollupOut };

  entryMin.plugins.push(uglify());

  outMin.file = rollupOut.file.replace('.js', '.min.js');

  const minified = rollup( entryMin )
    .then( bundle => bundle.write( outMin ));

  return Promise.all([script, minified]);
});
