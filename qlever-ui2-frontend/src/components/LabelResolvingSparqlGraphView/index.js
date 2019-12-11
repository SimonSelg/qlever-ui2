import React, { useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { getWikidataIdentifiersFromSparqlJS } from 'qlever-ui2-shared/src/sparqljs-helpers'

import SparqlGraphView from '../SparqlGraphView'
import { fetchMissingIdentifiers } from '../../redux/slices/identifierSlice'

function LabelResolvingSparqlGraphView({ query, diffTo, className }) {
    console.log('LabelResolvingGraphView: render')

    // fetch identifiers if necessarily
    const dispatch = useDispatch()
    useEffect(() => {
        const identifiers = getWikidataIdentifiersFromSparqlJS(query)
        dispatch(fetchMissingIdentifiers(identifiers))
    }, [dispatch, query])

    const mappings = useSelector(state => state.identifiers.identifiers)
    return (
        <SparqlGraphView
            query={query}
            diffTo={diffTo}
            className={className}
            mappings={mappings}
        />
    )
}

LabelResolvingSparqlGraphView.propTypes = {
    query: PropTypes.object.isRequired,
    diffTo: PropTypes.object,
    className: PropTypes.string
}

export default memo(LabelResolvingSparqlGraphView)
