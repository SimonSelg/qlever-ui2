import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from '../styles.module.scss'
import wikidataQualifier1 from '../media/wikidata_qualifier_1.png'
import wikidataQualifier2 from '../media/wikidata_qualifier_2.png'

const WikidataQualifiersSlide = () => (
    <>
        <Typography use="body1" tag="p">
            Sometimes characteristics of{' '}
            <code className={styles.code}>statements</code> (rather then of
            <code className={styles.code}>items</code>) need to be described.
        </Typography>

        <img
            alt="wikidata qualifier demo"
            src={wikidataQualifier1}
            style={{ maxWidth: '200px' }}
        />

        <Typography use="body1" tag="p">
            Suppose we want to store the{' '}
            <code className={styles.code}>start time</code> of this particular
            education.
            <br />
            This Information is not a statement about{' '}
            <code className={styles.code}>Douglas Adams</code>, neither about{' '}
            <code className={styles.code}>St John's College</code>.
        </Typography>

        <img
            alt="wikidata qualifier demo with qualifier"
            src={wikidataQualifier2}
            style={{ maxWidth: '250px' }}
        />

        <Typography use="body1" tag="p">
            It is <code className={styles.code}>statement</code> about the
            statement
            <code className={styles.code}>
                ('Douglas Adams' 'educated at' 'St John's College')
            </code>{' '}
            itself.
        </Typography>
    </>
)

export default {
    slide: WikidataQualifiersSlide,
    title: 'Wikidata Qualifiers'
}
