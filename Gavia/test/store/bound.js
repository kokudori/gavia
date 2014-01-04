(function () {
	'use strict';

	Gavia('store.bound', {
		store: {
			keyPath: 'id',
			index: true
		}
	});

	describe('Store', function () {
		describe('bound', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				Gavia.Deferred.when.apply(null, array.map(function (x) {
					var record = Gavia['store.bound'].store.create(x);
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.bound');
			});

			it('should be have a bound method', function () {
				assert.equal('function', typeof Gavia['store.bound'].store.bound);
			});
			it('bound(2, 8)', function (done) {
				Gavia['store.bound'].store.bound(2, 8).done(function (records) {
					assert.equal(7, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([2, 3, 4, 5, 6, 7, 8], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('bound(2, 8), index: "id"', function (done) {
				Gavia['store.bound'].store.bound(2, 8, {
					index: 'id'
				}).done(function (records) {
					assert.equal(7, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([2, 3, 4, 5, 6, 7, 8], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('bound(2, 8), offset: 2, limit: 2', function (done) {
				Gavia['store.bound'].store.bound(2, 8, {
					offset: 2,
					limit: 2
				}).done(function (records) {
					assert.equal(2, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([4, 5], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('bound(3, 6), offset: 3, limit: 2', function (done) {
				Gavia['store.bound'].store.bound(3, 6, {
					offset: 3,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(6, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('bound(3, 6), offset: 2, limit: 1', function (done) {
				Gavia['store.bound'].store.bound(3, 6, {
					offset: 2,
					limit: 1
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(5, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);