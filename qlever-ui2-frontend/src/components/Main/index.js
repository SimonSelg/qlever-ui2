import React from 'react'

import { Route, Switch, Redirect } from 'wouter'

import Tutorial from '../../pages/Tutorial/'
import NotFoundPage from '../../pages/NotFound/'

import styles from './styles.module.scss'
import NewExplorerPage from '../../pages/NewExplorer'

const VERSION = '0.2'

const Main = () => {
    const lastVersion = localStorage.getItem('lastSeenVersion') || 0
    let isNewUser = lastVersion !== VERSION
    if (isNewUser) {
        localStorage.setItem('lastSeenVersion', VERSION)
    }

    return (
        <main className={styles.main}>
            {isNewUser && <Redirect to="/tutorial" />}
            <Switch>
                <Route path="/tutorial/:slide?" component={Tutorial} />
                <Route path="/">{() => <NewExplorerPage />}</Route>
                <Route path="/sparql">{() => <NewExplorerPage />}</Route>
                <Route path="/sparql/edit">{() => <NewExplorerPage />}</Route>
                <Route path="/extend/:subject">
                    {() => <NewExplorerPage />}
                </Route>
                <Route path="/:rest*" component={NotFoundPage} />
            </Switch>
        </main>
    )
}

export default Main
