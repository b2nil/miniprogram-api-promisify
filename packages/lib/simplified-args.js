'use strict'

var simplifyArgs = {
	// network
	request: 'url',
	downloadFile: 'url',
	connectSocket: 'url',
	sendSocketMessage: 'data',

	// media
	previewImage: 'urls',
	getImageInfo: 'src',
	saveImageToPhotosAlbum: 'filePath',
	playVoice: 'filePath',
	playBackgroundAudio: 'dataUrl',
	seekBackgroundAudio: 'position',
	saveVideoToPhotosAlbum: 'filePath',

	// files
	saveFile: 'tempFilePath',
	getFileInfo: 'filePath',
	getSavedFileInfo: 'filePath',
	removeSavedFile: 'filePath',
	openDocument: 'filePath',

	// device
	setStorage: 'key,data',
	getStorage: 'key',
	removeStorage: 'key',
	openLocation: 'latitude,longitude',
	makePhoneCall: 'phoneNumber',
	setClipboardData: 'data',
	getConnectedBluetoothDevices: 'services',
	createBLEConnection: 'deviceId',
	closeBLEConnection: 'deviceId',
	getBLEDeviceServices: 'deviceId',
	startBeaconDiscovery: 'uuids',
	setScreenBrightness: 'value',
	setKeepScreenOn: 'keepScreenOn',

	// screen
	showToast: 'title',
	showLoading: 'title,mask',
	showModal: 'title,content',
	showActionSheet: 'itemList,itemColor',
	setNavigationBarTitle: 'title',
	setNavigationBarColor: 'frontColor,backgroundColor',

	// tabBar
	setTabBarBadge: 'index,text',
	removeTabBarBadge: 'idnex',
	showTabBarRedDot: 'index',
	hideTabBarRedDot: 'index',
	showTabBar: 'animation',
	hideTabBar: 'animation',

	// topBar
	setTopBarText: 'text',

	// navigator
	navigateTo: 'url',
	redirectTo: 'url',
	redirectTo: 'url',
	navigateBack: 'delta',
	reLaunch: 'url',

	// pageScroll
	pageScrollTo: 'scrollTop,duration'
}

module.exports = {
	simplifyArgs
}
