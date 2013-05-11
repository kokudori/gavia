(function () {
	'use strict';

	Gavia('store.boundThan', {
		store: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('boundThan', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				$.when.apply(null, array.map(function (x) {
					var record = Gavia['store.boundThan'].store.create();
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.boundThan');
			});

			it('should be have a boundThan method', function () {
				assert.equal('function', typeof Gavia['store.boundThan'].store.boundThan);
			});
			it('boundThan(2, 8)', function (done) {
				Gavia['store.boundThan'].store.boundThan(2, 8).done(function (records) {
					assert.equal(5, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([3, 4, 5, 6, 7], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('boundThan(2, 8), offset: 2, limit: 2', function (done) {
				Gavia['store.boundThan'].store.boundThan(2, 8, {
					offset: 2,
					limit: 2
				}).done(function (records) {
					assert.equal(2, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([5, 6], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('boundThan(3, 6), offset: 1, limit: 2', function (done) {
				Gavia['store.boundThan'].store.boundThan(3, 6, {
					offset: 1,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(5, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('boundThan(3, 6), offset: 1, limit: 1', function (done) {
				Gavia['store.boundThan'].store.boundThan(3, 6, {
					offset: 1,
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