import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { Typography } from '@rmwc/typography'
import { IconButton } from '@rmwc/icon-button'

import { generateSpaqrl, parseSparql } from 'qlever-ui2-shared/src/sparqljs'
import { getWikidataIdentifiersFromSparqlJS } from 'qlever-ui2-shared/src/sparqljs-helpers'
import LinkButton from '../../components/LinkButton'
import ResponsivePageCard from '../../components/ResponsivePageCard'
import slides from './slides'

import { fetchMissingIdentifiers } from '../../redux/slices/identifierSlice'

import styles from './styles.module.scss'
import { push } from '../../index'

export const sparqlQuery = `PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    SELECT ?actor WHERE {
      ?actor wdt:P106 wd:Q33999 .
      ?actor wdt:P1411 wd:Q103916 .
      ?actor wdt:P551 wd:Q60 .
}`

let defaultQuery

function Tutorial({ params }) {
    const dispatch = useDispatch()
    if (!defaultQuery) {
        const query = parseSparql(sparqlQuery)
        defaultQuery = generateSpaqrl(query)
        const identifiers = getWikidataIdentifiersFromSparqlJS(query)
        dispatch(fetchMissingIdentifiers(identifiers))
    }

    const slideIndex = Math.min(parseInt(params.slide) || 0, slides.length - 1)

    const { title, slide: Slide, back, next } = slides[slideIndex]

    const onClear = () => dispatch(push('/'))

    return (
        <ResponsivePageCard className={styles.card}>
            <IconButton
                onClick={onClear}
                className={styles.clearButton}
                icon="clear"
            />
            <div className={styles.inner}>
                <Typography className={styles.title} use="headline5" tag="h1">
                    {title}
                </Typography>

                <div className={styles.container}>
                    <div className={styles.slide}>
                        <Slide defaultQuery={defaultQuery} />
                    </div>

                    <div className={styles.arrows} key={slideIndex}>
                        {slideIndex !== 0 && (
                            <LinkButton
                                outlined
                                icon="keyboard_arrow_left"
                                disabled={slideIndex === 0}
                                to={
                                    slideIndex !== 1
                                        ? `/tutorial/${slideIndex - 1}`
                                        : `/tutorial`
                                }
                            >
                                {back || 'back'}
                            </LinkButton>
                        )}
                        <LinkButton
                            raised
                            icon={slideIndex !== 0 && 'keyboard_arrow_right'}
                            to={
                                slideIndex !== slides.length - 1
                                    ? `/tutorial/${slideIndex + 1}`
                                    : '/'
                            }
                        >
                            {next || 'next'}
                        </LinkButton>
                    </div>
                </div>
            </div>
        </ResponsivePageCard>
    )
}

Tutorial.propTypes = {
    params: PropTypes.object.isRequired
}

export default Tutorial
