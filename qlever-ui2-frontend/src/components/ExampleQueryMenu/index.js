import PropTypes from 'prop-types'
import React from 'react'

import { Button } from '@rmwc/button'
import { MenuItem, SimpleMenu } from '@rmwc/menu'

import { EXAMPLE_QUERIES } from '../../example_queries'
import styles from './styles.module.scss'

const queries = [
    'empty query',
    'all actors',
    'actors nominated for oscar',
    'actors nominated for oscar + nominated work (qualifier)',
    'big actor query'
]

const ExampleMenu = ({ onSelect, className, disabled }) => {
    return (
        <SimpleMenu
            className={className}
            hoistToBody
            handle={
                <Button
                    trailingIcon="arrow_drop_down"
                    disabled={disabled}
                    className={styles.button}
                >
                    example queries
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

export default ExampleMenu

ExampleMenu.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func.isRequired
}
