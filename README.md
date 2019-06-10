# es6pkg

This is a sample/starter project for building a library package, including bundles in three formats: UMD, CJS and ES.

The build pipeline uses Babel and Rollup to transpile and bundle your JavaScript code for the required deployment scenarios: UMD for browser script tags; CommonJS (CJS) for NodeJS applications using `require` statements; and ES for applications using ES6 `import` statements.

Your package code can be developed using ES6 (ES2015) features of JavaScript, including `export` and `import` statements.

## Installation
```
git clone git@github.com:jlafer/es6pkg.git <pkgname>
cd <pkgname>
npm install
```

## Usage
The sample source files can be removed from the `/src` sub-folder, where you can place your project's source code. Code development can proceed using ES2015 features, as Babel is used in the build process to transpile all source files to ES5-compliant format.

If the package is imported using CommonJS `require` statements, all properties of the package will be imported. If imported using ES6 module `import` statements, then tree-shaking will be performed and only the required properties of your package will be bundled into the consuming application.

Use `npm run build` to build and bundle the package files in the `/dist` sub-folder.

## Testing
As this package is designed for building library packages, the suggested (i.e., TDD) development pattern would involve putting functions and their test cases in the package and testing locally. `Jest` is already included and can be invoked using `npm test`. The `babel-jest` package is installed along with a `babel.config.js` file, so Jest automatically transpiles ES6-style test files prior to execution. See `src/index.test.js` for a sample test case file.

## Local Usage
During active development you can also use the `npm run dev` command to run Rollup in "watch" mode - the executable packages are updated as changes are saved to the source files. So, for instance, if you put calling code in `index.js` you could run it in NodeJS using the command `node dist/bundle.cjs.js`.
