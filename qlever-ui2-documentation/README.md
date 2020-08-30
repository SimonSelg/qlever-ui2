# QLever UI2 Documentation Website

The documentation is realized using the static page generator `jekyll`.

## Installing Dependencies

```shell
cd qlever-ui2-documentation
gem install bundler
bundler install # install ruby dependencies
yarn # install npm dependencies
```

## Developing
```shell
yarn dev # starts dev server for the documetnation
```

Site will be available at [https://localhost:4000](https://localhost:4000)

## Building
```shell
yarn build
```

The result will be in the `_dist` folder. It has no dependencies. Just copy the files to your webserver.
