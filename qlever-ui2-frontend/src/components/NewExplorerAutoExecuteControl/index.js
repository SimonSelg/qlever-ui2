import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { Checkbox } from '@rmwc/checkbox'

import { setAutoExecute } from '../../redux/slices/configSlice'

const NewExplorerAutoExecuteControl = ({ disabled, label }) => {
    const dispatch = useDispatch()
    const autoExecute = useSelector(state => state.config.autoExecute)
    const onChange = value => dispatch(setAutoExecute(value))

    return (
        <Checkbox
            label={label}
            checked={autoExecute}
            onChange={e => onChange(e.currentTarget.checked)}
            disabled={disabled}
        />
    )
}

export default NewExplorerAutoExecuteControl

NewExplorerAutoExecuteControl.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired
}
