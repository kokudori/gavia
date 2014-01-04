(function () {
	'use strict';
	var deffered;

	describe('Deffered', function () {
		beforeEach(function (done) {
			deffered = new Gavia.Deffered();
			done();
		});

		it('done', function (done) {
			deffered.fail(function () {
				assert(false);
			}).done(function (value, other) {
				assert.equal(value, 1);
				assert.equal(other, 2);
				done();
			});
			deffered.resolve(1, 2);
		});
		it('fail', function (done) {
			deffered.done(function () {
				assert(false);
			}).fail(function (value, other) {
				assert.equal(value, 1);
				assert.equal(other, 2);
				done();
			});
			deffered.reject(1, 2);
		});
		it('then', function (done) {
			var _deffered = new Gavia.Deffered();
			deffered.then(function (value) {
				return value + 1;
			}).then(function (value) {
				assert.equal(value, 2);
				setTimeout(function () {
					_deffered.resolve(value + 1);
				}, 10);
				return _deffered.promise();
			}).done(function (value) {
				assert.equal(value, 3);
				done();
			}).fail(function () {
				assert(false);
			});
			deffered.resolve(1);
		});
		it('promise', function (done) {
			var promise = deffered.promise();
			assert(typeof promise.resolve === "undefined");
			assert(typeof promise.reject === "undefined");
			promise.done(function (value) {
				assert.equal(value, 100);
				done();
			}).fail(function () {
				assert(false);
			});
			deffered.resolve(100);
		});
		it('resolve', function (done) {
			deffered.resolve();
			deffered.done(function () {
				assert(false);
			}).fail(function () {
				assert(false);
			});
			deffered.resolve();
			setTimeout(function () {
				done();
			}, 10);
		});
		it('reject', function (done) {
			deffered.reject();
			deffered.done(function () {
				assert(false);
			}).fail(function () {
				assert(false);
			});
			deffered.reject();
			setTimeout(function () {
				done();
			}, 10);
		});
	});
})();