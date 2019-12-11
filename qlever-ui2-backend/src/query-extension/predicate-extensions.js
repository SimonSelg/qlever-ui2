import { cloneQuery, generateSpaqrl } from 'qlever-ui2-shared/src/sparqljs'
import { computeQueryResponse } from '../misc/qlever'
import { generateReverseableTriple } from 'qlever-ui2-shared/src/sparqljs-constructors'
import {
    getTriples,
    getVariablesFromSparqlJS,
    removeLabelsFromQuery
} from 'qlever-ui2-shared/src/sparqljs-helpers'

// NODE: this is still using the sparql.js 2.x syntax, so this will need porting before it works.
// only kept here in case someone wants to extend the code. basically, what changed in the new sparqljs version is that
// variables, nodes and edges are now represented as objects (n3.DataFactory.variable etc).

// generate query that computes which predicates can be added and how many results you would get for each predicate
function generatePredicatesSuggestionQueries(query, targets) {
    const queries = targets.map(target => {
        const suggestionQuery = cloneQuery(query)
        removeLabelsFromQuery(suggestionQuery)
        const triples = getTriples(suggestionQuery)

        // const newTriple = generateTriple(target, 'ql:has-predicate', '?predicate')
        const newTriple = generateReverseableTriple(target, '?predicate', '?foo', true)
        triples.push(newTriple)

        // add select
        suggestionQuery.variables = [
            '?predicate',
            {
                expression: {
                    expression: '?predicate',
                    type: 'aggregate',
                    aggregation: 'count',
                    distinct: false
                },
                variable: `?count`
            }
        ]

        // add group by clause
        suggestionQuery.group = [{ expression: '?predicate' }]
        suggestionQuery.order = [{ expression: '?count', descending: true }]

        return suggestionQuery
    })

    return queries.map(x => generateSpaqrl(x).replace('<ql:has-predicate>', 'ql:has-predicate'))
}

// compute which predicates can be added where to the query to still get results
export default async function computePredicateExtensions(query) {
    // determine targets
    const targets = getVariablesFromSparqlJS(query, true)
    const suggestionQueryStrings = generatePredicatesSuggestionQueries(query, targets)

    // execute queries
    const results = await Promise.all(suggestionQueryStrings.map(computeQueryResponse))

    return results.map(x =>
        x.res.filter(x => x[0].startsWith('<http://www.wikidata.org/prop/direct/P'))
    )
}
