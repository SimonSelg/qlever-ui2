import React from 'react'
import PropTypes from 'prop-types'

import LabelResolvingSparqlGraphView from '../LabelResolvingSparqlGraphView'
import VariableSelection from '../VariableSelection'

import styles from './styles.module.scss'

function QueryVisualisation({
    query,
    disabled,
    onRename,
    onSetState,
    className
}) {
    return (
        <div className={className}>
            <div className={styles.graphFlexContainer}>
                <LabelResolvingSparqlGraphView query={query} />
            </div>

            <div className={styles.labels}>
                <VariableSelection
                    query={query}
                    disabled={disabled}
                    onSetState={onSetState}
                    onRename={onRename}
                />
            </div>
        </div>
    )
}

QueryVisualisation.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onRename: PropTypes.func.isRequired,
    onSetState: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
}

export default QueryVisualisation
