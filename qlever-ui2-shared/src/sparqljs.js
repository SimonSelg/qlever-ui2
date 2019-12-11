import { Generator as SparqlGenerator } from 'sparqljs'
import { Parser as SparqlParser } from 'sparqljs'
import { DataFactory } from 'n3'

const generator = new SparqlGenerator()
export const parser = new SparqlParser({ factory: DataFactory })

// generate sparql query from sparqljs data structure
export function generateSpaqrl(query: SparqlJsResult) {
    const sparql = generator.stringify(query)

    // modify generated sparql query to be compatible with qlever
    return (
        sparql
            .replace(/FILTER\(LANGMATCHES\(LANG\((.+)\)\)/gm, 'FILTER langMatches(lang($1)')
            .replace(/"\^\^<http:\/\/www.\w3\.org\/2001\/XMLSchema#string>/gm, '"')
            // fix group by looking like GROUP BY (?test1) (?test2) (?test3) instead of GROUP BY ?test1 ?test2 ?test3
            .replace(
                /GROUP BY ((?:\(.+?\) ?)+)/g,
                (match, capture) => `GROUP BY ${capture.replace(/\((.+?)\)/g, '$1')}`
            )
    )
}

// parse sparql query to sparqljs data structure
export function parseSparql(query: string): SparqlJsResult {
    try {
        const parsed = parser.parse(query)
        parsed.prefixes = { ...parsed.prefixes }
        return parsed
    } catch (e) {
        console.warn(e)
    }

    return null
}

// clones
export function cloneQuery(query: SparqlJsResult): SparqlJsResult {
    // this isn't perfect, as the n3 prototypes are not kept
    // but as long as we don't use them (which we don't) we are fine
    return JSON.parse(JSON.stringify(query))
}

// flow type of the sparqljs data structure that represents a sparql query
export type SparqlJsResult = {
    queryType: string,
    where: Array<{
        type: string,
        triples?: Array<{
            subject: string,
            predicate: string,
            object: string
        }>
    }>,
    type: string,
    variables: Array<string>,
    prefixes: { [string]: string }
}
