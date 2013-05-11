(function () {
	'use strict';
	var db = Gavia('store.transaction', {
		store: {
			keyPath: 'id',
			index: true
		},
		other: {
			keyPath: 'id',
			index: true
		},
		another: {
			keyPath: 'id',
			index: true
		}
	});

	describe('Store', function () {
		describe('transaction', function () {
			afterEach(function (done) {
				$.when(
					db.store.clear(),
					db.other.clear(),
					db.another.clear()
				).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.transaction');
			});

			it('create 5records in once transaction', function (done) {
				db.store.transaction(function (store) {
					for (var i = 0; i < 5; i += 1) {
						store.add({ id: i + 1 });
					}
				}).then(function () {
					return db.store.all({ count: true });
				}).done(function (count) {
					assert.equal(5, count);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			// TODO Firefox20 is throw AbortError
			// https://developer.mozilla.org/en-US/docs/IndexedDB/IDBTransaction#abort

			//it('abort transaction', function (done) {
			//	db.store.transaction(function (store) {
			//		for (var i = 0; i < 5; i += 1) {
			//			store.add({ id: i + 1 });
			//		}
			//		return false;
			//	}).then(function () {
			//		return db.store.all({ count: true });
			//	}).done(function (count) {
			//		assert.equal(0, count);
			//		done();
			//	}).fail(function () {
			//		assert(false);
			//	});
			//});
			it('multiple storeObjects in transaction', function (done) {
				db.store.transaction(db.other, db.another, function (store, other, another) {
					var i = 0;
					for (i = 0; i < 5; i += 1) {
						store.add({ id: i + 1 });
					}
					for (i = 0; i < 4; i += 1) {
						other.add({ id: i + 1 });
					}
					for (i = 0; i < 3; i += 1) {
						another.add({ id: i + 1 });
					}
				}).then(function () {
					return $.when(
						db.other.all({ count: true }),
						db.another.all({ count: true })
					);
				}).done(function (other, another) {
					assert.equal(4, other);
					assert.equal(3, another);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);