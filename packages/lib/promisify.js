'use strict'

/**
 * Promisify a callback function
 * @param  {Function} fn     callback function
 * @param  {Object}   caller caller
 * @param  {String}   type   weapp-style|error-first, default to weapp-style
 * @return {Function}        promisified function
 */
var promisify = function(fn, caller, type) {
	if (type === void 0) type = 'weapp-style'

	return function() {
		var args = [],
			len = arguments.length
		while (len--) args[len] = arguments[len]

		return new Promise(function(resolve, reject) {
			switch (type) {
				case 'weapp-style':
					fn.call(
						caller,
						Object.assign({}, args[0], {
							success: function success(res) {
								resolve(res)
							},
							fail: function fail(err) {
								reject(err)
							}
						})
					)
					break
				case 'weapp-fix':
					fn.apply(caller, args.concat(resolve).concat(reject))
					break
				case 'error-first':
					fn.apply(
						caller,
						args.concat([
							function(err, res) {
								return err ? reject(err) : resolve(res)
							}
						])
					)
					break
			}
		})
	}
}

module.exports = {
	promisify
}
