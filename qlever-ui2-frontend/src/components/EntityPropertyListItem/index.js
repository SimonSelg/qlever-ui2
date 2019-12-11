import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'

import { SimpleListItem } from '@rmwc/list'

import styles from './styles.module.scss'

const EntityListItem = ({ focused, item, onClick }) => {
    const ref = React.createRef()

    // todo: test
    useEffect(() => {
        if (!focused) return
        const SCROLL_MARGIN = 15

        const rect = ref.current.getBoundingClientRect()
        if (
            rect.top >= SCROLL_MARGIN &&
            rect.bottom <= window.innerHeight - SCROLL_MARGIN
        )
            return

        // make sure element is visible
        window.scrollTo(
            0,
            rect.top > SCROLL_MARGIN
                ? window.scrollY + rect.top - SCROLL_MARGIN
                : window.scrollY +
                      rect.top -
                      window.innerHeight +
                      rect.height +
                      SCROLL_MARGIN
        )
    }, [focused, ref])

    return (
        <div ref={ref}>
            <SimpleListItem
                onClick={() => onClick(item.wdName)}
                text={item.name}
                secondaryText={item.description}
                className={focused && styles.keyboardSelected}
            />
        </div>
    )
}

EntityListItem.propTypes = {
    item: PropTypes.object.isRequired,
    focused: PropTypes.bool,
    onClick: PropTypes.func.isRequired
}

export default memo(EntityListItem)
