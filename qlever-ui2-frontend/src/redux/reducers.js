import undoable from 'redux-undo'

import { generateQuerySlice } from './slices/querySlice'
import identifierSlice from './slices/identifierSlice'
import wikidataSearchSlice, {
    updateWikidataSearch
} from './slices/wikidataSearchSlice'
import queryExecutionSlice, {
    executeQueryAction,
    resetQueryExecution
} from './slices/queryExecutionSlice'
import configSlice from './slices/configSlice'

import { batch } from 'react-redux'
import { combineReducers } from '@reduxjs/toolkit'
import { addBasename, push } from '../index'
import { getQueryExtensions } from '../api/backend'

export const querySlice = generateQuerySlice('query')
const draftSlice = generateQuerySlice('draft')

const createReducers = routerReducer =>
    combineReducers({
        router: routerReducer,
        query: undoable(querySlice.reducer),
        draft: draftSlice.reducer,
        identifiers: identifierSlice,
        wikidataSearch: wikidataSearchSlice,
        queryExecution: queryExecutionSlice,
        config: configSlice
    })

export const queryActions = querySlice.actions
export const draftActions = draftSlice.actions

export const applyDraft = () => (dispatch, getState) => {
    const draft = getState().draft.query
    dispatch(queryActions.update(draft))
}

export const fetchAndApplyExtensions = subject => async (
    dispatch,
    getState,
    { api }
) => {
    const state = getState()
    const sparql = state.query.present.sparql
    const locationStateKey = state.router.location.key
    try {
        const results = await getQueryExtensions(sparql, subject, api)
        const newState = getState()
        if (
            locationStateKey !== newState.router.location.key ||
            sparql !== newState.query.present.sparql
        ) {
            console.log('location changed while fetching extensions')
            return
        }
        if (results.length === 0) {
            dispatch(queryActions.queryExtensionReturnedNoResults(subject))
            return
        }
        const extensions = results.map(([sparql]) => sparql)
        batch(() => {
            // update query and alternatives here
            dispatch(updateWikidataSearch(''))
            dispatch(queryActions.updateWithExtensions(extensions))
            dispatch(push('/'))
        })
    } catch (e) {
        console.log('fetching extensions failed', e)
        // todo: handle fail here
    }
}

function mayShowQueryExecution(state) {
    const pathname = state.router.location.pathname
    const searchTerm = state.wikidataSearch.searchTerm
    if (pathname === addBasename('/sparql')) return true
    return pathname === addBasename('/') && (!searchTerm || searchTerm === '')
}

export const onCtrlEnterKeyPress = () => (dispatch, getState) => {
    const state = getState()
    if (!mayShowQueryExecution(state)) return
    if (state.queryExecution.loading) return
    dispatch(executeQueryAction(100))
}

export const onEscKeyPress = () => (dispatch, getState) => {
    const state = getState()
    if (!state.queryExecution.result && !state.queryExecution.error) return
    if (!mayShowQueryExecution(state)) return
    dispatch(resetQueryExecution())
}

export default createReducers
