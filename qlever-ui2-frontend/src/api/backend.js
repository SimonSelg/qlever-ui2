import base64UrlEncode from '../misc/base64url'

export const getIdentifiersMapping = async (identifiers, api) => {
    const res = {}
    for (const identifier of identifiers) res[identifier] = false

    const x = await fetch(`${api}identifiers/${identifiers.join(',')}`)
    const json = await x.json()

    const entities = json.entities
    if (entities) {
        for (const entity of entities) {
            const identifier = entity.wdName.replace(/[<>]/g, '')
            if (identifier === '') continue
            const name = entity.name.replace(/\s+$/g, '')
            res[identifier] = name
        }
    }

    return res
}

export const wikidataPrefixSearch = async (searchTerm, api) => {
    const result = await fetch(`${api}search/${searchTerm}`)
    return await result.json()
}

export const getQueryExtensions = async (sparql, subject, api) => {
    console.info('fetching extensions')

    const response = await fetch(
        `${api}query/${base64UrlEncode(sparql)}/extend/${subject}`
    )
    const result = await response.json()
    return result.extensions
}

// execute sparql and return result as json
export async function executeSparql(query: string, api, limit = undefined) {
    const fetchUrl = `${api}qlever/${base64UrlEncode(query)}${
        limit ? `/${limit}` : ''
    }`
    const response = await fetch(fetchUrl)
    return await response.json()
}
