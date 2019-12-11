import React from 'react'

import { Link } from 'wouter'

import { Button } from '@rmwc/button'
import {
    TopAppBar,
    TopAppBarNavigationIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle
} from '@rmwc/top-app-bar'

import LinkButton from '../LinkButton/'

import { queue } from '../../misc/queue'

import styles from './styles.module.scss'
import KeyboardShortcutList from '../KeyboardShortcutList'

const onKeyboardShortcutsClick = () => {
    queue
        .alert({
            title: 'Keyboard Shortcuts',
            body: <KeyboardShortcutList />
        })
        .then()
}

const Header = () => {
    return (
        <>
            <TopAppBar className={styles.header}>
                <TopAppBarRow>
                    <TopAppBarSection>
                        <Link href="/" className={styles.link}>
                            <TopAppBarNavigationIcon icon="home" />
                            <TopAppBarTitle className={styles.appBarTitle}>
                                QLever UI2
                            </TopAppBarTitle>
                        </Link>
                        <TopAppBarSection
                            alignEnd
                            className={styles.rightActionItems}
                        >
                            <Button
                                icon="keyboard"
                                onClick={onKeyboardShortcutsClick}
                            >
                                Keyboard Shortcuts
                            </Button>
                            <LinkButton icon="book" to="/tutorial">
                                tutorial
                            </LinkButton>
                            <Button
                                icon="home"
                                tag="a"
                                target="_blank"
                                href="https://simonselg.github.io/qlever-ui2/"
                            >
                                documentation
                            </Button>
                        </TopAppBarSection>
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
        </>
    )
}

export default Header
