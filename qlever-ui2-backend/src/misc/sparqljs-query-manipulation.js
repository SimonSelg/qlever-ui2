import { getTriples } from 'qlever-ui2-shared/src/sparqljs-helpers'

export function addClausesToWhere(query, clauses) {
    query.where.push.apply(query.where, clauses)
}

export function addTriplesToWhere(query, triples) {
    const queryTriples = getTriples(query, true)
    queryTriples.push.apply(queryTriples, triples)
}

export function addVariablesToQuery(query, variables) {
    query.variables.push.apply(query.variables, variables)
}
