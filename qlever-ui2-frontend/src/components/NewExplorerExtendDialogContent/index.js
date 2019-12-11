import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import CenteredLoader from '../CenteredLoader'

import styles from './styles.module.scss'

const NewExplorerExtendDialogContent = ({ noResults, subject }) => {
    const [takesLong, setTakesLong] = useState(null)

    useEffect(() => {
        if (noResults) return
        const timeout = setTimeout(setTakesLong.bind(null, subject), 5000)
        return clearTimeout.bind(null, timeout)
    }, [subject, setTakesLong, noResults])

    if (noResults) return 'Please try a different entity or predicate'

    const subjectTakesLong = takesLong === subject
    return (
        <>
            <CenteredLoader className={styles.loader} />
            {subjectTakesLong && (
                <p>
                    Computing the extensions for subject {subject} is taking
                    some time. Some queries are too complex for the current
                    system to extend. If the extension takes too long, please
                    try another subject.
                </p>
            )}
        </>
    )
}

export default NewExplorerExtendDialogContent

NewExplorerExtendDialogContent.propTypes = {
    noResults: PropTypes.bool,
    subject: PropTypes.string.isRequired
}
