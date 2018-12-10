function progress(task, promise) {
	return (cb) => {
		if (task) {
			task.onProgressUpdate(cb)
		}
		return promise
	}
}

function abort(task, promise) {
	return () => {
		if (task) {
			task.abort()
		}
		return promise
	}
}

const toBeNormalized = {
	saveFile: 'saveFile',
	downloadFile: 'downloadFile',
	chooseImage: 'chooseImage',
	getClipboardData: 'getClipboard',
	scanCode: 'scan',
	request: 'httpRequest',
	login: 'getAuthCode',
	getUserInfo: 'getAuthUserInfo'
}

function normalizePromisifiedAlipayApis(key, keyAlias, api) {
	return (options) => {
		let task = null

		const promise = new Promise((resolve, reject) => {
			api
				[key](options)
				.then((res) => {
					switch (keyAlias) {
						case 'saveFile':
							res.savedFilePath = res.apFilePath
							break
						case 'downloadFile':
							res.tempFilePath = res.apFilePath
							break
						case 'chooseImage':
							res.tempFilePaths = res.apFilePath
							break
						case 'getClipboard':
							res.data = res.text
							break
						case 'scan':
							res.result = res.code
							break
						case 'httpRequest':
							res.statusCode = res.status
							delete res.status
							res.header = res.headers
							delete res.headers
							break
						case 'getAuthCode':
							res.code = res.authCode
							delete res.authCode
							break
						case 'getAuthUserInfo':
							let rst = {}
							for (let k in res) {
								rst[k === 'avatar' ? 'avatarUrl' : k] = res[k]
							}
							res = Object.assign({}, { userInfo: rst })
							break
					}
					resolve(res)
				})
				.catch((e) => {
					reject(e)
				})

			task = api[key](options)
		})

		if (keyAlias === 'uploadFile' || keyAlias === 'downloadFile') {
			promise.progress = progress(task, promise)
			promise.abort = abort(task, promise)
		}

		if (keyAlias === 'httpRequest') {
			promise.abort = abort(task, promise)
		}

		return promise
	}
}

function normalizeNoPromiseAlipayApis(key, api) {
	return (...args) => {
		let arg1, arg2
		switch (key) {
			case 'getStorageSync':
				arg1 = args[0]
				if (arg1 !== null) {
					return api[key]({ key: arg1 }).data || ''
				}
				return console.log('getStorageSync 传入参数错误')
			case 'setStorageSync':
				arg1 = args[0]
				arg2 = args[1]
				if (arg1 != null) {
					return api[key]({
						key: arg1,
						data: arg2
					})
				}
				return console.log('setStorageSync 传入参数错误')
			case 'removeStorageSync':
				arg1 = args[0]
				if (arg1 != null) {
					return api[key]({ key: arg1 })
				}
				return console.log('removeStorageSync 传入参数错误')
			case 'createSelectorQuery':
				const query = api[key]()
				query.in = function() {
					return query
				}
				return query
		}

		return api[key].apply(api, args)
	}
}

module.exports = {
	normalizePromisifiedAlipayApis,
	normalizeNoPromiseAlipayApis,
	toBeNormalized
}
