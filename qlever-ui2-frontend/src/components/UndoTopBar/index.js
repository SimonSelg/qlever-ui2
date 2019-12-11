import React from 'react'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'

import { Button } from '@rmwc/button'

import styles from './styles.module.scss'

function UndoTopBar({ disabled }) {
    const dispatch = useDispatch()
    const onUndo = () => dispatch(ActionCreators.undo())
    const onRedo = () => dispatch(ActionCreators.redo())

    const future = useSelector(state => state.query.future)
    const past = useSelector(state => state.query.past)

    return (
        <div className={styles.container}>
            <Button
                icon="undo"
                disabled={disabled || !past.length}
                onClick={onUndo}
            >
                Undo
            </Button>
            <Button
                trailingIcon="redo"
                disabled={disabled || !future.length}
                onClick={onRedo}
            >
                Redo
            </Button>
        </div>
    )
}

UndoTopBar.propTypes = {
    disabled: PropTypes.bool
}

export default UndoTopBar
