# QLever UI2 Shared

This package contains code that is shared between qlever-ui2-frontend and qlever-ui2-backend. This is mostly sparql.js related code.

## Usage
Just import the files. There is a build script which strips away the flowtypes and transpiles the code to be suited for your current node version.

There are the following scripts:
-   `yarn build` - transpile the code for your current node version.
-   `yarn lint` - lint source code
-   `yarn lint:fix` - lint source code and fix all fixable errors
-   `yarn test` - runs the tests
