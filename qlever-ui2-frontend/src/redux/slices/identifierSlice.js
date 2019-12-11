import { createSlice } from '@reduxjs/toolkit'
import { getIdentifiersMapping } from '../../api/backend'

const initialState = { error: null, identifiers: {} }

const identifierSlice = createSlice({
    name: 'identifiers',
    initialState,
    reducers: {
        fetchIdentifiersSuccess: (state, { payload }) => ({
            error: null,
            identifiers: {
                ...state.identifiers,
                ...payload.identifiers
            }
        }),
        fetchIdentifiersFailed: (state, { payload }) => ({
            ...state,
            error: payload
        })
    }
})

export const {
    fetchIdentifiersSuccess,
    fetchIdentifiersFailed
} = identifierSlice.actions

export const fetchMissingIdentifiers = identifiers => async (
    dispatch,
    getState,
    { api }
) => {
    const mappings = getState().identifiers.identifiers
    const missing = identifiers.filter(x => !mappings[x])
    if (!missing.length) return

    try {
        const identifiers = await getIdentifiersMapping(missing, api)
        dispatch(fetchIdentifiersSuccess({ identifiers }))
    } catch (err) {
        dispatch(fetchIdentifiersFailed(err.toString()))
    }
}

export default identifierSlice.reducer
