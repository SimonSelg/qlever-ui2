---
layout: page
title: Overview
category: backend
order: 1
---

The Backend provides a few REST APIs to supply functionality to the frontend. 

It provides the following REST APIs:

- Wikidata Identifier Resolving
- Wikidata Prefix Search
- Wikidata Extension Suggestion
- SPARQL Query Execution.

It needs to communicate with two other services:
- [QLever](https://github.com/ad-freiburg/QLever)
- [WikidataFrontend Entity Finder](https://github.com/joka921/WikidataFrontend)

The URLs of these two services can be configured using environment variables. Have a look at the README of the backend module. 

### Technical Details
The Backend is written in Javascript and can be run using [node.js](https://nodejs.org/en/). This allows for code sharing between the backend and the frontend.

The Backend uses [koa](https://github.com/koajs/koa) to offer REST Endpoints. 



