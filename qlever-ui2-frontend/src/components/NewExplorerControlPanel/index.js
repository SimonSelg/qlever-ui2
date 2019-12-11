import React from 'react'

import { useRoute } from 'wouter'

import { Card } from '@rmwc/card'

import NewExplorerControls from '../NewExplorerControls'
import styles from '../NewExplorerRightPanel/styles.module.scss'

const NewExplorerControlPanel = () => {
    const [isDraft] = useRoute('/sparql/edit')
    if (isDraft) return <></>
    return (
        <Card className={styles.actions}>
            <NewExplorerControls />
        </Card>
    )
}

export default NewExplorerControlPanel
