# api-playground

This repository serves as my personal playground for APIs and includes a basic cache. I have provided some comments in the [updater.js](updater.js) file as well as the [API files](apis) for the [Atlas Academy FGO Game Data API](https://api.atlasacademy.io/docs#/) that I am providing as an example.

If you're here for FGO stuff, I also have a backup of my scripts related to that in the 'personal' branch.

## ApiManager

The main utility in this repository is the [ApiManager](utils/ApiManager.js) class. It contains all the data to your API.

```js
constructor(name, url);
```

`name` is the name of the API (ideally lowercase, no spaces). Will be used as directory name in `./cache/`!  
`url` is the base url to the API

### setInfoEndpoint

```js
setInfoEndpoint(endpoint, callback);
```

`endpoint` is the endpoint where the version info is.  
`callback` (optional) function to run on the data returned by the endpoint. Basically I needed this because the atlasacademy api has both version infos under the same `info` endpoint.

### addEndpoint

```js
addEndpoint(name, endpoint);
```

`name` is the name of the endpoint (and also used as filename in `./cache`)  
`endpoint` is the endpoint you want to cache. So for `example.com/api/cute-kittens` you put `cute-kittens`.

### run

```js
async run()
```

Function used in [updater.js](updater.js) to update the cache.

### some internal stuff

```js
// other methods used internally by run()
touchDirs() // please run this first to avoid errors. nodejs is silly
async getVersions() // returns the versions
async updateEndpoint(endpoint) // updates a specific endpoint (takes an ApiEndpoint instance as arg)
shouldUpdate(versions) // tells you if the versions from getVersions differ
```

the saved endpoints from `addEndpoint` are in `this.endpoints`, already ApiEndpoint instances, so ideally just take em from there if you want to force update a specific endpoint.

the localVersion is pulled from `this.path + "/__version_info.json"` and usually updated by `run()`. Internal utils usually return `null` in case of errors (like the file not existing) and these cases are handled with default values.

## License

See [LICENSE](LICENSE) or visit  
[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-1.png).net](http://www.wtfpl.net/)
