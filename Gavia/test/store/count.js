(function () {
	'use strict';
	var db = new Gavia('store.count', {
		keyPath: {
			keyPath: 'id',
			index: true
		}
	});

	describe('Store', function () {
		describe('count', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				Gavia.Deferred.when.apply(null, array.map(function (x) {
					var record = db.keyPath.create(x);
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function (done) {
				indexedDB.deleteDatabase('store.count');
				done();
			});

			it('filter(predicate)', function (done) {
				db.keyPath.filter(function (record) {
					return record.id % 2 === 0;
				}, {
					count: true,
					offset: 2,
					limit: 4
				}).done(function (count) {
					assert.equal(2, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('filter(value)', function (done) {
				db.keyPath.filter(5, {
					count: true
				}).done(function (count) {
					assert.equal(1, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('filter(value) with offset', function (done) {
				db.keyPath.filter(5, {
					count: true,
					offset: 7
				}).done(function (count) {
					assert.equal(0, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upper', function (done) {
				db.keyPath.upper(3, {
					count: true,
					offset: 1,
					limit: 5
				}).done(function (count) {
					assert.equal(5, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upperThan', function (done) {
				db.keyPath.upperThan(3, {
					count: true,
					offset: 1,
					limit: 8
				}).done(function (count) {
					assert.equal(5, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lower', function (done) {
				db.keyPath.lower(3, {
					count: true,
					offset: 1,
					limit: 1
				}).done(function (count) {
					assert.equal(1, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lowerThan', function (done) {
				db.keyPath.lowerThan(3, {
					count: true,
					offset: 5,
					limit: 10
				}).done(function (count) {
					assert.equal(0, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('bound', function (done) {
				db.keyPath.bound(3, 6, {
					count: true,
					offset: 8
				}).done(function (count) {
					assert.equal(0, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('boundThan', function (done) {
				db.keyPath.boundThan(3, 6, {
					count: true,
					offset: 1,
					limit: 1
				}).done(function (count) {
					assert.equal(1, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('all', function (done) {
				db.keyPath.all({
					count: true,
					offset: 2,
					limit: 6
				}).done(function (count) {
					assert.equal(6, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).call(this);