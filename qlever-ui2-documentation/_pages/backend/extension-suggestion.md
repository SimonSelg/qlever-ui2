---
layout: page
title: Extension Suggestion
category: backend
order: 4
---

Computes query extensions for a given query an a wikidata entity (object or predicate) together with a ranking.

### API
`/api/query/<query>/extend/<entity>`, where `<query>` is an [base64url](https://tools.ietf.org/html/rfc4648#section-5) -encoded sparql query and `<entity>` is an Wikidata Entity

#### Example
<code class="highlighter-rouge highlighter-rouge--big">/api/query/UFJFRklYIHdkOiA8aHR0cDovL3d3dy53aWtpZGF0YS5vcmcvZW50aXR5Lz4NClBSRUZJWCB3ZHQ6IDxodHRwOi8vd3d3Lndpa2lkYXRhLm9yZy9wcm9wL2RpcmVjdC8-DQpQUkVGSVggcmRmczogPGh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSM-DQpTRUxFQ1QgP2FjdG9yID9hY3RvckxhYmVsIFdIRVJFIHsNCiAgP2FjdG9yIHdkdDpQMTA2IHdkOlEzMzk5OSAuDQogID9hY3RvciByZGZzOmxhYmVsID9hY3RvckxhYmVsIC4NCiAgRklMVEVSIGxhbmdNYXRjaGVzKGxhbmcoP2FjdG9yTGFiZWwpLCAiZW4iKQ0KfQ/extend/Q183</code> 

```json
{
   "extensions":[
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P27 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         7222
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P19 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         99
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P1532 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         14
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P20 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         14
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P551 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         5
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P119 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         2
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P495 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         2
      ],
      [
         "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actor ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P937 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
         1
      ]
   ]
}
```

### Technical Details
This works internally by building one or multiple SPARQL Queries  and running them against QLever to and aggregating the results.

This hat lots of improvement potential. One could Interface with QLever directly instead of using SPARQL Queries for a performance boost.


### Notes
There is also `/api/query/<query>/options/qualifiers` and `/api/query/<query>/options/predicates`, which return a list of possible predicates and qualifiers to extend the query with. 

These are **not** used by the frontend. It could be used to implement a "suggest me an extension" functionality. I didn't have any more time left to implement an UI for it. 

Also, it fails or takes a really long time on queries that return too many results / are not restrictive enough. 
