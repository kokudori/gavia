(function () {
	'use strict';

	Gavia('store.upperThan', {
		store: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('upperThan', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				$.when.apply(null, array.map(function (x) {
					var record = Gavia['store.upperThan'].store.create();
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.upperThan');
			});

			it('should be have a upperThan method', function () {
				assert.equal('function', typeof Gavia['store.upperThan'].store.upperThan);
			});
			it('upperThan(5)', function (done) {
				Gavia['store.upperThan'].store.upperThan(5).done(function (records) {
					assert.equal(4, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([6, 7, 8, 9], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upperThan(5), offset: 2, limit: 2', function (done) {
				Gavia['store.upperThan'].store.upperThan(5, {
					offset: 2,
					limit: 2
				}).done(function (records) {
					assert.equal(2, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([8, 9], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upperThan(5), offset: 3, limit: 2', function (done) {
				Gavia['store.upperThan'].store.upperThan(5, {
					offset: 3,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(9, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upperThan(5), offset: 2, limit: 1', function (done) {
				Gavia['store.upperThan'].store.upperThan(5, {
					offset: 2,
					limit: 1
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(8, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);