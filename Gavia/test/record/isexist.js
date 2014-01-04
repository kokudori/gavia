(function () {
	'use strict';
	var db = new Gavia('record.isExist', {
		keyPath: {
			keyPath: 'id'
		},
		withoutKeyPath: {

		},
		withAutoIncrement: {
			autoIncrement: true
		}
	});

	describe('Record', function () {
		describe('isExist', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5];
				Gavia.Deferred.when.apply(null, array.map(function (x) {
					var record = db.keyPath.create(x);
					record.num = 'num-' + x;
					return record.save().promise;
				})).then(function () {
					return Gavia.Deferred.when.apply(null, array.map(function (x) {
						var record = db.withoutKeyPath.create();
						record.id = x;
						record.num = 'num-' + x;
						return record.save(x).promise;
					}));
				}).then(function () {
					return Gavia.Deferred.when.apply(null, array.map(function (x) {
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
				indexedDB.deleteDatabase('record.isExist');
				done();
			});

			it('with keyPath', function (done) {
				db.keyPath.find(3).then(function (record) {
					return record.isExist();
				}).done(function (exist) {
					assert.equal(true, exist);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('without keyPath', function (done) {
				db.withoutKeyPath.find(3).then(function (record) {
					return record.isExist('id');
				}).done(function (exist) {
					assert.equal(true, exist);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('with AutoIncrement', function (done) {
				db.withAutoIncrement.find(3).then(function (record) {
					return record.isExist('id');
				}).done(function (exist) {
					assert.equal(true, exist);
					done();
				}).fail(function () {
					assert(false);
				});
			});

			it('into function', function (done) {
				db.keyPath.find(3).then(function (record) {
					return record.isExist(function (result) {
						return result.id === record.id && typeof result.num === 'undefined';
					});
				}).done(function (exist) {
					assert.equal(false, exist);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);