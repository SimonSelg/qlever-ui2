---
layout: page
title: Installation
category: getting-started
---

### Quick Start

The easiest way to run QLever UI2 is to use the provided docker container. 

First, make sure [Docker](https://www.docker.com/) is installed and running. To build and start the container, run
```shell
git clone git@ad-git.informatik.uni-freiburg.de:ad/qlever-ui.git
cd qlever-ui
docker-compose up -d # this builds the docker-container if needed
```

The App will be available on [http://\<machine ip\>:8080](http://\<machine ip\>:8080). 

You can adjust some configuration `docker-compose.yaml`. For possible explanations of the config keys, have a look at the qlever-ui2-frontend README and the qlever-ui2-backend README. 

### Development Environment
For developing, a dockerless setup is recommended.

```shell
# install dependencies
yarn 

# start the backend and the frontend dev server
yarn dev
```

Now the App will be available on [http://localhost:8080]([http://localhost:8080]). 

The frontend supports [hot-reloading](https://github.com/gaearon/react-hot-loader). Just change a file in `frontend/src/`, and the change will be replected inside the app. No page reload needed.
