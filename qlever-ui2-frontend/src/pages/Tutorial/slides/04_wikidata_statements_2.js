import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from '../styles.module.scss'
import wikidataImage1 from '../media/wikidata_statement_graph.png'

const WikidataStatements2Slide = () => (
    <>
        <Typography use="body1" tag="p">
            The statement value can be an an item identifier (
            <code className={styles.code}>Q...</code>)
        </Typography>

        <img
            alt="wikidata statement graph"
            src={wikidataImage1}
            style={{ maxWidth: '400px' }}
        />

        <Typography use="body1" tag="p">
            Therefore, items become connected through statements
        </Typography>
    </>
)

export default {
    slide: WikidataStatements2Slide,
    title: 'Wikidata Statements II'
}
