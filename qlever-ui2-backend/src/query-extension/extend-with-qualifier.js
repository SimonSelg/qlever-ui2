import { DataFactory } from 'n3'

import computePossibleQualifierExtensions from './qualifier-extensions'
import { generateSpaqrl } from 'qlever-ui2-shared/src/sparqljs'
import { generateTriple } from 'qlever-ui2-shared/src/sparqljs-constructors'
import { getTriples, addLabelForVariable } from 'qlever-ui2-shared/src/sparqljs-helpers'

// given a statement and a qualifier, add that qualifier to said statement
function generateSpaqrlFromQualifierAndStatement(query, statement, qualifier) {
    query.prefixes['pq'] = 'http://www.wikidata.org/prop/qualifier/'

    const triples = getTriples(query)
    const variable = DataFactory.variable(`${statement}_${qualifier}`)
    const newTriple = generateTriple(
        DataFactory.variable(statement),
        DataFactory.namedNode(`http://www.wikidata.org/prop/qualifier/${qualifier}`),
        variable
    )
    addLabelForVariable(query, variable.value)
    triples.push(newTriple)

    return generateSpaqrl(query)
}

// given the list of possible qualifiers extensions, compute the possible extensions for a specific qualifier
function generateQueriesFromSuggestionResults(results, qualifier) {
    const qualifierURIWithBrackets = `<http://www.wikidata.org/prop/qualifier/${qualifier}>`

    const extensions = []

    for (const [[expanded, statement], suggestions] of results) {
        const match = suggestions.find(([identifier]) => identifier === qualifierURIWithBrackets)
        if (!match) continue

        const query = generateSpaqrlFromQualifierAndStatement(expanded, statement, qualifier)
        extensions.push([query, match[1]])
    }

    return extensions.sort((a, b) => b[1] - a[1])
}

// compute possible query extensions for a given qualifier
export default async function computeQualifierExtensions(query, qualifier) {
    console.time('computeQualifierExtensions')

    const results = await computePossibleQualifierExtensions(query)
    const res = generateQueriesFromSuggestionResults(results, qualifier)
    console.timeEnd('computeQualifierExtensions')

    return res
}
