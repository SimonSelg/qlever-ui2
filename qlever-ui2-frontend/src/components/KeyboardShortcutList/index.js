import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.scss'

import { Typography } from '@rmwc/typography'
import { SimpleDataTable } from '@rmwc/data-table'

const Key = ({ children }) => <span className={styles.key}>{children}</span>
Key.propTypes = {
    children: PropTypes.node.isRequired
}

const KeyboardShortcutList = () => (
    <div className={styles.container}>
        <Typography use="subtitle2" tag="h4" className={styles.title}>
            QLever UI2 supports multiple keyboard shortcuts:
        </Typography>
        <SimpleDataTable
            className={styles.table}
            data={[
                [<Key key="1">Arrow Keys</Key>, 'navigation in lists'],
                [
                    <>
                        <Key>Ctrl</Key> + <Key>↵ Enter</Key>
                    </>,
                    'execute'
                ],
                [<Key key="2">Esc</Key>, 'hide query results']
            ]}
        />
    </div>
)

export default KeyboardShortcutList
