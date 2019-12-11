import React from 'react'

import { useDispatch } from 'react-redux'
import { useRoute } from 'wouter'
import { push } from '../../index'
import { TabBar, Tab } from '@rmwc/tabs'

import ConnectedSyntaxHighlightingSparqlEditor from '../ConnectedSyntaxHighlightingSparqlEditor'
import NewExplorerSearch from '../NewExplorerSearch'

import styles from './styles.module.scss'
import NewExplorerExtend from '../NewExplorerExtend'
import { Card } from '@rmwc/card'
import NewExplorerControlPanel from '../NewExplorerControlPanel'

function NewExplorerRightPanel() {
    const [isSparql] = useRoute('/sparql/:edit?')

    const activeTabIndex = isSparql ? 1 : 0

    const dispatch = useDispatch()

    const onActivate = event => {
        if (activeTabIndex === event.detail.index) return
        const target = event.detail.index ? '/sparql' : '/'
        dispatch(push(target))
    }

    const onSearchClick = subject => {
        dispatch(push(`/extend/${subject}`))
    }

    return (
        <div className={styles.outerContainer}>
            <Card className={styles.container}>
                <TabBar activeTabIndex={activeTabIndex} onActivate={onActivate}>
                    <Tab>Extend</Tab>
                    <Tab>SPARQL</Tab>
                </TabBar>
                {activeTabIndex ? (
                    <ConnectedSyntaxHighlightingSparqlEditor
                        className={styles.editor}
                    />
                ) : (
                    <>
                        <NewExplorerSearch onClick={onSearchClick} />
                        <NewExplorerExtend />
                    </>
                )}
            </Card>
            <NewExplorerControlPanel />
        </div>
    )
}

export default NewExplorerRightPanel
