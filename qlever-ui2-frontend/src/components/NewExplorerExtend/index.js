import React, { useEffect } from 'react'

import { goBack } from 'redux-first-history'
import { useDispatch, useSelector } from 'react-redux'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog'

import { useRoute } from 'wouter'
import { fetchAndApplyExtensions } from '../../redux/reducers'
import NewExplorerExtendDialogContent from '../NewExplorerExtendDialogContent'

const NewExplorerExtend = () => {
    const [isExtend, params] = useRoute('/extend/:subject')
    const subjectsWithoutExtensions = useSelector(
        state => state.query.present.noExtensions
    )
    const currentSubjectHasNoResults =
        isExtend &&
        subjectsWithoutExtensions &&
        subjectsWithoutExtensions[params.subject]

    const dispatch = useDispatch()

    const onClose = event => {
        const action = event.detail.action
        if (action !== 'cancel' && action !== 'close') return
        onCancel()
    }

    const onCancel = () => {
        dispatch(goBack())
    }

    useEffect(() => {
        if (!isExtend || currentSubjectHasNoResults) return
        dispatch(fetchAndApplyExtensions(params.subject))
    }, [params, currentSubjectHasNoResults]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {isExtend && (
                <Dialog open={true} onClose={onClose}>
                    <DialogTitle>
                        {!currentSubjectHasNoResults
                            ? `Computing extension with ${params.subject}`
                            : `No extensions possible with ${params.subject}`}
                    </DialogTitle>
                    <DialogContent>
                        {params.subject && (
                            <NewExplorerExtendDialogContent
                                noResults={currentSubjectHasNoResults}
                                subject={params.subject}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <DialogButton action="cancel">
                            {!currentSubjectHasNoResults ? 'Cancel' : 'Ok'}
                        </DialogButton>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}

export default NewExplorerExtend
