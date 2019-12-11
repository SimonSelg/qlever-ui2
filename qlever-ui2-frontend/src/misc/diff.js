import { structuredPatch } from 'diff'

// compute github style diff between two strings
export default function getDiff(old, current) {
    const diffAsData = structuredPatch('', '', old, current, '', '', {
        context: Math.max(old.length, current.length)
    })

    const text = diffAsData.hunks[0].lines./*slice(0, -1).*/ join('\n')
    const clean = text
        .replace(/\\ No newline at end of file\n?/gm, '')
        .replace(/\s+$/, '')

    // remove trailing whitespace
    return clean.replace(/^ /gm, '  ')
}
