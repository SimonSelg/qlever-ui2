// helper functions for constructing or modifying sparql queries

export const generateTriple = (subject, predicate, object) => ({
    subject,
    predicate,
    object
})

export const generateReverseableTriple = (subject, predicate, object, reverse) =>
    generateTriple(reverse ? object : subject, predicate, reverse ? subject : object)

export const generateEntityURI = identifier => `http://www.wikidata.org/entity/${identifier}`

export const wrapTripleInOptional = triple => wrapTriplesInOptional([triple])

export const wrapTriplesInOptional = triples => ({
    type: 'optional',
    patterns: [
        {
            type: 'bgp',
            triples: triples
        }
    ]
})

export const variableName = variable => variable.slice(1)
