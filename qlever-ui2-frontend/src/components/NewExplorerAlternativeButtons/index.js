import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useRoute } from 'wouter'

import { Button } from '@rmwc/button'
import { queryActions } from '../../redux/reducers'

const NewExplorerAlternativeButtons = () => {
    const dispatch = useDispatch()

    const [draft] = useRoute('/sparql/edit')

    const leftAlternatives = useSelector(
        state => state.query.present.leftAlternatives
    )
    const rightAlternatives = useSelector(
        state => state.query.present.rightAlternatives
    )

    const canGoLeft = leftAlternatives && leftAlternatives.length
    const canGoRight = rightAlternatives && rightAlternatives.length
    // const extensionIndex = (leftAlternatives && leftAlternatives.length) + 1
    const hasAlternatives = canGoLeft || canGoRight

    const goRight = () => dispatch(queryActions.useNextExtension())
    const goLeft = () => dispatch(queryActions.usePreviousExtension())

    if (!hasAlternatives) return <></>
    return (
        <>
            <Button onClick={goLeft} disabled={draft || !canGoLeft}>
                previous extension
            </Button>
            <Button onClick={goRight} disabled={draft || !canGoRight}>
                next extension
            </Button>
        </>
    )
}

export default NewExplorerAlternativeButtons
