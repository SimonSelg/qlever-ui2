# Possible QLever Bugs

This is a list of possible [QLever](https://github.com/ad-freiburg/QLever) bugs that I encountered during the project. 

## bug in entity suggestion

```SPARQL
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?rs_out_actor ?rs_out_variable_P26 ?rs_in_actor (COUNT(?rs_out_actor) AS ?count1) (COUNT(?rs_out_variable_P26) AS ?count2) (COUNT(?rs_in_actor) AS ?count3) WHERE {
  ?actor wdt:P106 wd:Q33999 .
  ?actor wdt:P26 ?variable_P26 .
  OPTIONAL { ?actor ?rs_out_actor wd:Q213411 . }
  OPTIONAL { ?variable_P26 ?rs_out_variable_P26 wd:Q213411 . }
  OPTIONAL { wd:Q213411 ?rs_in_actor ?actor . }
  OPTIONAL { wd:Q213411 ?rs_in_variable_P26 ?variable_P26 . }
}
GROUP BY ?rs_out_actor ?rs_out_variable_P26 ?rs_in_actor
```

does not produce any output, but without the last optional it works

## query fails on first try
there are queries that fail on the first try, but work on the second. we use that as a workaround in qlever-ui2-backend
todo: add examples here
