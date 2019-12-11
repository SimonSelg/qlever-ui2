// extend query with entity

import type { SparqlJsResult } from 'qlever-ui2-shared/src/sparqljs'
import { cloneQuery, generateSpaqrl } from 'qlever-ui2-shared/src/sparqljs'
import {
    getTriples,
    getVariablesFromSparqlJS,
    removeLabelsFromQuery
} from 'qlever-ui2-shared/src/sparqljs-helpers'
import { computeQueryResponse } from '../misc/qlever'
import {
    generateReverseableTriple,
    generateTriple,
    wrapTripleInOptional
} from 'qlever-ui2-shared/src/sparqljs-constructors'
import {
    addClausesToWhere,
    addTriplesToWhere,
    addVariablesToQuery
} from '../misc/sparqljs-query-manipulation'

import { DataFactory } from 'n3'

// generate a triple with a specific format
const predicateSearchTriple = (query, subject, object, reverse = false) => {
    return generateReverseableTriple(
        DataFactory.variable(subject),
        DataFactory.variable(`rs_${reverse ? 'in' : 'out'}_${subject}`),
        DataFactory.namedNode(object),
        reverse
    )
}

// modify query to include optional triples that for variable compute which predicates can be used to reach the entity
// from there
function addPredicateSearchTriplesAndVariables(
    query: SparqlJsResult,
    targetVariables: Array<string>,
    entityURI: string,
    reverse = false
) {
    // generate triples
    const triples = targetVariables.map(variable =>
        predicateSearchTriple(query, variable, entityURI, reverse)
    )
    //const triples_outgoing = targetVariables.map(variable => predicateSearchTriple(query, variable, entityURI, true))
    //const triples = [...triples_ingoing, ...triples_outgoing]

    if (triples.length > 1) {
        // wrap in optional clauses if there are more then one
        const wrappedTriples = triples.map(wrapTripleInOptional)
        addClausesToWhere(query, wrappedTriples)
    } else {
        addTriplesToWhere(query, triples)
    }

    const variables = triples.map(x => x['predicate'])
    addVariablesToQuery(query, variables)
}

function addGroupByAllVariables(query: SparqlJsResult) {
    query.group = query.variables.map(variable => ({ expression: variable }))
}

function addCountsForEveryVariable(query: SparqlJsResult) {
    const counts = query.variables.map((variable, i) => ({
        expression: {
            expression: variable,
            type: 'aggregate',
            aggregation: 'count',
            distinct: false
        },
        variable: DataFactory.variable(`count${i + 1}`)
    }))
    query.variables = query.variables.concat(counts)
}

// generate query that computes the data used for generating the extensions
function generateEntitySuggestionQuery(
    clonedQuery: SparqlJsResult,
    targetVariables: Array<string>,
    entityURI: string,
    reverse = false
) {
    // remove the selection
    clonedQuery.variables = []

    addPredicateSearchTriplesAndVariables(clonedQuery, targetVariables, entityURI, reverse)
    addGroupByAllVariables(clonedQuery)
    addCountsForEveryVariable(clonedQuery)

    return clonedQuery
}

// compute the predicates that can be used to reach the entity and the result count if that predicate is used
function computePredicateCountPerTargetVariable(
    queryResult: Array<Array<string>>,
    targetVariables,
    reverse = false
) {
    // for each target variable, keep track of the count of each predicate
    const predicateCountsForVariable = Array.from(Array(targetVariables.length * 2), () => ({}))

    // a row has the structure [predicate-1, predicate-2, ..., predicate-n, count-1, count-2, ..., count-n]
    for (const row of queryResult) {
        const predicateCount = row.length / 2
        for (let i = 0; i < predicateCount; i++) {
            const predicate = row[i]

            // make sure this is a predicate
            if (!predicate) continue
            if (!predicate.startsWith('<http://www.wikidata.org/prop/direct/')) continue

            // get count of that predicate
            const count = parseInt(row[i + predicateCount])
            const cleanRelation = predicate.replace('<', '').replace('>', '')

            // increase count of this predicate
            const relationCountMap = predicateCountsForVariable[i]
            const oldCount = relationCountMap[cleanRelation] || 0
            relationCountMap[cleanRelation] = oldCount + count
        }
    }

    // convert into list of (target_index, predicate, count)
    const res = []
    predicateCountsForVariable.forEach((counts, i) => {
        for (const [predicate, count] of Object.entries(counts)) {
            res.push([reverse ? i + targetVariables.length : i, predicate, count])
        }
    })

    // remove empty & sort
    return res.filter(x => x[2])
}

// given the amount of results for each possible predicate, compute the ranked query extensions
function computeExtensionsFromPredicateCount(query, counts, targetVariables, subject) {
    return counts.map(([target_index, predicate, count]) => {
        const extension = cloneQuery(query)
        let triples = getTriples(extension, true)

        const target = DataFactory.variable(targetVariables[target_index % targetVariables.length])
        const reverse = target_index >= targetVariables.length

        const subject_ = DataFactory.namedNode(subject)

        const triple = generateTriple(
            reverse ? subject_ : target,
            DataFactory.namedNode(predicate),
            reverse ? target : subject_
        )

        triples.push(triple)

        extension.prefixes['wd'] = 'http://www.wikidata.org/entity/'
        extension.prefixes['wdt'] = 'http://www.wikidata.org/prop/direct/'

        return [generateSpaqrl(extension), count]
    })
}

// compute possible query extensions for a given entity
export default async function computeExtensionsForEntity(query: SparqlJsResult, entityURI: string) {
    // prepare new query
    const suggestionQuery = cloneQuery(query)
    removeLabelsFromQuery(suggestionQuery)
    const targetVariables = getVariablesFromSparqlJS(suggestionQuery)
    if (targetVariables.length === 0) targetVariables.push('variable')

    // INFO: the fact that we need two queries is a workaround around a qlever bug. see bugs/qlever.md

    // query 1 (outbound search)
    generateEntitySuggestionQuery(suggestionQuery, targetVariables, entityURI, false)
    const suggestionQueryString = generateSpaqrl(suggestionQuery)

    // query 2 (inbound search)
    const suggestionQuery2 = cloneQuery(query)
    removeLabelsFromQuery(suggestionQuery2)
    generateEntitySuggestionQuery(suggestionQuery2, targetVariables, entityURI, true)
    const suggestionQueryString2 = generateSpaqrl(suggestionQuery2)

    // execute queries
    const { res: queryResult } = await computeQueryResponse(suggestionQueryString)
    const { res: queryResult2 } = await computeQueryResponse(suggestionQueryString2)

    // transform result into extension suggestions
    const counts1 = computePredicateCountPerTargetVariable(queryResult, targetVariables, false)
    const counts2 = computePredicateCountPerTargetVariable(queryResult2, targetVariables, true)
    const counts = [...counts1, ...counts2]
    const sortedCounts = counts.sort((a, b) => b[2] - a[2])

    return computeExtensionsFromPredicateCount(query, sortedCounts, targetVariables, entityURI)
}
