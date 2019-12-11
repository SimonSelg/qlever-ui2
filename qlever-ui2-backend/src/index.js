import { parseSparql } from 'qlever-ui2-shared/src/sparqljs'
import { generateEntityURI } from 'qlever-ui2-shared/src/sparqljs-constructors'

// web server
import Koa from 'koa'
import fetch from 'node-fetch'
import Router from 'koa-router'
import koaJson from 'koa-json'

// business logic
import computeSuggestionsForEntity from './query-extension/extend-with-entity'
import computeSuggestionsForPredicate from './query-extension/extend-with-predicate'
import computeExtensionsForQualifier from './query-extension/qualifier-extensions'
import computePredicateExtensions from './query-extension/predicate-extensions'
import computeQualifierExtensions from './query-extension/extend-with-qualifier'
import base64UrlDecode from './misc/base64url'

const app = new Koa()

const router = new Router()

const suggestionAPI = process.env.WIKIDATA_FRONTEND_API || 'http://alicudi.informatik.privat:7001'
const qleverAPI =
    process.env.QLEVER_API || 'http://qlever.informatik.uni-freiburg.de/api/wikidata-full'

console.log('using wikidata frontend api ' + suggestionAPI)
console.log('using qlever api ' + qleverAPI)

// fetch Wikidata identifier search result from WikidataFrontend
// either obj or prd can be the term type
const fetchSearchTermResultForType = async (searchTerm, type) => {
    const fetchUrl = `${suggestionAPI}/?t=${type}?q=${searchTerm}`
    const response = await fetch(fetchUrl)
    const res = await response.json()
    return res.entities
}

// wikidata identifier prefix search
router.get('/search/:searchTerm?', async ctx => {
    const searchTerm = ctx.params.searchTerm
    const res =
        searchTerm && searchTerm !== ''
            ? await Promise.all(
                  ['obj', 'prd'].map(x => fetchSearchTermResultForType(searchTerm, x))
              )
            : [[], []]

    ctx.body = {
        object: res[0],
        predicate: res[1]
    }
})

// helper function to get the parsed sparql query from the request or return an error message
function getSparqlJsQuery(ctx) {
    const query = base64UrlDecode(decodeURIComponent(ctx.params.query))
    const sparqljsQuery = parseSparql(query)
    if (!sparqljsQuery) {
        ctx.body = {
            error: 'not a valid sparql query'
        }
        return false
    }
    return sparqljsQuery
}

// resolve wikidata identifiers
router.get('/identifiers/:identifiers', async ctx => {
    const identifiers = decodeURIComponent(ctx.params.identifiers).split(',')
    const response = await fetch(
        `${suggestionAPI}?c=${encodeURIComponent(identifiers.map(x => `<${x}>`).join(' '))}`
    )
    ctx.body = await response.json()
})

// execute sparql query
router.get('/qlever/:query/:limit?', async ctx => {
    const query = base64UrlDecode(decodeURIComponent(ctx.params.query))
    const limit = ctx.params.limit || 100
    const response = await fetch(
        `${qleverAPI}?query=${encodeURIComponent(query)}&cmd=clearcache&send=${limit}`
    )
    ctx.body = await response.json()
})

// get possible qualifier extensions for a given query
router.get('/query/:query/options/qualifiers', async ctx => {
    const sparqljsQuery = getSparqlJsQuery(ctx)
    if (!sparqljsQuery) return

    ctx.body = await computeExtensionsForQualifier(sparqljsQuery)
})

// get possible predicate extensions for a given query
router.get('/query/:query/options/predicates', async ctx => {
    const sparqljsQuery = getSparqlJsQuery(ctx)
    if (!sparqljsQuery) return

    ctx.body = await computePredicateExtensions(sparqljsQuery)
})

// get possible query query extensions (which are new queries) for a given query and an extension subject
// the extension subject can either be an entity or a predicate.
// - for an entity, we try to add it to a variable with a matching predicate
// - for an predicate, we try to add it to a variable either as predicate or as qualifier (this might introduce statement nodes)
router.get('/query/:query/extend/:subject', async ctx => {
    const subject = ctx.params.subject

    const sparqljsQuery = getSparqlJsQuery(ctx)
    if (!sparqljsQuery) return

    try {
        if (subject.startsWith('Q')) {
            // return entity suggestion
            // modify for suggestion
            const entityURI = generateEntityURI(subject)
            ctx.body = {
                extensions: await computeSuggestionsForEntity(sparqljsQuery, entityURI) // ).map((x, i) => [x, 1000 - i])
            }
        } else if (subject.startsWith('P')) {
            const [extensions, qualifierExtensions] = await Promise.all([
                computeSuggestionsForPredicate(sparqljsQuery, subject),
                computeQualifierExtensions(sparqljsQuery, subject)
            ])

            const suggestions = extensions.concat(qualifierExtensions).sort((a, b) => b[1] - a[1])

            ctx.body = {
                extensions: suggestions
            }
        }
    } catch (e) {
        console.warn(e)
        ctx.body = {
            error: 'exception in computing the suggestions',
            exception: JSON.stringify(e)
        }
    }
})

app.use(koaJson())
app.use(router.routes()).use(router.allowedMethods())

app.listen(9090)
