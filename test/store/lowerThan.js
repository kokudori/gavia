(function () {
	'use strict';

	Gavia('store.lowerThan', {
		store: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('lowerThan', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				$.when.apply(null, array.map(function (x) {
					var record = Gavia['store.lowerThan'].store.create();
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.lowerThan');
			});

			it('should be have a lowerThan method', function () {
				assert.equal('function', typeof Gavia['store.lowerThan'].store.lowerThan);
			});
			it('lowerThan(5)', function (done) {
				Gavia['store.lowerThan'].store.lowerThan(5).done(function (records) {
					assert.equal(4, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([1, 2, 3, 4], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lowerThan(5), offset: 2, limit: 2', function (done) {
				Gavia['store.lowerThan'].store.lowerThan(5, {
					offset: 2,
					limit: 2
				}).done(function (records) {
					assert.equal(2, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([3, 4], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lowerThan(5), offset: 3, limit: 2', function (done) {
				Gavia['store.lowerThan'].store.lowerThan(5, {
					offset: 3,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(4, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lowerThan(5), offset: 2, limit: 1', function (done) {
				Gavia['store.lowerThan'].store.lowerThan(5, {
					offset: 2,
					limit: 1
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(3, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);