import React from 'react'

import { Typography } from '@rmwc/typography'

import LinkButton from '../../components/LinkButton'
import ResponsivePageCard from '../../components/ResponsivePageCard'

import styles from './styles.module.scss'

function NotFound() {
    return (
        <ResponsivePageCard className={styles.container}>
            <Typography use="headline5" tag="h1" className={styles.title}>
                404 Site not found
            </Typography>

            <div className={styles.action}>
                <LinkButton raised to="/">
                    To main
                </LinkButton>
            </div>
        </ResponsivePageCard>
    )
}

export default NotFound
