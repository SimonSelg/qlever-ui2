---
layout: page
title: Wikidata Query Execution
category: backend
order: 5
---

Executes the Wikidata Query on the QLever Engine.

### API
`/api/qlever/<query>/<amount?>`, where `<query>` is an [base64url](https://tools.ietf.org/html/rfc4648#section-5) -encoded sparql query and the optional `<amount?>` controls the maximum amount of results to return. Default value is 100.

#### Example
<code class="highlighter-rouge highlighter-rouge--big">GET /api/UFJFRklYIHdkOiA8aHR0cDovL3d3dy53aWtpZGF0YS5vcmcvZW50aXR5Lz4NClBSRUZJWCB3ZHQ6IDxodHRwOi8vd3d3Lndpa2lkYXRhLm9yZy9wcm9wL2RpcmVjdC8-DQpQUkVGSVggcmRmczogPGh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSM-DQpTRUxFQ1QgP2FjdG9yTGFiZWwgV0hFUkUgew0KICA_YWN0b3Igd2R0OlAxMDYgd2Q6UTMzOTk5IC4NCiAgP2FjdG9yIHJkZnM6bGFiZWwgP2FjdG9yTGFiZWwgLg0KICA_YWN0b3Igd2R0OlAxNDExIHdkOlExMDM5MTYgLg0KICA_YWN0b3Igd2R0OlAyNyB3ZDpRMTgzIC4NCiAgRklMVEVSIGxhbmdNYXRjaGVzKGxhbmcoP2FjdG9yTGFiZWwpLCAiZW4iKQ0KfQ/100</code>

```json
{
   "query":"PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nSELECT ?actorLabel WHERE {\n  ?actor wdt:P106 wd:Q33999 .\n  ?actor rdfs:label ?actorLabel .\n  ?actor wdt:P1411 wd:Q103916 .\n  ?actor wdt:P27 wd:Q183 .\n  FILTER langMatches(lang(?actorLabel), \"en\")\n}",
   "status":"OK",
   "resultsize":"1",
   "selected":[
      "?actorLabel"
   ],
   "runtimeInformation":{
      "description":"Join on ?actor",
      "result_rows":1,
      "result_cols":2,
      "column_names":[
         "?actor",
         "?actorLabel"
      ],
      "total_time":0.0,
      "operation_time":0.0,
      "was_cached":false,
      "details":null,
      "children":[
         {
            "description":"Join on ?actor",
            "result_rows":1,
            "result_cols":2,
            "column_names":[
               "?actor",
               "?actorLabel"
            ],
            "total_time":0.0,
            "operation_time":0.0,
            "was_cached":false,
            "details":null,
            "children":[
               {
                  "description":"Join on ?actor",
                  "result_rows":1,
                  "result_cols":1,
                  "column_names":[
                     "?actor"
                  ],
                  "total_time":0.0,
                  "operation_time":0.0,
                  "was_cached":false,
                  "details":null,
                  "children":[
                     {
                        "description":"IndexScan ?actor <http://www.wikidata.org/prop/direct/P1411> <http://www.wikidata.org/entity/Q103916>",
                        "result_rows":663,
                        "result_cols":1,
                        "column_names":[
                           "?actor"
                        ],
                        "total_time":0.0,
                        "operation_time":0.0,
                        "was_cached":true,
                        "details":{
                           "original_operation_time":0.0,
                           "original_total_time":0.0
                        },
                        "children":[

                        ]
                     },
                     {
                        "description":"IndexScan ?actor <http://www.wikidata.org/prop/direct/P27> <http://www.wikidata.org/entity/Q183>",
                        "result_rows":225383,
                        "result_cols":1,
                        "column_names":[
                           "?actor"
                        ],
                        "total_time":0.0,
                        "operation_time":0.0,
                        "was_cached":true,
                        "details":{
                           "original_operation_time":0.0,
                           "original_total_time":0.0
                        },
                        "children":[

                        ]
                     }
                  ]
               },
               {
                  "description":"IndexScan ?actor @en@<http://www.w3.org/2000/01/rdf-schema#label> ?actorLabel",
                  "result_rows":42426063,
                  "result_cols":2,
                  "column_names":[
                     "?actor",
                     "?actorLabel"
                  ],
                  "total_time":0.0,
                  "operation_time":0.0,
                  "was_cached":true,
                  "details":{
                     "original_operation_time":258.0,
                     "original_total_time":258.0
                  },
                  "children":[

                  ]
               }
            ]
         },
         {
            "description":"IndexScan ?actor <http://www.wikidata.org/prop/direct/P106> <http://www.wikidata.org/entity/Q33999>",
            "result_rows":201749,
            "result_cols":1,
            "column_names":[
               "?actor"
            ],
            "total_time":0.0,
            "operation_time":0.0,
            "was_cached":true,
            "details":{
               "original_operation_time":1.0,
               "original_total_time":1.0
            },
            "children":[

            ]
         }
      ]
   },
   "res":[
      [
         "\"Emil Jannings\"@en"
      ]
   ],
   "time":{
      "total":"8.083ms",
      "computeResult":"7.995ms"
   }
}
```

