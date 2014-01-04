Gavia.Deffered = (function () {
	var State = {
		pending: 'pending',
		resolved: 'resolved',
		rejected: 'rejected'
	};
	var Deffered = function () {
		if (!(this instanceof Deffered))
			return new Deffered();
		this.state = State.pending;
		this.dones = [];
		this.fails = [];
	};
	Deffered.when = function () {
		// TODO implemented
	};
	Deffered.prototype = {
		resolve: function () {
			var args = arguments;
			if (this.state === State.pending) {
				this.state = State.resolved;
				this.dones.forEach(function (done) {
					done.apply(null, args);
				});
			}
			return this;
		},
		reject: function () {
			var args = arguments;
			if (this.state === State.pending) {
				this.state = State.rejected;
				this.fails.forEach(function (fail) {
					fail.apply(null, args);
				});
			}
			return this;
		},
		done: function (callback) {
			if (this.state === State.pending)
				this.dones.push(callback);
			return this;
		},
		fail: function (callback) {
			if (this.state === State.pending)
				this.fails.push(callback);
			return this;
		},
		then: function(doneFilter, failFilter) {
			var deffered = new Deffered();
			this.done(function () {
				var value = doneFilter.apply(null, arguments);
				if (value.done) {
					value.done(function () {
						deffered.resolve.apply(deffered, arguments);
					});
				} else {
					deffered.resolve(value);
				}
			}).fail(function () {
				var value = failFilter.apply(null, arguments);
				if (value.fail) {
					value.fail(function () {
						deffered.reject.apply(deffered, arguments);
					});
				} else {
					deffered.reject(value);
				}
			});
			return deffered;
		},
		promise: function () {
			var self = this;
			return {
				done: function () {
					return Deffered.prototype.done.apply(self, arguments);
				},
				fail: function () {
					return Deffered.prototype.fail.apply(self, arguments);
				},
				then: function (doneFilter, failFilter) {
					return Deffered.prototype.then.call(self, doneFilter, failFilter);
				}
			};
		}
	};
	return Deffered;
})();