---
layout: page
title: Wikidata Identifier Resolving
category: backend
order: 2
---

Resolves Wikidata Identifiers to their respective labels. 

### API
`/api/identifiers/<entities>`, where `<entities>` is an list string of Wikidata identifiers, each separated by a comma.

#### Example
`GET /api/identifiers/P106,Q33999`   

```json
{
   "entities":[
      {
         "description":"occupation of a person; see also \"field of work\" (Property:P101), \"position held\" (Property:P39)",
         "name":"occupation",
         "numSitelinks":0,
         "type":"1",
         "wdName":"<P106>"
      },
      {
         "description":"person who acts in a dramatic or comic production and works in film, television, theatre, or radio",
         "name":"actor",
         "numSitelinks":156,
         "type":"0",
         "wdName":"<Q33999>"
      }
   ]
}
```
