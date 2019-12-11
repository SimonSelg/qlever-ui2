import React from 'react'
import PropTypes from 'prop-types'

import GridLoader from 'react-spinners/GridLoader'

const wrapWithClassName = (component, className) =>
    className ? <div className={className}>{component}</div> : component

const Loader = ({ className }) =>
    wrapWithClassName(
        <GridLoader color={'#123abc'} loading={true} className={className} />,
        className
    )

export default Loader

Loader.propTypes = {
    className: PropTypes.string
}
