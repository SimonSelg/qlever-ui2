import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@rmwc/typography'

import SyntaxHighlightingSparqlEditor from '../../../components/SyntaxHighlightingSparqlEditor'

import styles from '../styles.module.scss'

const SparqlWikidataSlide = ({ defaultQuery }) => {
    return (
        <>
            <Typography use="body1" tag="p">
                Now that we have an understanding of how data is represented
                inside wikidata, we want to query this data.
                <br /> <br />
                Suppose you want to know{' '}
                <code className={styles.code}>
                    Which actor was nominated for an academy award for best
                    actor and lives in New York City?
                </code>
                .
                <br /> <br />
                The <code className={styles.code}>
                    SPARQL Query Language
                </code>{' '}
                can be used to express this query:
            </Typography>

            <SyntaxHighlightingSparqlEditor
                editing={false}
                sparql={defaultQuery}
                className={styles.sparql}
                onChange={() => false}
            />

            <Typography use="body1" tag="p">
                This is hard to read and write, unless you know SPARQL and also
                know the Wikidata Identifiers (
                <code className={styles.code}>Q..</code>,{' '}
                <code className={styles.code}>P..</code>) from memory.
            </Typography>
        </>
    )
}

SparqlWikidataSlide.propTypes = {
    defaultQuery: PropTypes.string.isRequired
}

export default {
    slide: SparqlWikidataSlide,
    title: 'SPARQL Queries on Wikidata'
}
