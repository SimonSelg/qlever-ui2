import { Graph } from 'graphlib'

import {
    applyPrefixes,
    computeNodeType,
    getTriples,
    getWikipediaIdentifier
} from 'qlever-ui2-shared/src/sparqljs-helpers'

const DISPLAY_LABELS = true

// convert a sparqljs data structure into a graphlib graph
export const convertSparqlJsToGraphlib = query => {
    const graph = new Graph({ directed: true, multigraph: true })
    graph.setGraph({})
    graph.setDefaultEdgeLabel(() => {})

    const triples = getTriples(query)
    if (!triples) return graph

    for (const triple of triples) {
        if (
            !DISPLAY_LABELS &&
            triple.predicate.value ===
                'http://www.w3.org/2000/01/rdf-schema#label'
        )
            continue

        // get details
        const uriDetails = getUriDetails(triple.predicate, query.prefixes)
        const objectIsStatement = uriDetails.type === 'wikidata-property'
        const subjectIsStatement = [
            'wikidata-property-qualifier',
            'wikidata-property-statement'
        ].includes(uriDetails.type)

        // add to graph
        setNode(query.prefixes, triple.subject, graph, subjectIsStatement)
        setNode(query.prefixes, triple.object, graph, objectIsStatement)
        graph.setEdge(
            triple.subject.value,
            triple.object.value,
            uriDetails,
            triple.predicate.value
        )
    }

    return graph
}

function getUriDetails(node, prefixes, isStatement = false) {
    const type = computeNodeType(node)
    const value = node.value

    const label =
        type === 'variable' ? `?${value}` : applyPrefixes(prefixes, value)
    const wikipediaIdentifier = getWikipediaIdentifier(type, label)

    const data: any = { type, label, valueWithPrefixes: label }
    if (wikipediaIdentifier) {
        data.wikipediaIdentifier = wikipediaIdentifier.identifier
        data.wikipediaPrefix = wikipediaIdentifier.prefix
    }

    if (isStatement) data.isStatement = true

    return data
}

function setNode(prefixes, node, graph: Graph, isStatement = false) {
    const uriDetails = getUriDetails(node, prefixes, isStatement)
    graph.setNode(node.value, uriDetails)
}
