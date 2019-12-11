import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from '../styles.module.scss'
import wikidataItem from '../media/wikidata_item_1.png'

const WikidataItemsSlide = () => (
    <>
        <Typography use="body1" tag="p">
            Wikidata mainly consists out of{' '}
            <code className={styles.code}>Items</code>.
        </Typography>

        <img
            alt="wikidata item"
            src={wikidataItem}
            style={{ maxWidth: '600px' }}
        />

        <Typography use="body1" tag="p">
            Items are uniquely identified by{' '}
            <code className={styles.code}>Q</code> followed by a number (such as{' '}
            <code className={styles.code}>Q42</code>)
            <br />
            Each item has <code className={styles.code}>label</code> and a
            <code className={styles.code}>description</code> and may have
            multiple
            <code className={styles.code}>aliases</code>.
        </Typography>
    </>
)

export default {
    slide: WikidataItemsSlide,
    title: 'Wikidata Items'
}
