import React from 'react'

import { Typography } from '@rmwc/typography'

import wikidataOverviewImage from '../media/wikidata_overview.png'

const WikidataOverviewSlide = () => (
    <>
        <img
            alt="wikidata example item"
            src={wikidataOverviewImage}
            style={{ maxWidth: '600px' }}
        />

        <Typography use="body1" tag="p">
            Items can be accessed online using their identifier:
            <a
                href="https://www.wikidata.org/wiki/Q42"
                target="_blank"
                rel="noopener noreferrer"
            >
                https://www.wikidata.org/wiki/<b>Q42</b>
            </a>
            .
        </Typography>
    </>
)

export default {
    slide: WikidataOverviewSlide,
    title: 'Wikidata Overview'
}
