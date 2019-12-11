// register babel runtime transpile hook
require('@babel/register')({
    extends: './.babelrc',
    ignore: [/node_modules/]
})

// require actual app
require('./src/index')
