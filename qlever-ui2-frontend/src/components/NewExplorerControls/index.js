import PropTypes from 'prop-types'
import React from 'react'

import classNames from 'classnames'

import NewExplorerExampleMenu from '../NewExplorerExampleQueryMenu'
import NewExplorerAutoExecuteControl from '../NewExplorerAutoExecuteControl'
import NewExplorerExecuteButton from '../NewExplorerExecuteButton'

import styles from './styles.module.scss'

const NewExplorerControls = ({ className }) => (
    <div className={classNames(styles.container, className)}>
        <div className={styles.group}>
            <NewExplorerExecuteButton>Execute Query</NewExplorerExecuteButton>
            <NewExplorerAutoExecuteControl label="auto execute query" />
            <NewExplorerExampleMenu>Load example query</NewExplorerExampleMenu>
        </div>
    </div>
)

export default NewExplorerControls

NewExplorerControls.propTypes = {
    className: PropTypes.string
}
