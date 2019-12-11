import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@rmwc/typography'

import { parseSparql } from 'qlever-ui2-shared/src/sparqljs'

import SyntaxHighlightingSparqlEditor from '../../../components/SyntaxHighlightingSparqlEditor'
import SparqlAsGraphVisualizer from '../../../components/LabelResolvingSparqlGraphView'

import styles from '../styles.module.scss'

const RenderGraph = ({ query }) =>
    query ? (
        <SparqlAsGraphVisualizer query={query} className={styles.graph} />
    ) : (
        <span>Syntax Error in SPARQL Query, unable to visualize</span>
    )

RenderGraph.propTypes = {
    query: PropTypes.object
}

const QueryVisualisationSlide = ({ defaultQuery }) => {
    const [sparql, setSparql] = useState(defaultQuery)
    const query = parseSparql(sparql)

    const onChange = sparql => setSparql(sparql)

    return (
        <>
            <Typography use="body1" tag="p">
                Instead, let's look at a graphical representation of the same
                query
            </Typography>

            <div className={styles.two}>
                <div className={styles.graphCard}>
                    <RenderGraph query={query} />
                </div>
                <SyntaxHighlightingSparqlEditor
                    editing={true}
                    sparql={sparql}
                    className={styles.sparql}
                    onChange={onChange}
                />
            </div>

            <Typography use="body1" tag="p">
                Wikidata <code className={styles.code}>items</code> and{' '}
                <code className={styles.code}>query variables</code> have become
                nodes, <code className={styles.code}>properties</code> have
                become edges.
                <br /> <br />
                Easier to read, isn't it? Try changing{' '}
                <code className={styles.code}>Q60</code> to{' '}
                <code className={styles.code}>Q61</code> in the SPARQL query.
            </Typography>
        </>
    )
}

QueryVisualisationSlide.propTypes = {
    defaultQuery: PropTypes.string.isRequired
}

export default {
    slide: QueryVisualisationSlide,
    title: 'Query-Visualisation'
}
