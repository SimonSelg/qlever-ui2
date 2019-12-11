import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRoute } from 'wouter'

import { Card } from '@rmwc/card'
import { IconButton } from '@rmwc/icon-button'
import { SimpleDataTable } from '@rmwc/data-table'
import { Typography } from '@rmwc/typography'

import CenteredLoader from '../CenteredLoader'
import {
    executeQueryAction,
    resetQueryExecution
} from '../../redux/slices/queryExecutionSlice'
import styles from './styles.module.scss'

const RESULT_LIMIT = 100

const NewExplorerQueryExecutionPanel = () => {
    const dispatch = useDispatch()
    const hasSearchTerm = useSelector(
        state => state.wikidataSearch.searchTerm.length > 0
    )
    const error = useSelector(state => state.queryExecution.error)
    const result = useSelector(state => state.queryExecution.result)
    const amount = useSelector(state => state.queryExecution.amount)
    const loading = useSelector(state => state.queryExecution.loading)
    const query = useSelector(state => state.query.present.query)
    const autoExecute = useSelector(state => state.config.autoExecute)

    const [isEdit] = useRoute('/sparql/edit')

    const selectedVariableNames = query.variables.map(x => x.value)
    const onClear = () => dispatch(resetQueryExecution())

    useEffect(() => {
        if (!autoExecute) return
        if (!query || !query.variables.length) return
        if (loading || result /* || error */) return
        dispatch(executeQueryAction(RESULT_LIMIT))
    }, [query, autoExecute]) // eslint-disable-line react-hooks/exhaustive-deps

    return !isEdit && (result || loading || error) && !hasSearchTerm ? (
        <Card className={styles.panel}>
            <IconButton
                onClick={onClear}
                className={styles.clearButton}
                icon="clear"
            />
            <Typography use="headline6" tag="h2" className={styles.headline}>
                Query Execution
            </Typography>
            {loading ? (
                <CenteredLoader />
            ) : error ? (
                <>
                    <Typography
                        use="subtitle2"
                        tag="h4"
                        className={styles.errorTitle}
                    >
                        Error while executing query
                    </Typography>
                    <span className={styles.error}>
                        Error while executing query: {error}
                    </span>
                </>
            ) : (
                <>
                    <Typography className={styles.subtitle} use="subtitle1">
                        There are {amount} {amount > 1 ? 'results' : 'result'}
                        {amount > RESULT_LIMIT ? ', showing the first 100' : ''}
                    </Typography>
                    <SimpleDataTable
                        className={styles.table}
                        headers={[selectedVariableNames.map(x => `?${x}`)]}
                        data={result ? result.slice(0, 100) : []}
                    />
                </>
            )}
        </Card>
    ) : (
        <></>
    )
}

export default NewExplorerQueryExecutionPanel
