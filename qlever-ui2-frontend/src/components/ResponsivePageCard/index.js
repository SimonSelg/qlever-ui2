import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import styles from './styles.module.scss'

function ResponsivePageCard({ children, className }) {
    return (
        <div className={classNames(styles.responsivePageCard, className)}>
            {children}
        </div>
    )
}

ResponsivePageCard.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

export default ResponsivePageCard
