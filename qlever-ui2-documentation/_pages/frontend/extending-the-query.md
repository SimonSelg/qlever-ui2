---
layout: page
title: Extending the Query 
category: frontend
order: 4
---

Query Extension is the way to construct queries in QLever UI2.
You start with a small query and extend it. Then extend again, and again, until you are satisfied.

![example query]({{"assets/screenshots/query-extension-0.png" | relativize_url}})

You can extend a query with either an entity or a predicate. Start by searching for it:

![example query with search]({{"assets/screenshots/query-extension-1.png" | relativize_url}})

Then, select it (you can use the arrow keys to your select items in the results). 
QLever UI2 then tries to compute the best way to extend the query with your subject.
.

![example query extension computation]({{"assets/screenshots/query-extension-2.png" | relativize_url}})

If extensions are found, the best extension will be used. 

![extended example query]({{"assets/screenshots/query-extension-3.png" | relativize_url}})

 You can use the "previous extension" / "next extension" Buttons to switch between other possible extensions.
