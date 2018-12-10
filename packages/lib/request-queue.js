'use strict'

function requestQueue(api, key) {
	let Queue = {
		map: {},
		mq: [],
		running: [],
		MAX_REQUEST: 10,
		push(options) {
			options.t = +new Date()
			while (Queue.mq.indexOf(options.t) > -1 || Queue.running.indexOf(options.t) > -1) {
				options.t += (Math.random() * 10) >> 0
			}
			Queue.mq.push(options.t)
			Queue.map[options.t] = options
		},
		next() {
			let me = Queue

			if (Queue.mq.length === 0) return

			if (Queue.running.length < Queue.MAX_REQUEST - 1) {
				let newOpts = Queue.mq.shift()
				let options = Queue.map[newOpts]
				let completeFunc = options.complete
				options.complete = (...args) => {
					me.running.splice(me.running.indexOf(options.t), 1)
					delete me.map[options.t]
					completeFunc && completeFunc.apply(options, args)
					me.next()
				}
				Queue.running.push(options.t)
				return api[key](options)
			}
		},
		request(options) {
			Queue.push(options)
			return Queue.next()
		}
	}

	return Queue
}

module.exports = {
	requestQueue
}
