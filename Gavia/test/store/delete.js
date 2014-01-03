(function () {
	'use strict';
	var db = new Gavia('store.delete', {
		keyPath: {
			keyPath: 'id'
		},
		withoutKeyPath: {

		},
		withAutoIncrement: {
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('delete', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5];
				$.when.apply(null, array.map(function (x) {
					var record = db.keyPath.create(x);
					record.num = 'num-' + x;
					return record.save().promise;
				})).then(function () {
					return $.when.apply(null, array.map(function (x) {
						var record = db.withoutKeyPath.create();
						record.id = x;
						record.num = 'num-' + x;
						return record.save(x).promise;
					}));
				}).then(function () {
					return $.when.apply(null, array.map(function (x) {
						var record = db.withAutoIncrement.create();
						record.id = x;
						record.num = 'num-' + x;
						return record.save().promise;
					}));
				}).done(function () {
					done();
				});
			});
			after(function (done) {
				indexedDB.deleteDatabase('store.delete');
				done();
			});

			it('with keyPath', function (done) {
				db.keyPath.find(3).then(function (record) {
					assert.equal('num-3', record.num);
					return db.keyPath.delete(3);
				}).then(function () {
					return db.keyPath.find(3);
				}).done(function (record) {
					assert.equal(undefined, record);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('without keyPath', function (done) {
				db.withoutKeyPath.find(3).then(function (record) {
					assert.equal('num-3', record.num);
					return db.withoutKeyPath.delete(3);
				}).then(function () {
					return db.withoutKeyPath.find(3);
				}).done(function (record) {
					assert.equal(undefined, record);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('with AutoIncrement', function (done) {
				db.withAutoIncrement.find(3).then(function (record) {
					assert.equal('num-3', record.num);
					return db.withAutoIncrement.delete(3);
				}).then(function () {
					return db.withAutoIncrement.find(3);
				}).done(function (record) {
					assert.equal(undefined, record);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('not exist', function (done) {
				db.keyPath.find(123).then(function (record) {
					assert.equal(undefined, record);
					return db.keyPath.delete(123);
				}).fail(function () {
					assert(true);
					done();
				});
			});
		});
	});
}).apply(this);