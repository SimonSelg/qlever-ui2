import React from 'react'
import PropTypes from 'prop-types'

import FullWidthGraphView from '../FullWidthGraph'
import { addLabelsToGraph, applyStyleToGraph, colorDiff } from './styleGraph'
import { convertSparqlJsToGraphlib } from './queryToGraph'

const SparqlGraphView = ({ query, diffTo, mappings, className }) => {
    console.log('SparqlGraphView render')

    // apply styles to graph
    const graph = convertSparqlJsToGraphlib(query)
    addLabelsToGraph(graph, mappings)
    applyStyleToGraph(graph)

    if (diffTo) {
        colorDiff(graph, diffTo)
    }

    return (
        <FullWidthGraphView
            graph={graph}
            isDiff={!!diffTo}
            className={className}
        />
    )
}

SparqlGraphView.propTypes = {
    query: PropTypes.object.isRequired,
    diffTo: PropTypes.object,
    mappings: PropTypes.object.isRequired,
    className: PropTypes.string
}

export default SparqlGraphView
