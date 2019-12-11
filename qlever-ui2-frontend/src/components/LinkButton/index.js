import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'wouter'

import { Button } from '@rmwc/button'

const MemorizedButton = memo(Button)

const LinkButton = ({ to, ...rest }) => (
    <Link href={to}>
        <MemorizedButton tag="a" {...rest} />
    </Link>
)

LinkButton.propTypes = {
    to: PropTypes.string.isRequired
}

export default LinkButton
