const ACTOR_QUERY = `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?dateOfBirth ?actorLabel ?spouseLabel WHERE {
  ?actor wdt:P106 wd:Q33999 .
  ?actor wdt:P27 wd:Q183 .
  ?actor wdt:P569 ?dateOfBirth .
  ?actor rdfs:label ?actorLabel .
  ?actor wdt:P26 ?spouse .
  ?spouse rdfs:label ?spouseLabel .
  FILTER (LANG(?actorLabel) = "en") .
  FILTER (LANG(?spouseLabel) = "en")
}
`

const EMPTY_QUERY = `SELECT ?variable WHERE {}`
const MINIMAL_QUERY = `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?actor ?actorLabel WHERE {
  ?actor wdt:P106 wd:Q33999 .
  ?actor rdfs:label ?actorLabel .
  FILTER (LANG(?actorLabel) = "en")
}
`

const MINIMAL_PRE_QUALIFIER_QUERY = `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?actorLabel WHERE {
  ?actor wdt:P106 wd:Q33999 .
  ?actor rdfs:label ?actorLabel .
  ?actor wdt:P1411 wd:Q103916 .
  FILTER (LANG(?actorLabel) = "en")
}`

const MINIMAL_QUALIFIER_QUERY = `PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?actorLabel WHERE {
  ?actor wdt:P106 wd:Q33999 .
  ?actor rdfs:label ?actorLabel .
  ?actor p:P1411 ?statement .
  ?statement ps:P1411 wd:Q103916 .
  ?statement pq:P1686 ?work .
  FILTER (LANG(?actorLabel) = "en")
}

`

export const EXAMPLE_QUERIES = [
    EMPTY_QUERY,
    MINIMAL_QUERY,
    MINIMAL_PRE_QUALIFIER_QUERY,
    MINIMAL_QUALIFIER_QUERY,
    ACTOR_QUERY
]

export const DEFAULT_QUERY = EMPTY_QUERY
