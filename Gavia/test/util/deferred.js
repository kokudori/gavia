(function () {
	'use strict';
	var deferred;

	describe('Deferred', function () {
		beforeEach(function (done) {
			deferred = new Gavia.Deferred();
			done();
		});

		it('done', function (done) {
			deferred.fail(function () {
				assert(false);
			}).done(function (value, other) {
				assert.equal(value, 1);
				assert.equal(other, 2);
				done();
			});
			deferred.resolve(1, 2);
		});
		it('fail', function (done) {
			deferred.done(function () {
				assert(false);
			}).fail(function (value, other) {
				assert.equal(value, 1);
				assert.equal(other, 2);
				done();
			});
			deferred.reject(1, 2);
		});
		it('then', function (done) {
			deferred.then(function (value) {
				return value + 1;
			}).then(function (value) {
				assert.equal(value, 2);
				return new Gavia.Deferred().resolve(value + 1).promise();
			}).done(function (value) {
				assert.equal(value, 3);
				done();
			}).fail(function () {
				assert(false);
			});
			deferred.resolve(1);
		});
		it('#when if success', function (done) {
			var _deferred = new Gavia.Deferred();
			Gavia.Deferred.when(deferred, _deferred).done(function () {
				done();
			}).fail(function () {
				assert(false);
			});
			deferred.resolve();
			_deferred.resolve();
		});
		it('#when if fail', function (done) {
			var _deferred = new Gavia.Deferred();
			Gavia.Deferred.when(deferred, _deferred).done(function () {
				assert(false);
			}).fail(function () {
				done();
			});
			deferred.resolve();
			_deferred.reject();
		});
		it('promise', function (done) {
			var promise = deferred.promise();
			assert(typeof promise.resolve === 'undefined');
			assert(typeof promise.reject === 'undefined');
			promise.done(function (value) {
				assert.equal(value, 100);
				done();
			}).fail(function () {
				assert(false);
			});
			deferred.resolve(100);
		});
		it('resolve', function (done) {
			deferred.resolve();
			deferred.done(function () {
				assert(true);
				done();
			}).fail(function () {
				assert(false);
			});
		});
		it('reject', function (done) {
			deferred.reject();
			deferred.done(function () {
				assert(false);
			}).fail(function () {
				assert(true);
				done();
			});
		});
	});
})();