import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from '../styles.module.scss'
import wikidataStatement from '../media/wikidata_statement.png'

const WikidataStatements1Slide = () => (
    <>
        <Typography use="body1" tag="p">
            To describe a characteristic of an item, a{' '}
            <code className={styles.code}>statement</code> is made about it.
        </Typography>

        <img
            alt="wikidata statement"
            src={wikidataStatement}
            style={{ maxWidth: '500px' }}
        />

        <Typography use="body1" tag="p">
            A statement consists out of a{' '}
            <code className={styles.code}>property</code> and a
            <code className={styles.code}>value</code>.
            <br />
            Properties are uniquely identified by{' '}
            <code className={styles.code}>P</code> followed by a number (such as{' '}
            <code className={styles.code}>P69</code>)
        </Typography>
    </>
)

export default {
    slide: WikidataStatements1Slide,
    title: 'Wikidata Statements I'
}
