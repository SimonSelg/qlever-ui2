import { DataFactory } from 'n3'

import {
    getStatementVariables,
    getTriples,
    getVariablesFromSparqlJS,
    removeLabelsFromQuery,
    replaceTripleWithStatementNode
} from 'qlever-ui2-shared/src/sparqljs-helpers'
import { cloneQuery, generateSpaqrl } from 'qlever-ui2-shared/src/sparqljs'
import { computeQueryResponse } from '../misc/qlever'
import { generateTriple } from 'qlever-ui2-shared/src/sparqljs-constructors'

// generate query that computes which qualifier can be added and how many results you would get for each predicate
const generateQualifierSuggestionQueries = (query, targets) => {
    // take every wdt:Pxxx edge, and turn it into a node
    // then try to fit the pq: on that node

    // alternative: for every wdt: edge
    //   - turn into statement node
    //   - compute matching pq nodes that follow there

    // here we will explore the alternative approach
    // this means we will generate multiple sparql queries to execute

    // step 01: take  edge, turn it into a statement
    // - <object> <wdt:xxx> <subject> turns into <object> <p:xxx> ?statement; ?statement <ps:xxx> <subject>

    // compute statement name
    const variables = getVariablesFromSparqlJS(query)
    const statementVariables = variables.filter(x => x.match(/^expanded_statement_\d+$/))

    console.log(statementVariables)
    const numbers = statementVariables
        .map(x => /\d+$/.exec(x))
        .map(x => (x.length ? parseInt(x[0]) : 0))
    const maxNumber = Math.max(numbers) || 0

    const queries = targets.map(target => {
        const suggestionQuery = cloneQuery(query)
        suggestionQuery.prefixes['p'] = 'http://www.wikidata.org/prop/'
        suggestionQuery.prefixes['ps'] = 'http://www.wikidata.org/prop/statement/'

        const targetIsStatement = typeof target === 'string'
        const triples = getTriples(suggestionQuery)
        const statementVariable = targetIsStatement ? target : `expanded_statement_${maxNumber + 1}`
        if (!targetIsStatement) {
            // expand triple to statement
            const index = triples.findIndex(e => JSON.stringify(e) === JSON.stringify(target))
            replaceTripleWithStatementNode(index, triples, statementVariable)
        }
        const expandedQuery = cloneQuery(suggestionQuery)

        // suggestion query generation
        removeLabelsFromQuery(suggestionQuery)
        const newTriple = generateTriple(
            DataFactory.variable(statementVariable),
            DataFactory.namedNode('ql:has-predicate'),
            DataFactory.variable('predicate')
        )
        triples.push(newTriple)

        // add select
        suggestionQuery.variables = [
            DataFactory.variable('predicate'),
            {
                expression: {
                    expression: DataFactory.variable('predicate'),
                    type: 'aggregate',
                    aggregation: 'count',
                    distinct: false
                },
                variable: DataFactory.variable(`count`)
            }
        ]

        // add group by clause
        suggestionQuery.group = [{ expression: DataFactory.variable('predicate') }]
        suggestionQuery.order = [{ expression: DataFactory.variable('count'), descending: true }]

        return [suggestionQuery, [expandedQuery, statementVariable]]
    })

    return queries.map(([query, expanded]) => [
        generateSpaqrl(query).replace('<ql:has-predicate>', 'ql:has-predicate'),
        expanded
    ])
}

// compute which predicates can be added where to the query to still get results
export default async function computeQualifierExtensions(query) {
    if (!query.where || query.where.length === 0) return []

    // determine targets
    const triples = getTriples(query)
    const targetTriples = triples.filter(e =>
        e.predicate.value.startsWith('http://www.wikidata.org/prop/direct/')
    )
    const statements = getStatementVariables(query)

    // queries
    const queriesWithExpanded = generateQualifierSuggestionQueries(query, [
        ...targetTriples,
        ...statements
    ])

    const results = await Promise.all(
        queriesWithExpanded.map(([query]) => computeQueryResponse(query))
    )

    // interpret results
    const options = results.map(x =>
        x.res
            .filter(x => x[0].startsWith('<http://www.wikidata.org/prop/qualifier/P'))
            .map(x => [x[0], parseInt(x[1])])
    )
    return options.map((x, i) => [queriesWithExpanded[i][1], x])
}
