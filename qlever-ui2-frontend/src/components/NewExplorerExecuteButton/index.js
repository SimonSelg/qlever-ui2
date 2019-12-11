import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@rmwc/button'

import { executeQueryAction } from '../../redux/slices/queryExecutionSlice'

const NewExplorerExecuteButton = ({ children }) => {
    const dispatch = useDispatch()
    const variableSelected = useSelector(
        state =>
            state.query.present.query &&
            state.query.present.query.variables.length > 0
    )

    const onExecuteClick = () => {
        dispatch(executeQueryAction())
    }

    return (
        <Button
            icon="play_arrow"
            onClick={onExecuteClick}
            disabled={!variableSelected}
        >
            {children}
        </Button>
    )
}

export default NewExplorerExecuteButton

NewExplorerExecuteButton.propTypes = {
    children: PropTypes.node.isRequired
}
