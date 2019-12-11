import PropTypes from 'prop-types'
import React, { useCallback, useState, useRef, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useRoute } from 'wouter'

import { TextField } from '@rmwc/textfield'

import { updateWikidataSearch } from '../../redux/slices/wikidataSearchSlice'
import NewExplorerSearchResults from '../NewExplorerSearchResults'

import styles from './styles.module.scss'

const cleanupWdName = wdName => wdName.replace('<', '').replace('>', '')

const NewExplorerSearch = ({ onClick }) => {
    const dispatch = useDispatch()

    const [isExtend] = useRoute('/extend/:subject')
    const wasExtend = useRef(isExtend)

    const inputRef = useRef(undefined)
    const shouldFocus = !isExtend && wasExtend.current
    wasExtend.current = isExtend

    console.log('should focus', shouldFocus)

    // search term and result data
    const searchTerm = useSelector(state => state.wikidataSearch.searchTerm)
    const results = useSelector(
        state => state.wikidataSearch.results[searchTerm]
    )
    const loading = useSelector(state => state.wikidataSearch.loading)
    const error = useSelector(state => state.wikidataSearch.error)
    const isEmptyQuery = useSelector(state => {
        const query = state.query.present.query
        if (!query.where) return true
        return query.where.length === 0
    })

    // focus
    const [rowIndex, setRowIndex] = useState(0)
    const [columnIndex, setColumnIndex] = useState(0)

    // if query is empty, hide predicates
    const data =
        isEmptyQuery && results
            ? {
                  object: results.object,
                  predicate: []
              }
            : results
    const haveSearchTerm = searchTerm.length > 2

    // compute the data of the row that is focused currently
    const rowData =
        data &&
        (data.object.length && (columnIndex === 0 || !data.predicate.length)
            ? data.object
            : data.predicate)
    const rowLength = rowData ? rowData.length : 0

    // construct callbacks
    const onSearchTermChange = useCallback(
        event => {
            const value = event.target.value
            // setSearchTerm(value)
            dispatch(updateWikidataSearch(value))
            setColumnIndex(0)
            setRowIndex(0)
        },
        [dispatch]
    )

    // handle keypresses for focus and selection
    const onKeyDown = useCallback(
        event => {
            const { key: press, shiftKey } = event
            if (press === 'ArrowDown' || (press === 'Tab' && !shiftKey)) {
                if (rowIndex < rowLength) setRowIndex(rowIndex + 1)
            } else if (press === 'ArrowUp' || (press === 'Tab' && shiftKey)) {
                if (rowIndex > 1) setRowIndex(Math.min(rowIndex, rowLength) - 1)
            } else if (press === 'ArrowRight') {
                if (columnIndex < 1) setColumnIndex(x => x + 1)
            } else if (press === 'ArrowLeft') {
                if (columnIndex > 0) setColumnIndex(x => x - 1)
            } else if (press === 'Escape') event.target.blur()
            else if (press === 'Enter') {
                if (rowIndex) {
                    event.target.blur()
                    const entry = rowData[Math.min(rowIndex, rowLength) - 1]
                    const wdName = entry.wdName
                    onClick(cleanupWdName(wdName))
                }
            } else return
            event.preventDefault()
        },
        [rowIndex, rowLength, columnIndex, rowData, onClick]
    )

    const onBlur = useCallback(() => {
        setColumnIndex(0)
        setRowIndex(0)
    }, [])

    useEffect(() => {
        if (!shouldFocus) return
        inputRef.current.focus()
    }, [shouldFocus])

    return (
        <div className={styles.container}>
            <TextField
                value={searchTerm}
                onChange={onSearchTermChange}
                icon="search"
                className={styles.textfield}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                inputRef={inputRef}
            />

            <NewExplorerSearchResults
                results={data}
                error={error && haveSearchTerm}
                loading={loading}
                searchTerm={searchTerm}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                onClick={wdName => onClick(cleanupWdName(wdName))}
            />

            {/*searchTerm === '' && <NewExplorerControls />*/}
        </div>
    )
}

export default NewExplorerSearch

NewExplorerSearch.propTypes = {
    onClick: PropTypes.func.isRequired
}
