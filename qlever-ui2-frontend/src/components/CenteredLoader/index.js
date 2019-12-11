import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import styles from './styles.module.scss'
import Loader from '../Loader'

function CenteredLoader({ className }) {
    return (
        <div className={classNames(styles.spinner, className)}>
            <Loader />
        </div>
    )
}

export default CenteredLoader

CenteredLoader.propTypes = {
    className: PropTypes.string
}
