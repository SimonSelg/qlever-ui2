import fetch from 'node-fetch'

// executes a query on the qlever instance of the uni freiburg. returns the query execution response
export async function computeQueryResponse(query: string) {
    // construct query requst
    const encodedQuery = encodeURIComponent(query)
    const fetchUrl = `http://qlever.informatik.uni-freiburg.de/api/wikidata-full?query=${encodedQuery}&cmd=clearcache`
    const response = await fetch(fetchUrl)

    // interpret response
    const res = await response.json()
    if (res.res) return res

    // there is a qlever bug where a request fails, but succeeds on the 2nd try. work around that
    console.log('qlever sparql execution error, retrying to avoid potential qlever bug', res)

    const response2 = await fetch(fetchUrl)
    const res2 = await response2.json()
    if (res2.res) {
        console.log('retry solved the problem')
    } else {
        console.log('retry was not successful', res2)
    }

    return res2
}
