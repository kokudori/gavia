Gavia.Deferred = (function () {
	var State = {
		pending: 'pending',
		resolved: 'resolved',
		rejected: 'rejected'
	};
	var Deferred = function () {
		if (!(this instanceof Deferred))
			return new Deferred();
		this.state = State.pending;
		this.resolved = null;
		this.rejected = null;
		this.dones = [];
		this.fails = [];
	};
	Deferred.when = function () {
		var deferreds = arguments[0] instanceof Array
				? arguments[0]
				: [].slice.apply(arguments),
			results = [],
			_deferred = new Deferred();
		deferreds.forEach(function (deferred) {
			deferred.done(function () {
				var value = arguments.length === 1
					? arguments[0]
					: [].slice.apply(arguments);
				results.push(value);
				if (results.length === deferreds.length)
					_deferred.resolve.apply(_deferred, results);
			}).fail(function () {
				_deferred.reject.apply(_deferred, arguments);
			});
		});
		return _deferred;
	};
	Deferred.prototype = {
		resolve: function () {
			var args = arguments;
			if (this.state === State.pending) {
				this.state = State.resolved;
				this.resolved = args;
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
				this.rejected = args;
				this.fails.forEach(function (fail) {
					fail.apply(null, args);
				});
			}
			return this;
		},
		done: function (callback) {
			if (this.state === State.pending)
				this.dones.push(callback);
			else if (this.state === State.resolved)
				callback.apply(null, this.resolved);
			return this;
		},
		fail: function (callback) {
			if (this.state === State.pending)
				this.fails.push(callback);
			else if (this.state === State.rejected)
				callback.apply(null, this.rejected);
			return this;
		},
		then: function(doneFilter, failFilter) {
			var deferred = new Deferred();
			this.done(function () {
				var value = doneFilter.apply(null, arguments);
				if (value.done && value.fail) {
					value.done(function () {
						deferred.resolve.apply(deferred, arguments);
					}).fail(function () {
						deferred.reject.apply(deferred, arguments);
					});
				} else {
					deferred.resolve(value);
				}
			}).fail(function () {
				var value = failFilter.apply(null, arguments);
				if (value.done && value.fail) {
					value.done(function () {
						deferred.resolve.apply(deferred, arguments);
					}).fail(function () {
						deferred.reject.apply(deferred, arguments);
					});
				} else {
					deferred.reject(value);
				}
			});
			return deferred;
		},
		promise: function () {
			var self = this;
			return {
				done: function () {
					return Deferred.prototype.done.apply(self, arguments);
				},
				fail: function () {
					return Deferred.prototype.fail.apply(self, arguments);
				},
				then: function (doneFilter, failFilter) {
					return Deferred.prototype.then.call(self, doneFilter, failFilter);
				}
			};
		}
	};
	return Deferred;
})();