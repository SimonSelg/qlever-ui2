import { createSlice } from '@reduxjs/toolkit'
import { wikidataPrefixSearch } from '../../api/backend'
import { debounce } from '../../misc/debounce'

const initialState = { searchTerm: '', results: {} }

const wikidataSearchSlice = createSlice({
    name: 'wikidataSearch',
    initialState,
    reducers: {
        updateSearchTerm: {
            reducer: (state, { payload }) => ({
                ...state,
                loading:
                    payload.searchTerm.length > 2 &&
                    !state.results[payload.searchTerm],
                searchTerm: payload.searchTerm
            }),
            prepare: searchTerm => ({ payload: { searchTerm } })
        },
        fetchWikidataSearchResultSuccess: (state, { payload }) => ({
            ...state,
            error: null,
            loading:
                payload.searchTerm !== state.searchTerm &&
                state.searchTerm.length > 2,
            results: {
                ...state.results,
                [payload.searchTerm]: payload.results
            }
        }),
        fetchWikidataSearchResultFailed: (state, { payload }) => ({
            ...state,
            error: payload,
            loading: false
        })
    }
})

export const {
    fetchWikidataSearchResultSuccess,
    fetchWikidataSearchResultFailed,
    updateSearchTerm
} = wikidataSearchSlice.actions

export default wikidataSearchSlice.reducer

// thunk for updating query and updating debounced the results
const currentlyFetching = {}
const reactToSearchTermChange = async (searchTerm, dispatch, api) => {
    if (currentlyFetching[searchTerm]) return
    try {
        currentlyFetching[searchTerm] = true
        const results = await wikidataPrefixSearch(searchTerm, api)
        dispatch(fetchWikidataSearchResultSuccess({ searchTerm, results }))
    } catch (err) {
        dispatch(fetchWikidataSearchResultFailed(err.toString()))
    }
    currentlyFetching[searchTerm] = false
}

const debouncedReactToSearchTermChange = debounce(reactToSearchTermChange, 250)

export const updateWikidataSearch = searchTerm => (
    dispatch,
    getState,
    { api }
) => {
    dispatch(updateSearchTerm(searchTerm))
    if (searchTerm.length < 3) return
    debouncedReactToSearchTermChange(searchTerm, dispatch, api)
}
