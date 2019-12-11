import React from 'react'
import PropTypes from 'prop-types'

import { List } from '@rmwc/list'
import { Typography } from '@rmwc/typography'

import EntityPropertyListItem from '../EntityPropertyListItem'
import styles from './styles.module.scss'

function EntityPropertyList({ items, title, selectIndex, onClick }) {
    return (
        <div className={styles.list}>
            <Typography use="body2" tag="h3" className={styles.title}>
                {title}
            </Typography>

            {items && (
                <div>
                    <List twoLine>
                        {items.map((item, i) => (
                            <EntityPropertyListItem
                                key={`item_${i}`}
                                onClick={onClick}
                                item={item}
                                focused={i === selectIndex - 1}
                            />
                        ))}
                    </List>
                </div>
            )}
        </div>
    )
}

EntityPropertyList.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    selectIndex: PropTypes.number.isRequired
}

export default EntityPropertyList
