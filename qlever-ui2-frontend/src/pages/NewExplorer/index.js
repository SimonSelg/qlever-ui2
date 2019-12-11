import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import NewExplorerRightPanel from '../../components/NewExplorerRightPanel'
import NewExplorerLeftPanel from '../../components/NewExplorerLeftPanel'
import NewExplorerQueryExecutionPanel from '../../components/NewExplorerQueryExecutionPanel'
import { onCtrlEnterKeyPress, onEscKeyPress } from '../../redux/reducers'

import styles from './styles.module.scss'

function NewExplorerPage() {
    console.log('render')
    const dispatch = useDispatch()

    useEffect(() => {
        const handleUserKeyPress = event => {
            const { key, ctrlKey } = event
            if (ctrlKey && key === 'Enter') {
                dispatch(onCtrlEnterKeyPress())
            } else if (key === 'Escape') {
                dispatch(onEscKeyPress())
            }
        }

        window.addEventListener('keydown', handleUserKeyPress)
        return () => {
            window.removeEventListener('keydown', handleUserKeyPress)
        }
    }, [dispatch])

    return (
        <div>
            <div className={styles.queryPanelContainer}>
                <NewExplorerLeftPanel />
                <NewExplorerRightPanel />
            </div>

            <NewExplorerQueryExecutionPanel />
        </div>
    )
}

export default memo(NewExplorerPage)

NewExplorerPage.propTypes = {
    edit: PropTypes.bool
}
