import React from 'react'
import { hot } from 'react-hot-loader/root'

import { DialogQueue } from '@rmwc/dialog'
import { SnackbarQueue } from '@rmwc/snackbar'

import { queue, snackbarQueue } from '../../misc/queue'

import Footer from '../Footer'
import Header from '../Header'
import Main from '../Main'

import 'normalize.css'
import './material-web-styles.scss'
import './styles.scss'

const App = () => {
    return (
        <>
            <DialogQueue dialogs={queue.dialogs} />
            <SnackbarQueue messages={snackbarQueue.messages} />
            <Header />
            <Main />
            <Footer />
        </>
    )
}

export default hot(App)
