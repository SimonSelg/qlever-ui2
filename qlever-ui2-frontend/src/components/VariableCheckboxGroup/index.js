import React, { memo } from 'react'
import PropTypes from 'prop-types'

import VariableCheckBoxWithEditIcon from '../VariableCheckBoxWithEditIcon'

import styles from '../VariableSelection/styles.module.scss'

const VariableCheckboxGroup = ({
    labelName,
    variable,
    selected,
    labelSelected,
    disabled,
    onRename,
    onSetState
}) => {
    const renderedLabelName = labelName || `${variable}Label`
    return (
        <div className={styles.variableGroup}>
            <VariableCheckBoxWithEditIcon
                labelName={variable}
                checked={selected}
                disabled={disabled}
                onRename={onRename}
                onSetState={onSetState}
            />
            <VariableCheckBoxWithEditIcon
                labelName={renderedLabelName}
                checked={labelSelected}
                isLabelFor={variable}
                disabled={disabled}
                onRename={onRename}
                onSetState={onSetState}
            />
        </div>
    )
}

VariableCheckboxGroup.propTypes = {
    disabled: PropTypes.bool,
    onRename: PropTypes.func.isRequired,
    onSetState: PropTypes.func.isRequired,
    labelName: PropTypes.string,
    variable: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    labelSelected: PropTypes.bool
}

export default memo(VariableCheckboxGroup)
