# miniprogram-api-promisify

> A plugin that promisifies api calls for Vue-based miniprogram frameworks, and supports weixin, baidu and alipay miniprogram apis.

## Install

```bash
npm i miniprogram-api-promisify --save
```

## Usage

### Basic Usage

Import the plugin and register it in your app entry file:

```javascript
// app.js
import promisify from 'miniprogram-api-promisify'

Vue.use(promisify, {
    platform: 'wechat' || 'alipay' || 'swan' // default: 'wechat'
})
```

Once the plugin is imported and registered properly, you can write your promisified api calls in the dot chaining style:

```javascript
this.$api
    .login()
    .then(res => {
        // do something on success
    })
    .catch(e => {
        // do something on fail
    })
```

### Ignore APIs

There is a built-in list of apis that does not need to be promisified. In case you want to add your own ignore list, you can pass them in the plugin options either as an array or as an object.

```javascript
// app.js
import promisify from 'miniprogram-api-promisify'

Vue.use(promisify, {
    platform: platformString,
    ignore: [apiFunc1, apiFunc2] // passing array
    // ignore: { apiFunc1: false, apiFunc2: true } // passing object
})
```

### Simplify API parameters

`weapp-style` functions always need an Object parameter, and luckily, this plugin can simplify it, like this:

```javascript
Vue.use(promisify);

// wx.getStorage({ key: 'mykey' });
this.$api.getStorage('mykey');

// wx.request({ url: myurl });
this.$api.request(myurl);

// wx.openLocation({ latitude: 0, longitude: 0 });
this.$api.openLocation(0, 0);
```

Check [here](./packages/lib/simplified-args.js) to see what api can be simplified.

### Set up platform string as a global variable

For vue-based miniprogram frameworks that supports wexin, aplipay and baidu miniprograms, platform string can be obtained by setting it as a global variable through `webpack.DefinePlugin` in the webpack configuration file.

```javascript
// webpack.config.js
const webpack = require('webpack')

plugins: [
    // add this to the plugin settings
    new webpack.DefinePlugin({
        // use $platform to simplify plugin registering
        $platform: JSON.stringify(platform)
    })
],
```

In this case, there is no need to pass platform string in the plugin options if you set up the global variable `$platform` as shown above.

Or you can directly pass whatever you named the global variable in `webpack.DefinePlugin` settings as a property of the plugin options:

```javascript
// app.js
import promisify from 'miniprogram-api-promisify'

Vue.use(promisify, {
    platform: whateverYouCalledIt,
    ignore: ...
})
```

## Todo

- [ ] Isomorphic api calls for different miniprogram platforms

## Credits

This project is basically a wrapper of [wepy's](https://github.com/Tencent/wepy/tree/2.0.x/packages/use-promisify) `use-promisify` library as a plugin for Vue-based miniprogram frameworks, with enhancement to support alipay and baidu miniprogram apis as well.