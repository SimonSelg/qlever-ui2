import React from 'react'
import ReactDOM from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { Router as WouterRouter } from 'wouter'

import App from './components/App'

import { createWouterHook } from './wouterUseLocation'
//import { createWouterHook } from 'redux-first-history/wouter'
import { createReduxHistory, createStore } from './redux/store'
import { push as push_ } from 'redux-first-history'

const baseElement = document.querySelector('base')
export const basename = baseElement
    ? baseElement.getAttribute('href').replace(/\/$/, '')
    : ''

// const basename = '/ui-simon-selg'

const store = createStore(basename + '/')
const history = createReduxHistory(store)
const wouterUseLocation = createWouterHook(history)

export const addBasename = to => basename + to
export const push = to => push_(addBasename(to))

ReactDOM.render(
    <ReduxProvider store={store}>
        <WouterRouter hook={wouterUseLocation} base={basename}>
            <App />
        </WouterRouter>
    </ReduxProvider>,
    document.getElementById('app')
)
