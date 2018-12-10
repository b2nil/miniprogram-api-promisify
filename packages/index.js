'use strict'

import { promisify } from './lib/promisify'
import { simplifyArgs } from './lib/simplified-args'
import { makeObj } from './lib/utils'
import { requestQueue } from './lib/request-queue'
import {
	normalizePromisifiedAlipayApis,
	normalizeNoPromiseAlipayApis,
	toBeNormalized
} from './lib/normalize-alipay-apis'
import { genSpecialApis } from './lib/gen-special-apis'
import { onAndSyncApis, noPromiseApis, otherApis } from './lib/baseNativeApis'

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
			// 获取通过 webpack.DefinePlugin() 定义的平台全局变量：$platform
			platform = $platform
		}

		// 以 weixin api 为基础，抹平与其他平台的差异
		const baseApis = Object.assign({}, onAndSyncApis, noPromiseApis, otherApis)
		let api
		switch (platform) {
			case 'swan':
				api = Object.assign({}, swan)
				break
			case 'alipay':
				api = Object.assign({}, my)
				break
			case 'wechat':
				api = Object.assign({}, wx)
				break
		}

		let noPromiseMap = {}

		if (ignore) {
			if (Array.isArray(ignore)) {
				noPromiseMap = Object.assign({}, noPromiseApis, makeObj(ignore))
			} else {
				noPromiseMap = Object.assign({}, noPromiseApis, ignore)
			}
		} else {
			noPromiseMap = Object.assign({}, noPromiseApis)
		}

		// TODO: expose abort and progressUpdate methods of network apis
		Object.keys(baseApis).forEach((key) => {
			if (!noPromiseMap[key] && !onAndSyncApis[key] && key.substr(0, 2) !== 'on' && key.substr(-4) !== 'Sync') {
				baseApis[key] = promisify(
					function() {
						var args = [],
							len = arguments.length
						while (len--) args[len] = arguments[len]

						var fixArgs = args[0]
						var failFn = args.pop()
						var successFn = args.pop()

						// 还原简化参数
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

						if (platform === 'alipay') {
							const r = genSpecialApis(key, fixArgs) // 抹平 alipay 小程序 api 名称及入参差异
							const newKey = r.key
							fixArgs = Object.assign({}, r.options)

							if (!(newKey in api)) {
								console.warn(`支付宝小程序暂不支持 ${newKey}`)
							}

							// 若 api 不支持 promise 化，提醒用户手动将其添加至 ignore 清单
							try {
								fixArgs.success = successFn
								fixArgs.fail = failFn
							} catch (e) {
								console.log(`警告：'${key}' 不支持 Promise 化。请在注册插件时，手动将其添加至参数的 ignore 清单中。`)
								console.log(e)
							}

							// 网络请求采用队列进行处理
							if (requestFix && newKey === 'httpRequest') {
								return requestQueue(api, newKey).request.call(api, fixArgs)
							}

							return api[newKey].call(api, fixArgs)
						}

						// 若 api 不支持 promise 化，提醒用户手动将其添加至 ignore 清单
						try {
							fixArgs.success = successFn
							fixArgs.fail = failFn
						} catch (e) {
							console.log(`警告：'${key}' 不支持 Promise 化。请在注册插件时，手动将其添加至参数的 ignore 清单中。`)
							console.log(e)
						}

						// 网络请求采用队列进行处理
						if (requestFix && key === 'request') {
							return requestQueue(api, key).request.call(api, fixArgs)
						}

						return api[key].call(api, fixArgs)
					},
					baseApis,
					'weapp-fix'
				)
			} else {
				// 处理不支持 promise 化的 api 差异
				if (platform === 'alipay') {
					baseApis[key] = normalizeNoPromiseAlipayApis(key, baseApis)
				}
			}
		})

		// 抹平 alipay api 返回结果的差异
		if (platform === 'alipay') {
			let bak = {}
			for (let key in toBeNormalized) {
				bak[key] = baseApis[key]
				baseApis[key] = normalizePromisifiedAlipayApis(key, toBeNormalized[key], bak)
			}
		}

		Object.defineProperty(Vue.prototype, '$api', {
			get() {
				return baseApis
			}
		})
	}
}

export default index
