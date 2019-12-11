import React from 'react'

import { useRoute } from 'wouter'

import UndoTopBar from '../UndoTopBar'

const NewExplorerHistoryButtons = () => {
    const [draft] = useRoute('/sparql/edit')
    return <UndoTopBar disabled={draft} />
}

export default NewExplorerHistoryButtons
