'use strict'

import { promisify } from './lib/promisify'
import { ignoreList } from './lib/ignore-list'
import { simplifyArgs } from './lib/simplified-args'
import { makeObj } from './lib/utils'
import { requestQueue } from './lib/request-queue'

/**
 * Basic api promisify plugin for Vue-based miniprogram frameworks
 * @param   {import("vue").VueConstructor}  Vue   Vue constructor
 * @param   {Object}   options    options may contain three properties: platform, ignore and requestFix
 */
let _Vue
var index = {
	install(Vue, { platform = 'wechat', ignore, requestFix = true } = {}) {
		if (this.installed && _Vue === Vue) return
		this.installed = true
		_Vue = Vue

		if ($platform) {
			// get platform string from global variable set by webpack.DefinePlugin()
			platform = $platform
		}

		let _api, api
		switch (platform) {
			case 'swan':
				_api = Object.assign({}, swan)
				api = Object.assign({}, swan)
				break
			case 'alipay':
				_api = Object.assign({}, my)
				api = Object.assign({}, my)
				break
			default:
				_api = Object.assign({}, wx)
				api = Object.assign({}, wx)
				break
		}

		let noPromiseMap = {}

		if (ignore) {
			if (Array.isArray(ignore)) {
				noPromiseMap = makeObj(ignoreList.concat(ignore))
			} else {
				noPromiseMap = Object.assign({}, makeObj(ignoreList), ignore)
			}
		} else {
			noPromiseMap = Object.assign({}, makeObj(ignoreList))
		}

		Object.keys(_api).forEach((key) => {
			if (!noPromiseMap[key] && key.substr(0, 2) !== 'on' && key.substr(-4) !== 'Sync') {
				_api[key] = promisify(
					function() {
						var args = [],
							len = arguments.length
						while (len--) args[len] = arguments[len]

						var fixArgs = args[0]
						var failFn = args.pop()
						var successFn = args.pop()
						if (simplifyArgs[key] && typeof fixArgs !== 'object') {
							fixArgs = {}
							var ps = simplifyArgs[key]
							if (args.length) {
								ps.split(',').forEach(function(p, i) {
									if (args[i]) {
										fixArgs[p] = args[i]
									}
								})
							}
						}

						// Just in case when a key that should be ignored is not added in the built-in list,
						// warn the use to add it to ignore list manually when registering the plugin.
						try {
							fixArgs.success = successFn
							fixArgs.fail = failFn
						} catch (e) {
							console.log(`警告：'${key}' 不支持 Promise 化。请在注册插件时，手动将其添加至参数的 ignore 清单中。`)
							console.log(e)
						}

						if (requestFix && key === 'request') {
							return requestQueue(api).request.call(api, fixArgs)
						}
						return api[key].call(api, fixArgs)
					},
					_api,
					'weapp-fix'
				)
			}
		})

		Object.defineProperty(Vue.prototype, '$api', {
			get() {
				return _api
			}
		})
	}
}

export default index
