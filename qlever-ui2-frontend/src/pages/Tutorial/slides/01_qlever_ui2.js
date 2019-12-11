import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from '../styles.module.scss'

const QLeverUi2Slide = () => (
    <>
        <div>
            <Typography use="headline4" tag="p" style={{ marginBottom: '0' }}>
                Welcome to QLever UI2
            </Typography>
            <Typography
                use="headline6"
                tag="p"
                style={{ marginBottom: '0', marginTop: '0.5rem' }}
            >
                the <code className={styles.code}>Wikidata</code> exploration
                tool
            </Typography>
        </div>

        <blockquote className={styles.quote}>
            <Typography use="body1" tag="p">
                Wikidata is a free and open knowledge base that <br /> can be
                read and edited by both humans and machines.
            </Typography>
        </blockquote>

        <Typography use="body1" tag="p">
            QLever UI2 lets you perform on{' '}
            <code className={styles.code}>Wikidata</code> queries in an
            intuitive, visual way.
            <br />
            <br />
            This tutorial shows you the basics, so you can start exploring as
            fast as possible.
        </Typography>
    </>
)

export default {
    slide: QLeverUi2Slide,
    next: 'Start Tutorial'
}
