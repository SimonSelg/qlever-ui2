import React from 'react'

import { Typography } from '@rmwc/typography'
import queryExtensionGif from '../media/query-extension.gif'

const ConstructingQueriesSlide = () => (
    <>
        <Typography use="body1" tag="p">
            The big power of QLever UI2 is not visualizing queries though, it's
            creating them.
        </Typography>

        <img
            alt="wikidata qualifier demo"
            src={queryExtensionGif}
            style={{ maxWidth: 650 }}
        />

        <Typography use="body1" tag="p">
            You start with an empty query, then extend it, step by step. QLever
            UI2 does the heavy lifting for you.
        </Typography>
    </>
)

export default {
    slide: ConstructingQueriesSlide,
    title: 'Constructing Queries'
}
