import { createSlice } from '@reduxjs/toolkit'
import { executeSparql } from '../../api/backend'
import { querySlice } from '../reducers'
import reduceReducers from 'reduce-reducers'

const initialState = {
    loading: false,
    result: null,
    error: null
}

export const queryExecutionSlice = createSlice({
    name: 'queryExecution',
    reducers: {
        startQueryExecution: state => ({
            ...state,
            loading: true
        }),
        resetQueryExecution: () => initialState,
        queryExecutionFail: (state, { payload }) => ({
            ...initialState,
            error: payload
        }),
        queryExecutionSuccess: {
            reducer: (state, { payload: { result, amount } }) => {
                return {
                    error: null,
                    loading: false,
                    result,
                    amount
                }
            },
            prepare: (result, amount) => ({ payload: { result, amount } })
        }
    }
})

export const {
    resetQueryExecution,
    queryExecutionSuccess,
    queryExecutionFail,
    startQueryExecution
} = queryExecutionSlice.actions

// reducer that resets the execution every time the a action on query happens
const resetExecutionOnQueryUpdatesReducer = (state, action) => {
    if (
        action.type.startsWith(`${querySlice.name}/`) ||
        action.type.startsWith('@@redux-undo/')
    ) {
        return queryExecutionSlice.reducer(
            state,
            resetQueryExecution(initialState)
        )
    }

    return state
}

export default reduceReducers(
    initialState,
    queryExecutionSlice.reducer,
    resetExecutionOnQueryUpdatesReducer
)

export const executeQueryAction = (limit = undefined) => async (
    dispatch,
    getState,
    { api }
) => {
    const state = getState()
    const sparql = state.query.present.sparql
    dispatch(startQueryExecution())
    try {
        const result = await executeSparql(sparql, api, limit)
        const newState = getState()
        if (newState.query.present.sparql !== sparql) return
        if (!newState.queryExecution.loading) return

        if (!result.res) {
            console.log(result)
            dispatch(queryExecutionFail(result.exception || result.error))
        } else {
            dispatch(queryExecutionSuccess(result.res, result.resultsize))
        }
    } catch (error) {
        dispatch(queryExecutionFail(error))
    }
}
