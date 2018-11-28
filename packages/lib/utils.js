var makeObj = function(arr) {
	var obj = {}
	arr.forEach(function(v) {
		return (obj[v] = 1)
	})
	return obj
}

module.exports = {
	makeObj
}
