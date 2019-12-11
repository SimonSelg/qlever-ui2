import { createSlice } from '@reduxjs/toolkit'
import { DEFAULT_QUERY } from '../../example_queries'
import { generateSpaqrl, parseSparql } from 'qlever-ui2-shared/src/sparqljs'
import {
    renameVariable as renameVariableHelper,
    setVariableSelectState as setVaribaleSelectStateHelper
} from 'qlever-ui2-shared/src/sparqljs-helpers'

const generateFromSparql = (sparql, keepOriginal = false) => {
    const query = sparql && parseSparql(sparql)
    return {
        query,
        sparql: keepOriginal ? sparql : generateSpaqrl(query)
    }
}

function generateFromQuery(query) {
    const sparql = query && generateSpaqrl(query)
    return {
        query,
        sparql
    }
}

const initialState = generateFromSparql(DEFAULT_QUERY)

export const generateQuerySlice = name =>
    createSlice({
        name: name,
        initialState,
        reducers: {
            // test: state => ({ ...state, test: true })
            updateWithExtensions: {
                reducer: (state, { payload: { extensions } }) => {
                    const [sparql, ...rightAlternatives] = extensions
                    return {
                        ...generateFromSparql(sparql),
                        leftAlternatives: [],
                        rightAlternatives
                    }
                },
                prepare: extensions => ({ payload: { extensions } })
            },
            useNextExtension: state => {
                if (!state.rightAlternatives) return state
                if (!state.rightAlternatives.length) return state
                const [sparql, ...rest] = state.rightAlternatives
                return {
                    ...generateFromSparql(sparql),
                    leftAlternatives: [state.sparql, ...state.leftAlternatives],
                    rightAlternatives: rest
                }
            },
            usePreviousExtension: state => {
                if (!state.leftAlternatives) return state
                if (!state.leftAlternatives.length) return state
                const [sparql, ...rest] = state.leftAlternatives
                return {
                    ...generateFromSparql(sparql),
                    leftAlternatives: rest,
                    rightAlternatives: [
                        state.sparql,
                        ...state.rightAlternatives
                    ]
                }
            },
            update: {
                reducer: (state, { payload: { query } }) => {
                    return generateFromQuery(query)
                },
                prepare: query => ({ payload: { query } })
            },
            updateFromSparql: {
                reducer: (state, { payload: { sparql, keepOriginal } }) => {
                    return generateFromSparql(sparql, keepOriginal)
                },
                prepare: (sparql, keepOriginal) => ({
                    payload: { sparql, keepOriginal }
                })
            },
            queryExtensionReturnedNoResults: (state, { payload }) => ({
                ...state,
                noExtensions: {
                    ...state.noExtensions,
                    [payload]: true
                }
            }),
            renameVariable: {
                reducer: (state, { payload: { newName, oldName } }) => {
                    const query = renameVariableHelper(
                        state.query,
                        oldName,
                        newName
                    )
                    if (!query) return state
                    return generateFromQuery(query)
                },
                prepare: (oldName, newName) => ({
                    payload: { oldName, newName }
                })
            },
            setVariableSelectState: {
                reducer: (
                    state,
                    { payload: { variable, targetState, isLabelFor } }
                ) => {
                    const query = setVaribaleSelectStateHelper(
                        state.query,
                        variable,
                        targetState,
                        isLabelFor
                    )
                    if (!query) return state
                    return generateFromQuery(query)
                },
                prepare: (variable, targetState, isLabelFor) => ({
                    payload: {
                        variable,
                        targetState,
                        isLabelFor
                    }
                })
            }
        }
    })

/*
const enhandedRouterReducer = (state, action) => {
    const newState = querySlice.reducer(state, action)
    if (action.type !== LOCATION_CHANGE) return newState
    const locationState = action.payload.location.state
    if (!locationState || !locationState.sparql) return newState
    const sparql = locationState.sparql
    if (state.generatedSparql === sparql) return newState
    return generate(sparql)
}
 */
