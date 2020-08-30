---
layout: page
title: Installation
category: getting-started
---

### Quick Start

The easiest way to run QLever UI2 is to use the provided docker container.

First, make sure [Docker](https://www.docker.com/) is installed and running. This guide also expects [docker-compose](https://docs.docker.com/compose/) to be installed.

For full functionality of QLever UI2, two services need to be reachable: [QLever](https://github.com/ad-freiburg/QLever) and [WikidataFrontend](https://github.com/joka921/WikidataFrontend). You can configure their URLs in the `docker-compose.yml` file.

To build and start the container, run
```shell
# checkout repository
git clone https://github.com/SimonSelg/qlever-ui2
cd qlever-ui2

# adjust URLs of qlever and WikidataFrontend instances
vim docker-compose.yml

# build the docker-container if needed, and start it
docker-compose up
```

The App will be available on [http://\<machine ip\>:8080](http://\<machine ip\>:8080).

### Development Environment
For developing, a dockerless setup is recommended.

```shell
# install dependencies
yarn

# start the backend and the frontend dev server
yarn dev
```

Now the App will be available on [http://localhost:8080]([http://localhost:8080]).

The frontend supports [hot-reloading](https://github.com/gaearon/react-hot-loader). Just change a file in `qlever-ui2-frontend/src/`, and the change will be reflected inside the app. No page reload needed.
