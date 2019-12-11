import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Loader from '../Loader'
import NewExplorerSearchResultList from '../NewExplorerSearchResultList'

import styles from './styles.module.scss'

const NewExplorerSearchResults = ({
    searchTerm,
    results,
    loading,
    error,
    columnIndex,
    rowIndex,
    onClick
}) => {
    const noResults =
        results && !(results.predicate.length || results.object.length)
    const dontShowResults = !results || noResults
    return (
        <div
            className={classNames(
                styles.results,
                !dontShowResults && styles.hasResults
            )}
        >
            {dontShowResults ? (
                <div className={styles.container}>
                    {loading && <Loader className={styles.loader} />}
                    {!loading && error && <span>Error loading results</span>}
                    {results && !results}
                    {noResults && <span>No results</span>}
                    {searchTerm.length < 3 && searchTerm !== '' && (
                        <span>
                            Please enter more than {searchTerm.length} character
                            {searchTerm.length > 1 ? 's' : ''}
                        </span>
                    )}
                    {searchTerm === '' && (
                        <span>Please enter a search term</span>
                    )}
                </div>
            ) : (
                <NewExplorerSearchResultList
                    entities={results.object}
                    predicates={results.predicate}
                    onClick={onClick}
                    columnIndex={columnIndex}
                    rowIndex={rowIndex}
                />
            )}
        </div>
    )
}

NewExplorerSearchResults.propTypes = {
    columnIndex: PropTypes.number.isRequired,
    error: PropTypes.any,
    loading: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    results: PropTypes.object,
    rowIndex: PropTypes.number.isRequired,
    searchTerm: PropTypes.string.isRequired
}

export default NewExplorerSearchResults
