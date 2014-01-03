(function () {
	'use strict';

	Gavia('store.lower', {
		store: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('lower', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				$.when.apply(null, array.map(function (x) {
					var record = Gavia['store.lower'].store.create();
					record.num = 'num-' + x;
					return record.save().promise;
				})).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.lower');
			});

			it('should be have a lower method', function () {
				assert.equal('function', typeof Gavia['store.lower'].store.lower);
			});
			it('lower(5)', function (done) {
				Gavia['store.lower'].store.lower(5).done(function (records) {
					assert.equal(5, records.length);
					var ids = records.map(function (record) {
						return record.id;
					});
					assert.deepEqual([1, 2, 3, 4, 5], ids);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lower(5), offset: 2, limit: 2', function (done) {
				Gavia['store.lower'].store.lower(5, {
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
			it('lower(5), offset: 4, limit: 2', function (done) {
				Gavia['store.lower'].store.lower(5, {
					offset: 4,
					limit: 2
				}).done(function (records) {
					assert.equal(1, records.length);
					assert.deepEqual(5, records[0].id);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('lower(5), offset: 2, limit: 1', function (done) {
				Gavia['store.lower'].store.lower(5, {
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