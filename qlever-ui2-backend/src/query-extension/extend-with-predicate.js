// extend query with predicate

import type { SparqlJsResult } from 'qlever-ui2-shared/src/sparqljs'
import {
    getTriples,
    getVariablesFromSparqlJS,
    removeLabelsFromQuery,
    addLabelForVariable
} from 'qlever-ui2-shared/src/sparqljs-helpers'
import { cloneQuery, generateSpaqrl } from 'qlever-ui2-shared/src/sparqljs'
import { computeQueryResponse } from '../misc/qlever'
import {
    generateReverseableTriple,
    wrapTriplesInOptional
} from 'qlever-ui2-shared/src/sparqljs-constructors'
import { DataFactory } from 'n3'

// try adding a predicate from both directions (towards and from node)
const doReversePredicateLookupToo = true

// generate query that computes the data used for generating the extensions
function generateOptionalPredicateTriple(
    start: string,
    end: string,
    predicate: string,
    reverse: boolean = false
) {
    const random = `sr_statement_${start}_${predicate}_${reverse ? 'in' : 'out'}`

    const statement_url = `http://www.wikidata.org/prop/statement/${predicate}`
    const property_url = `http://www.wikidata.org/prop/${predicate}`

    const start_ = DataFactory.variable(start)
    const end_ = DataFactory.variable(random)

    return wrapTriplesInOptional([
        generateReverseableTriple(
            start_,
            DataFactory.namedNode(reverse ? statement_url : property_url),
            end_,
            reverse
        ),
        generateReverseableTriple(
            end_,
            DataFactory.namedNode(reverse ? property_url : statement_url),
            DataFactory.variable(end),
            reverse
        )
    ])
}

// modify query to include optional triples that 'test' how the result amount changes if a new predicate is added to a
// variable. test that for every variable
function addOptionalTriplesToQuery(
    query: SparqlJsResult,
    variables: Array<string>,
    relation: string
) {
    query.variables = []
    for (let i = 0; i < variables.length; i++) {
        const variable = variables[i]

        const optional1 = generateOptionalPredicateTriple(
            variable,
            `suggestion_node${i}a`,
            relation,
            false
        )
        query.where.push(optional1)
        query.variables.push(DataFactory.variable(`suggestion_node${i}a`))

        if (doReversePredicateLookupToo) {
            const optional2 = generateOptionalPredicateTriple(
                variable,
                `suggestion_node${i}b`,
                relation,
                true
            )
            query.where.push(optional2)
            query.variables.push(DataFactory.variable(`suggestion_node${i}b`))
        }
    }
}

// generate query that computes the data used for generating the extensions
function generatePredicateSuggestionQuery(query: SparqlJsResult, relation: string) {
    const clonedQuery = cloneQuery(query)
    removeLabelsFromQuery(clonedQuery)

    // now add the optional clauses for all variables
    const variables = getVariablesFromSparqlJS(clonedQuery)
    addOptionalTriplesToQuery(clonedQuery, variables, relation)

    // add missing prefixes
    clonedQuery.prefixes['p'] = 'http://www.wikidata.org/prop/'
    clonedQuery.prefixes['ps'] = 'http://www.wikidata.org/prop/statement/'

    const correspondingVariables = doReversePredicateLookupToo
        ? variables.map(x => [x, `${x}_reverse`]).reduce((acc, val) => acc.concat(val), []) // ;flat()
        : variables
    return [generateSpaqrl(clonedQuery), correspondingVariables]
}

// compute the amount of results for every predicate-variable combination
function computeResultCountPerVariable(
    queryResult: Array<Array<string>>,
    correspondingVariables: Array<string>
) {
    const count = correspondingVariables.map(x => [x, 0])
    for (const row of queryResult) {
        for (let i = 0; i < correspondingVariables.length; i++) {
            if (row[i] === null) continue
            count[i][1] += 1
        }
    }
    return count
}

// given the amount of results for each possible variable-predicate combination, generate the query extensions
function computeExtensionsFromObjectCount(query: SparqlJsResult, counts, predicate: string) {
    // generate sparql extensions
    const res = []
    const tripleObject = DataFactory.variable(`variable_${predicate}`)
    const triplePredicate = DataFactory.namedNode(
        `http://www.wikidata.org/prop/direct/${predicate}`
    )

    for (const [variable, occurrences] of counts) {
        if (occurrences === 0) continue
        const clonedQuery = JSON.parse(JSON.stringify(query))
        const triples = getTriples(clonedQuery)
        if (!triples) {
            throw 'no triples'
        }

        if (variable.endsWith('_reverse')) {
            triples.push({
                subject: tripleObject,
                predicate: triplePredicate,
                object: DataFactory.variable(variable.replace('_reverse', ''))
            })
        } else {
            triples.push({
                subject: DataFactory.variable(variable),
                predicate: triplePredicate,
                object: tripleObject
            })
        }

        addLabelForVariable(clonedQuery, tripleObject.value)
        res.push([generateSpaqrl(clonedQuery), occurrences])
    }

    return res
}

// compute possible query extensions for a given predicate
export default async function computeVariableToAddPredicateTo(query: SparqlJsResult, predicate) {
    if (!query.where || query.where.length === 0) return []

    console.time('computeVariableToAddPredicateTo')
    const [queryString, correspondingVariables] = generatePredicateSuggestionQuery(query, predicate)

    const { res: queryResult } = await computeQueryResponse(queryString)

    const counts = computeResultCountPerVariable(queryResult, correspondingVariables)
    const countsSorted = counts.sort((a, b) => b[1] - a[1])

    const res = computeExtensionsFromObjectCount(query, countsSorted, predicate)
    console.timeEnd('computeVariableToAddPredicateTo')
    return res
}
