import PropTypes from 'prop-types'
import React, { memo } from 'react'

import { useDispatch } from 'react-redux'
import { push } from '../../index'
import { applyDraft } from '../../redux/reducers'

import { Button } from '@rmwc/button'

import styles from './styles.module.scss'

const EditBar = ({ disabled }) => {
    const dispatch = useDispatch()

    const onSave = () => {
        dispatch(applyDraft())
        dispatch(push('/sparql'))
    }

    const onCancel = () => {
        dispatch(push('/sparql'))
    }

    return (
        <div className={styles.editBar}>
            <Button disabled={disabled} onClick={onSave}>
                Save
            </Button>
            <Button onClick={onCancel}>Discard</Button>
        </div>
    )
}

export default memo(EditBar)

EditBar.propTypes = {
    disabled: PropTypes.bool
}
