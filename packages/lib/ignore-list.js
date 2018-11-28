'use strict'

// Methods not to be promisified
var ignoreList = [
	// 媒体
	'stopRecord',
	'getRecorderManager',
	'pauseVoice',
	'stopVoice',
	'pauseBackgroundAudio',
	'stopBackgroundAudio',
	'getBackgroundAudioManager',
	'createAudioContext',
	'createInnerAudioContext',
	'createVideoContext',
	'createCameraContext',

	// 位置
	'createMapContext',

	// 设备
	'canIUse',
	'startAccelerometer',
	'stopAccelerometer',
	'startCompass',
	'stopCompass',
	'onBLECharacteristicValueChange',
	'onBLEConnectionStateChange',

	// 界面
	'hideToast',
	'hideLoading',
	'showNavigationBarLoading',
	'hideNavigationBarLoading',
	'navigateBack',
	'createAnimation',
	'pageScrollTo',
	'createSelectorQuery',
	'createCanvasContext',
	'createContext',
	'drawCanvas',
	'hideKeyboard',
	'stopPullDownRefresh',

	// 拓展接口
	'arrayBufferToBase64',
	'base64ToArrayBuffer'
]

module.exports = {
	ignoreList
}
