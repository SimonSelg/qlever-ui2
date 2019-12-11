// this file spins up a server that serves the build app with the correct base path
// it also proxies /api/* requests to localhost:9090, where the backend service
// is expected to be running

const Koa = require('koa')
const proxy = require('koa-proxies')
const serve = require('koa-static')
const fs = require('fs')
const path = require('path')

const app = new Koa()

// base path support
const originalIndex = fs.readFileSync(
    path.resolve(__dirname, '../dist/index.html')
)

const renderBaseAdjustScript = path =>
    `<script>(function(){var p = '${path}', n = location.pathname, d = n.length - p.length;document.write('<base href="' + (d && n.substr(d, p.length) === p && n.substr(0, d) || '') + '/"></base>')})()</script>`

const renderIndex = path =>
    originalIndex
        .toString()
        .replace(/<base href=".+?" \/>/, renderBaseAdjustScript(path))

const sendIndex = async ctx => {
    ctx.body = renderIndex(ctx.request.path)
    ctx.type = 'html'
}

// serve index.html with correct base path
app.use(async (ctx, next) => {
    if (['/', '/index.html'].includes(ctx.request.url)) {
        return await sendIndex(ctx)
    }
    await next()
})

// proxy backend requests to the backend
app.use(
    proxy('/api/', {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\//, '')
    })
)

app.use(serve('dist'))

// serve app
// 404 is index.html (SAP: all every site is rendered by index.html)
app.use(sendIndex)

// serve other compiled files
app.listen(8080)
