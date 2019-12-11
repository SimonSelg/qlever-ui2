import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import QueryVisualisation from '../QueryVisualisation'
import { draftActions, queryActions } from '../../redux/reducers'
import { useRoute } from 'wouter'

import { Typography } from '@rmwc/typography'
import { Card } from '@rmwc/card'

import styles from './styles.module.scss'
import NewExplorerHistoryButtons from '../NewExplorerHistoryButtons'
import NewExplorerAlternativeButtons from '../NewExplorerAlternativeButtons'

const NewExplorerLeftPanel = () => {
    const [isEdit] = useRoute('/sparql/edit')
    const dispatch = useDispatch()

    const actions = isEdit ? draftActions : queryActions

    const onRename = useCallback(
        (oldName, newName) => {
            dispatch(actions.renameVariable(oldName, newName))
        },
        [actions, dispatch]
    )

    const onSetState = useCallback(
        (variable, state, isLabelFor) => {
            dispatch(
                actions.setVariableSelectState(variable, state, isLabelFor)
            )
        },
        [actions, dispatch]
    )

    const query = useSelector(state => state.query.present.query)
    const draft = useSelector(state => state.draft.query)
    const queryToVisualize = isEdit ? draft : query
    return (
        <Card className={styles.panel}>
            <div className={styles.group}>
                <NewExplorerHistoryButtons />
                <div>
                    <NewExplorerAlternativeButtons />
                </div>
            </div>
            {queryToVisualize ? (
                queryToVisualize.where && queryToVisualize.where.length > 0 ? (
                    <QueryVisualisation
                        className={styles.visualization}
                        onRename={onRename}
                        onSetState={onSetState}
                        query={queryToVisualize}
                    />
                ) : (
                    <div className={styles.message}>
                        <Typography
                            className={styles.title}
                            use="headline5"
                            tag="h3"
                        >
                            Nothing to visualize
                        </Typography>
                        <Typography className={styles.subtitle} use="subtitle1">
                            The query is empty. Go ahead and extend it :)
                        </Typography>
                    </div>
                )
            ) : (
                <div className={styles.message}>
                    Invalid SPARQL query, unable to visualize.
                </div>
            )}
        </Card>
    )
}

export default NewExplorerLeftPanel
