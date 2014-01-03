(function () {
	'use strict';
	var db = new Gavia('store.select', {
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
		describe('filter(value)', function () {
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
				indexedDB.deleteDatabase('store.select');
				done();
			});

			describe('with keyPath', function (done) {
				it('normal', function (done) {
					db.keyPath.filter(5).done(function (result) {
						assert.equal('num-5', result.num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('offset: 5', function (done) {
					db.keyPath.filter(5, {
						offset: 5
					}).done(function (result) {
						assert.equal(undefined, null);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('limit: 5', function (done) {
					db.keyPath.filter(5, {
						limit: 5
					}).done(function (result) {
						assert.equal('num-5', result.num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
				it('offset: 2, limit: 2', function (done) {
					db.keyPath.filter(5, {
						offset: 2,
						limit: 2
					}).done(function (result) {
						assert.equal('num-5', result.num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});

			describe('without KeyPath', function (done) {
				it('offset: 2, limit: 2', function (done) {
					db.withoutKeyPath.filter(5, {
						offset: 2,
						limit: 2
					}).done(function (result) {
						assert.equal('num-5', result.num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});

			describe('with AutoIncrement', function (done) {
				it('offset: 2, limit: 2', function (done) {
					db.withAutoIncrement.filter(5, {
						offset: 2,
						limit: 2
					}).done(function (result) {
						assert.equal('num-5', result.num);
						done();
					}).fail(function () {
						assert(false);
					});
				});
			});
		});
	});
}).call(this);