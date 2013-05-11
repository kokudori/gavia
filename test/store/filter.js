(function () {
	'use strict';
	var db = new Gavia('store.filter', {
		keyPath: {
			keyPath: 'id',
			index: {
				unique: true,
				multiEntry: true
			}
		},
		withoutKeyPath: {

		},
		withAutoIncrement: {
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('filter(predicate)', function () {
			before(function (done) {
				var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
				indexedDB.deleteDatabase('store.filter');
				done();
			});

			describe('with keyPath', function (done) {
				it('normal', function (done) {
					db.keyPath.filter(function (result) {
						return result.id % 2 === 0;
					}).done(function (results) {
						assert.equal(4, results.length);
						assert.equal('num-4', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('index: "id"', function (done) {
					db.keyPath.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						index: 'id'
					}).done(function (results) {
						assert.equal(4, results.length);
						assert.equal('num-4', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('offset: 5', function (done) {
					db.keyPath.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						offset: 5
					}).done(function (results) {
						assert.equal(2, results.length);
						assert.equal('num-8', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('limit: 5', function (done) {
					db.keyPath.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						limit: 5
					}).done(function (results) {
						assert.equal(2, results.length);
						assert.equal('num-4', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('offset: 2, limit: 6', function (done) {
					db.keyPath.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						offset: 2,
						limit: 6
					}).done(function (results) {
						assert.equal(3, results.length);
						assert.equal('num-6', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});

			describe('without KeyPath', function (done) {
				it('offset: 2, limit: 6', function (done) {
					db.withoutKeyPath.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						offset: 2,
						limit: 6
					}).done(function (results) {
						assert.equal(3, results.length);
						assert.equal('num-6', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});

			describe('with AutoIncrement', function (done) {
				it('offset: 2, limit: 6', function (done) {
					db.withAutoIncrement.filter(function (result) {
						return result.id % 2 === 0;
					}, {
						offset: 2,
						limit: 6
					}).done(function (results) {
						assert.equal(3, results.length);
						assert.equal('num-6', results[1].num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});
		});
	});
}).call(this);