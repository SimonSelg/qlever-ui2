import React from 'react'
import PropTypes from 'prop-types'

import EntityPropertyList from '../EntityPropertyList'

import styles from './styles.module.scss'

const NewExplorerSearchResultList = ({
    entities,
    predicates,
    rowIndex,
    columnIndex,
    onClick
}) => (
    <div className={styles.container}>
        {entities.length > 0 && (
            <EntityPropertyList
                items={entities}
                type="obj"
                title="Entities"
                onClick={onClick}
                selectIndex={
                    predicates.length > 0 && columnIndex === 1
                        ? 0
                        : Math.min(rowIndex, entities.length)
                }
            />
        )}
        {predicates.length > 0 && (
            <EntityPropertyList
                items={predicates}
                type="prd"
                title="Properties / Qualifiers"
                onClick={onClick}
                selectIndex={
                    entities.length > 0 && columnIndex === 0
                        ? 0
                        : Math.min(rowIndex, predicates.length)
                }
            />
        )}
    </div>
)

NewExplorerSearchResultList.propTypes = {
    columnIndex: PropTypes.number,
    entities: PropTypes.array.isRequired,
    predicates: PropTypes.array.isRequired,
    rowIndex: PropTypes.number,
    onClick: PropTypes.func.isRequired
}

export default NewExplorerSearchResultList
