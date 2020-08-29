import React from 'react'

import { Typography } from '@rmwc/typography'

import styles from './styles.module.scss'

const Footer = () => (
    <footer className={styles.footer}>
        <Typography use="headline6">Bachelor Project of Simon Selg</Typography>
        <Typography use="subtitle1">
            <a
                href="https://github.com/SimonSelg/qlever-ui2/"
                target="_blank"
                rel="noopener noreferrer"
            >
                QLever UI2 on GitHub
            </a>{' '}
            | Powered by{' '}
            <a
                href="https://github.com/ad-freiburg/QLever"
                target="_blank"
                rel="noopener noreferrer"
            >
                QLever
            </a>
        </Typography>
    </footer>
)

export default Footer
