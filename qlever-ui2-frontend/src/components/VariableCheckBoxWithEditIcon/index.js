import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { Checkbox } from '@rmwc/checkbox'
import { IconButton } from '@rmwc/icon-button'

import { queue, snackbarQueue } from '../../misc/queue'
import styles from '../VariableSelection/styles.module.scss'

async function editPressed(name, isLabel, onRename) {
    const res = await queue.prompt({
        title: `rename ${isLabel ? 'label ' : ''}variable`,
        body: `enter new name for the ${
            isLabel ? 'label' : 'variable'
        } '${name}'`,
        acceptLabel: 'Rename',
        inputProps: {
            outlined: true,
            placeholder: name,
            label: 'new name'
        }
    })
    if (!res) return

    if (!/^\??[\w-]+$/.test(res)) {
        console.warn('invalid variable name')
        snackbarQueue.notify({
            title: <b>Warning</b>,
            body: 'You have entered an invalid variable name!',
            icon: 'warning',
            timeout: 2000
        })
        return
    }

    const finalName = res.replace(/\?/gm, '')
    onRename(name, finalName)
}

const VariableCheckBoxWithEditIcon = ({
    labelName,
    checked,
    isLabelFor,
    disabled,
    onRename,
    onSetState
}) => (
    <div className={styles.variableEditGroup}>
        <Checkbox
            className={styles.checkBox}
            label={'?' + labelName}
            checked={checked}
            onChange={e =>
                onSetState(labelName, e.currentTarget.checked, isLabelFor)
            }
            disabled={disabled}
        />
        <IconButton
            disabled={disabled || (isLabelFor && !checked)}
            icon="edit"
            label="Rate this!"
            className={styles.editIcon}
            onClick={() => editPressed(labelName, !!isLabelFor, onRename)}
        />
    </div>
)

VariableCheckBoxWithEditIcon.propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    isLabelFor: PropTypes.string,
    labelName: PropTypes.string.isRequired,
    onRename: PropTypes.func.isRequired,
    onSetState: PropTypes.func.isRequired
}

export default memo(VariableCheckBoxWithEditIcon)
