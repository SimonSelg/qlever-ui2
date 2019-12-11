# ideas

## ui
- prism.js instead of codemirror
- highlight belonging query parts in graph on sparql hover, and other way around.
- implement more detailed result representation 

## general
- generate predictions from smaller subset

## query editing
- turn variable into value or "<" / ">" / "!=" value
- delete node graphically

- "extend this node" -> get list of possible additions (api implemented but no UI using it right now)
  - add relation (todo: what about qualifiers)
    ```SPARQL
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT (SAMPLE(?actorLabel) AS ?actorLabel) ?test1 (COUNT(?test1) as ?count) WHERE {
    ?actor wdt:P106 wd:Q33999 .
    ?actor rdfs:label ?actorLabel .
    ?actor wdt:P106 wd:Q2095549 .
    ?actor ?test1 ?test2 .
    FILTER langMatches(lang(?actorLabel), "en")
    }
    GROUP BY ?test1
    ORDER BY DESC(?count)```
 
  - add entity with possible relation
    - this is rather slow for more complex queries. might not be usefull to use in practice. todo: can we find out the complexity of the query to figure out if it makes sense to offer this search or not?

    ```SPARQL
    PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT (SAMPLE(?actorLabel) AS ?actorLabel) ?test1 (COUNT(?test1) as ?count1) ?test2 (COUNT(?test2) as ?count2) WHERE {
      ?actor wdt:P106 wd:Q33999 .
      ?actor rdfs:label ?actorLabel .
      ?actor wdt:P106 wd:Q2095549 .
      ?actor ?test1 ?test2 .
      FILTER langMatches(lang(?actorLabel), "en")
    }
    GROUP BY ?test2 ?test1
    ORDER BY DESC(?count2) DESC(?count1)
    ```

## query extension
- "peek at example data" - to get ideas what data type you are dealing with
