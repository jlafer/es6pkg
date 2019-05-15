# es6pkg

This is a sample/starter project for building a library package, including bundles in three formats: UMD, CJS and ES.

The build pipeline uses Rollup and Babel to bundle and transpile your JavaScript code for the required deployment scenarios: UMD for browser script tags; CommonJS (CJS) for NodeJS applications using `require` statements; and ES for applications using ES6 `import` statements.

Your package code can be developed using ES6 (ES2015) features of JavaScript, including `export` and `import` statements.

## Installation
```
git clone git@github.com:jlafer/es6pkg.git <pkgname>
cd <pkgname>
npm install
```

## Usage
The sample source files should be replaced by your project's source code. Code development can proceed using ES2015 features, as Babel is used in the build process to transpile all source files to ES5-compliant format.

If the package is imported using CommonJS `require` statements, all properties of the package will be imported. If imported using ES6 module `import` statements, then tree-shaking will be used and only the required properties of your package will be bundled into the consuming application.

## Testing
`Jest` is already included and can be invoked using `npm test`. The `babel-jest` package is installed along with a `babel.config.js` file, so Jest automatically transpiles ES6-style test files prior to execution.

