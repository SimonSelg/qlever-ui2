# QLever UI2 Backend

This is the backend service for QLever-UI2. 
It provides a set of REST APIs that are consumed by the frontend. These include:
  - wikidata identifier resolving and search
  - Wikidata query extension suggestion
  - sparql query execution.

## Architecture / Stack
- The backend is written in node.js, with
  - [flow](https://flow.org/) for type annotation
  - [babel](https://babeljs.io/) for transpiling the source for older node versions
- We use [koajs](https://koajs.com/) as web server. 
- sparql queries are parsed using [SPARQL.JS](https://github.com/RubenVerborgh/SPARQL.js)
- The backend consumes two external services:
  - [Wikidata Frontend](https://github.com/joka921/WikidataFrontend)
  - [QLever API](https://github.com/ad-freiburg/QLever)

## REST APIs
The rest APIs are documented in `qlever-ui2-documentation/_pages/backend/`

## Usage
-   `yarn dev` - start in development mode
-   `yarn build` - transpile the code for your current node version. keep in mind, in order to run it for production `qlever-ui2-shared` needs to be build too.
-   `yarn production` - starts the backend in production mode.
-   `yarn test` - runs the tests
- `yarn lint` - lint source code
- `yarn lint:fix` - lint source code and fix all fixable errors

## Configuration
Configuration is done using environment variables

| environment variable   | default value                                              |
| --------------------- |:------------------------------------------------------:|
| WIKIDATA_FRONTEND_API  | http://alicudi.informatik.privat:7001                      |
| QLEVER_API             | http://qlever.informatik.uni-freiburg.de/api/wikidata-full |

There is also the `.babelrc.js`, where one can configure the target node version (default: the one running the build)



