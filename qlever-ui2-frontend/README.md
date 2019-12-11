## QLever UI2 Frontend

The qlever-ui2-frontend.

## Architecture / Stack

- The frontend is implemented with [react.js](https://reactjs.org/). We use
  - [babel](https://babeljs.io/) for transpiling es6 to es5
  - [flow](https://flow.org/) for type annotation
  - [webpack](https://webpack.js.org/) for asset bundling
- [redux](https://redux.js.org/)  and [redux-toolkit](https://redux-starter-kit.js.org/) for data flow
- [wouter](https://github.com/molefrog/wouter) with [redux-first-history](https://github.com/salvoravida/redux-first-history) for routing
- [rmwc](https://rmwc.io/) material react component framework
- [sparql.js](https://github.com/RubenVerborgh/SPARQL.js) for parsing sparql queries
- [d3](https://github.com/d3/d3) and [dagre-d3](https://github.com/dagrejs/dagre-d3) for rendering and layouting graphs

### Data Flow
The central source of truth of the application is the sparql.js sparql query representation. It looks like [this](https://github.com/RubenVerborgh/SPARQL.js#representation).

From there, everything is derived. The graph, the sparql query that you see, the variable checkbox state.

Actions, like renaming a variable, change the sparql query representation. Since everything is generated from it, the graph, the sparql query and all other ui elements will be updated.

The application state (minus the query) is represented in the url and can therefore also be derived from it.

### Design
The User Interface uses Material Design. The implementation tries to follow the [material design guidelines](https://material.io/design/). The [color scheme](https://material.io/design/material-theming/overview.html) can be configured in `src/components/App/_theme.scss`.

Devices of all heights and widths are supported. It works best on desktop and tablet sized screens.

## Usage

- `yarn dev` - start dev server
- `yarn profile` to start a dev server which is good for profiling the application
- `yarn build` - build for production
- `yarn production` - serve production build while proxying /api/ to the backend
- `yarn lint` - lint source code
- `yarn lint:fix` - lint source code and fix all fixable errors


## Browser Support
qlever-ui2-frontend needs an uptodate browser to run. The transpilation targets can be adjusted in `.babelrc.js`.
