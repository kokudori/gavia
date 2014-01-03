(function () {
	'use strict';

	Gavia('store.upper', {
		store: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('upper', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				$.when.apply(null, array.map(function (x) {
					var record = Gavia['store.upper'].store.create();
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.upper');
			});

			it('should be have a upper method', function () {
				assert.equal('function', typeof Gavia['store.upper'].store.upper);
			});
			it('upper(5)', function (done) {
				Gavia['store.upper'].store.upper(5).done(function (records) {
					assert.equal(5, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([5, 6, 7, 8, 9], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upper(5), offset: 2, limit: 2', function (done) {
				Gavia['store.upper'].store.upper(5, {
					offset: 2,
					limit: 2
				}).done(function (records) {
					assert.equal(2, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([7, 8], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upper(5), offset: 4, limit: 2', function (done) {
				Gavia['store.upper'].store.upper(5, {
					offset: 4,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(9, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('upper(5), offset: 2, limit: 1', function (done) {
				Gavia['store.upper'].store.upper(5, {
					offset: 2,
					limit: 1
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(7, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);