'use strict'

function requestQueue(api) {
	let Queue = {
		map: {},
		mq: [],
		running: [],
		MAX_REQUEST: 5,
		push(param) {
			param.t = +new Date()
			while (Queue.mq.indexOf(param.t) > -1 || Queue.running.indexOf(param.t) > -1) {
				param.t += (Math.random() * 10) >> 0
			}
			Queue.mq.push(param.t)
			Queue.map[param.t] = param
		},
		next() {
			let me = Queue

			if (Queue.mq.length === 0) return

			if (Queue.running.length < Queue.MAX_REQUEST - 1) {
				let newone = Queue.mq.shift()
				let obj = Queue.map[newone]
				let oldComplete = obj.complete
				obj.complete = (...args) => {
					me.running.splice(me.running.indexOf(obj.t), 1)
					delete me.map[obj.t]
					oldComplete && oldComplete.apply(obj, args)
					me.next()
				}
				Queue.running.push(obj.t)
				return api.request(obj)
			}
		},
		request(obj) {
			obj = obj || {}
			obj = typeof obj === 'string' ? { url: obj } : obj

			Queue.push(obj)

			return Queue.next()
		}
	}

	return Queue
}

module.exports = {
	requestQueue
}
