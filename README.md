usando
https://www.npmjs.com/package/linklocal

    "build:umd": "BABEL_ENV=commonjs NODE_ENV=development webpack src/index.js dist/mobxTinyRouter.js",
    "build:umd:min": "BABEL_ENV=commonjs NODE_ENV=production webpack src/index.js dist/mobxTinyRouter.min.js",