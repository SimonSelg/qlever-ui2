---
layout: page
title: Wikidata Entity Search
category: backend
order: 3
---

Performs a prefix search on wikidata entities and returns matching objects and predicates.

### API
`/api/search/<prefix>`, where `<prefix>` is an url-encoded prefix you want to search for.

#### Example
`GET /api/search/point%20in`   

```json
{
   "object":[
      {
         "description":"",
         "name":"point in polygon",
         "numSitelinks":13,
         "type":"0",
         "wdName":"<Q1575331>"
      },
      {
         "description":"a particular moment",
         "name":"point in time",
         "numSitelinks":6,
         "type":"0",
         "wdName":"<Q186408>"
      },
      {
         "description":"business",
         "name":"Point",
         "numSitelinks":2,
         "type":"0",
         "wdName":"<Q11339004>"
      },
      {
         "description":"",
         "name":"Point interactions in one-dimensional quantum mechanics with coupled channels",
         "numSitelinks":0,
         "type":"0",
         "wdName":"<Q56764284>"
      },
      {
         "description":"scientific article published in June 2002",
         "name":"Point injection for treating nephritic colic.",
         "numSitelinks":0,
         "type":"0",
         "wdName":"<Q49084092>"
      },
      {
         "description":"scientific article",
         "name":"Point injection as an alternative acupuncture technique--an exploratory study of responses in healthy subjects.",
         "numSitelinks":0,
         "type":"0",
         "wdName":"<Q47569738>"
      },
      {
         "description":"scientific article published in September 2003",
         "name":"Point injection for treating nephritic colic in 101 cases.",
         "numSitelinks":0,
         "type":"0",
         "wdName":"<Q48946956>"
      },
      {
         "description":"scientific article",
         "name":"Point inoculation of cultivated tracheal mucous membrane with bacteria.",
         "numSitelinks":0,
         "type":"0",
         "wdName":"<Q54460023>"
      }
   ],
   "predicate":[
      {
         "description":"time and date something took place, existed or a statement was true",
         "name":"point in time",
         "numSitelinks":0,
         "type":"1",
         "wdName":"<P585>"
      }
   ]
}
```
