import { batch } from 'react-redux'

import { configureStore, getDefaultMiddleware, isPlain } from '@reduxjs/toolkit'
import { createReduxHistoryContext } from 'redux-first-history'
import { createBrowserHistory } from 'history'

import { DataFactory } from 'n3'

import createReducers from './reducers'

const {
    createReduxHistory: createReduxHistory_,
    routerMiddleware,
    routerReducer
} = createReduxHistoryContext({
    history: createBrowserHistory(),
    reduxTravelling: true,
    showHistoryAction: false,
    batch
})

// silence dev warnings about sparqljs parse result being non serializable
const { NamedNode, Variable, Literal } = DataFactory.internal
const termTypes = [NamedNode, Variable, Literal]
const isSerializable = value =>
    isPlain(value) || termTypes.includes(value.constructor)
const serializableCheck = { isSerializable }

const createMiddelware = basename => [
    ...getDefaultMiddleware({
        serializableCheck,
        thunk: {
            extraArgument: { api: `${basename}api/` }
        }
    }),
    routerMiddleware
]

const reducer = createReducers(routerReducer)
export const createStore = basename => {
    const store = configureStore({
        reducer: reducer,
        middleware: createMiddelware(basename),
        devTools: process.env.NODE_ENV !== 'production'
    })

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducers', () => store.replaceReducer(reducer))
    }

    return store
}

export const createReduxHistory = createReduxHistory_
