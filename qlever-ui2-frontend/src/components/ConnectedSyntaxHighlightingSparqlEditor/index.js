import React from 'react'
import PropTypes from 'prop-types'

import { useSelector, useDispatch, batch } from 'react-redux'
import { useRoute } from 'wouter'
import { push } from '../../index'
import { executeQueryAction } from '../../redux/slices/queryExecutionSlice'

import SyntaxHighlightingSparqlEditor from '../SyntaxHighlightingSparqlEditor'
import EditBar from '../NewExplorerQueryEditBar'

import { applyDraft, draftActions } from '../../redux/reducers'

const ConnectedSyntaxHighlightingSparqlEditor = ({ className }) => {
    const dispatch = useDispatch()

    const [isDraft] = useRoute('/sparql/edit')
    const querySparql = useSelector(state => state.query.present.sparql)
    const draftSparql = useSelector(state => state.draft.sparql)
    const draft = useSelector(state => state.draft.query)

    const onChange = value => {
        console.log('onChange', value)
        batch(() => {
            dispatch(draftActions.updateFromSparql(value, true))
            if (!isDraft) dispatch(push('/sparql/edit'))
        })
    }

    const onKeyDown = event => {
        if (event.key === 'Escape') event.target.blur()
        if ((!isDraft || draft) && event.ctrlKey && event.key === 'Enter') {
            event.target.blur()
            batch(() => {
                if (isDraft) {
                    dispatch(applyDraft())
                    dispatch(push('/sparql'))
                }
                dispatch(executeQueryAction())
            })
        }
    }

    return (
        <>
            <SyntaxHighlightingSparqlEditor
                sparql={isDraft ? draftSparql : querySparql}
                onChange={onChange}
                editing
                className={className}
                onKeyDown={onKeyDown}
            />
            {isDraft && <EditBar disabled={!draft} />}
        </>
    )
}

export default ConnectedSyntaxHighlightingSparqlEditor

ConnectedSyntaxHighlightingSparqlEditor.propTypes = {
    className: PropTypes.string
}
