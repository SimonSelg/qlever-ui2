import React from 'react'

import { Typography } from '@rmwc/typography'

const StartExploringSlide = () => (
    <div>
        <Typography use="headline4" tag="p" style={{ marginBottom: '2rem' }}>
            You are now ready to jump into QLever UI2
        </Typography>
        <Typography use="body1" tag="p">
            There are many more features to discover. You can come back to the
            tutorial any time.
        </Typography>
    </div>
)

export default {
    slide: StartExploringSlide,
    next: 'start exploring'
}
