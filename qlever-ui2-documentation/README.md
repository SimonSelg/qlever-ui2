# QLever UI2 Documentation Website

The documentation is realized using the static page generator `jekyll`.

## Installing Dependencies

```shell
cd qlever-ui2-documentation
gem install bundler
bundler install
```

## Developing
```shell
bundler exec jekyll serve
```

Site will be available at [https://localhost:4000](https://localhost:4000)

## Building
```shell
bundler exec jekyll build
```

The result will be in the `_dist` folder. It has no dependencies. Just copy the files to your webserver.
