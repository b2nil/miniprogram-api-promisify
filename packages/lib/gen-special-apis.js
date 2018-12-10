const apiDiff = {
	showActionSheet: {
		options: {
			change: [
				{
					old: 'itemList',
					new: 'items'
				}
			]
		}
	},
	showToast: {
		options: {
			change: [
				{
					old: 'title',
					new: 'content'
				},
				{
					old: 'icon',
					new: 'type'
				}
			]
		}
	},
	showLoading: {
		options: {
			change: [
				{
					old: 'title',
					new: 'content'
				}
			]
		}
	},
	setNavigationBarTitle: {
		alias: 'setNavigationBar'
	},
	setNavigationBarColor: {
		alias: 'setNavigationBar'
	},
	saveImageToPhotosAlbum: {
		alias: 'saveImage',
		options: {
			change: [
				{
					old: 'filePath',
					new: 'url'
				}
			]
		}
	},
	previewImage: {
		options: {
			set: [
				{
					key: 'current',
					value(options) {
						return options.urls.indexOf(options.current || options.urls[0])
					}
				}
			]
		}
	},
	getFileInfo: {
		options: {
			change: [
				{
					old: 'filePath',
					new: 'apFilePath'
				}
			]
		}
	},
	getSavedFileInfo: {
		options: {
			change: [
				{
					old: 'filePath',
					new: 'apFilePath'
				}
			]
		}
	},
	removeSavedFile: {
		options: {
			change: [
				{
					old: 'filePath',
					new: 'apFilePath'
				}
			]
		}
	},
	saveFile: {
		options: {
			change: [
				{
					old: 'tempFilePath',
					new: 'apFilePath'
				}
			]
		}
	},
	openLocation: {
		options: {
			set: [
				{
					key: 'latitude',
					value(options) {
						return String(options.latitude)
					}
				},
				{
					key: 'longitude',
					value(options) {
						return String(options.longitude)
					}
				}
			]
		}
	},
	uploadFile: {
		options: {
			change: [
				{
					old: 'name',
					new: 'fileName'
				}
			]
		}
	},
	getClipboardData: {
		alias: 'getClipboard'
	},
	setClipboardData: {
		alias: 'setClipboard',
		options: {
			change: [
				{
					old: 'data',
					new: 'text'
				}
			]
		}
	},
	makePhoneCall: {
		options: {
			change: [
				{
					old: 'phoneNumber',
					new: 'number'
				}
			]
		}
	},
	scanCode: {
		alias: 'scan',
		options: {
			change: [
				{
					old: 'onlyFromCamera',
					new: 'hideAlbum'
				}
			],
			set: [
				{
					key: 'type',
					value(options) {
						return (options.scanType && options.scanType[0].slice(0, -4)) || 'qr'
					}
				}
			]
		}
	},
	setScreenBrightness: {
		options: {
			change: [
				{
					old: 'value',
					new: 'brightness'
				}
			]
		}
	},
	login: {
		alias: 'getAuthCode',
		options: {
			set: [
				{
					key: 'scopes',
					value(options) {
						return (options.scopes && options.scopes) || 'auth_user'
					}
				}
			]
		}
	},
	getUserInfo: {
		alias: 'getAuthUserInfo'
	},
	request: {
		alias: 'httpRequest',
		options: {
			set: [
				{
					key: 'headers',
					value(options) {
						options = options || {}
						if (typeof options === 'string') {
							options = {
								url: options
							}
						}
						options['headers'] = { 'content-type': 'application/json' }
						if (options['header']) {
							for (let k in options['header']) {
								let lowerKey = k.toLocaleLowerCase()
								options['headers'][lowerKey] = options['header'][k]
							}
							delete options['header']
						}
						return options['headers']
					}
				}
			]
		}
	}
}

function genSpecialApis(key, options) {
	let keyAlias = key
	if (key === 'showModal') {
		options.cancelButtonText = options.cancelText
		options.confirmButtonText = options.confirmText || '确定'
		keyAlias = 'confirm'
		if (options.showCancel === false) {
			options.buttonText = options.confirmText || '确定'
			keyAlias = 'alert'
		}
	} else {
		Object.keys(apiDiff).forEach((item) => {
			const keyItem = apiDiff[item]
			if (key === item) {
				if (keyItem.alias) {
					keyAlias = keyItem.alias
				}
				if (keyItem.options) {
					const change = keyItem.options.change
					const set = keyItem.options.set
					if (change) {
						change.forEach((changeItem) => {
							options[changeItem.new] = options[changeItem.old]
						})
					}
					if (set) {
						set.forEach((setItem) => {
							options[setItem.key] =
								typeof setItem.value === 'function' ? setItem.value(options) : setItem.value
						})
					}
				}
			}
		})
	}

	return {
		key: keyAlias,
		options
	}
}

module.exports = {
	genSpecialApis
}
