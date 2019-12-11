import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { Button } from '@rmwc/button'
import { MenuItem, SimpleMenu } from '@rmwc/menu'

import { EXAMPLE_QUERIES } from '../../example_queries'
import styles from './styles.module.scss'
import { queryActions } from '../../redux/reducers'

const queries = [
    'empty query',
    'all actors',
    'actors nominated for oscar',
    'actors nominated for oscar + nominated work (qualifier)',
    'big actor query'
]

const NewExplorerExampleMenu = ({ className, disabled, children }) => {
    const dispatch = useDispatch()
    const onSelect = query => {
        dispatch(queryActions.updateFromSparql(query))
    }
    return (
        <SimpleMenu
            className={className}
            hoistToBody
            handle={
                <Button
                    icon="arrow_drop_down"
                    disabled={disabled}
                    className={styles.button}
                >
                    {children}
                </Button>
            }
        >
            {queries.map((query, i) => (
                <MenuItem key={i} onClick={() => onSelect(EXAMPLE_QUERIES[i])}>
                    {query}
                </MenuItem>
            ))}
        </SimpleMenu>
    )
}

export default NewExplorerExampleMenu

NewExplorerExampleMenu.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool
}
