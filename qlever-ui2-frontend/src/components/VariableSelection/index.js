import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@rmwc/typography'

import { getVariablesWithSelectStateAndLabels } from 'qlever-ui2-shared/src/sparqljs-helpers'
import VariableCheckboxGroup from '../VariableCheckboxGroup'

import styles from './styles.module.scss'

function VariableSelection({ query, disabled, onRename, onSetState }) {
    console.log('render Variable Selection')

    const variables = query ? getVariablesWithSelectStateAndLabels(query) : []

    return (
        <>
            <Typography use="subtitle1" className={styles.title}>
                Output variables
            </Typography>
            <div className={styles.labelCheckboxes}>
                {variables.map(
                    ({ variable, labelName, selected, labelSelected }, i) => {
                        return (
                            <VariableCheckboxGroup
                                variable={variable}
                                labelName={labelName}
                                selected={selected}
                                labelSelected={labelSelected}
                                key={i}
                                onRename={onRename}
                                onSetState={onSetState}
                                disabled={disabled}
                            />
                        )
                    }
                )}
            </div>
        </>
    )
}

VariableSelection.propTypes = {
    disabled: PropTypes.bool,
    onRename: PropTypes.func.isRequired,
    onSetState: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
}

export default VariableSelection
