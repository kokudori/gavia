(function () {
	'use strict';
	Gavia('store.find', {
		keyPath: {
			keyPath: 'id',
			index: true
		},
		withoutKeyPath: {

		},
		withAutoIncrement: {
			autoIncrement: true
		}
	});

	describe('Store', function () {
		describe('find', function () {
			before(function (done) {
				var record = Gavia['store.find'].keyPath.create(100);
				record.name = 'kokudori';
				record.age = 20;
				record.save().promise.then(function () {
					var record = Gavia['store.find'].withoutKeyPath.create();
					record.id = 123;
					record.hogehoge = 'hoge';
					return record.save(234).promise;
				}).then(function () {
					var record = Gavia['store.find'].withAutoIncrement.create();
					record.piyopiyo = 'piyo';
					return record.save().promise;
				}).done(function () {
					done();
				});
			});
			after(function () {
				indexedDB.deleteDatabase('store.find');
			});

			it('with keyPath', function (done) {
				Gavia['store.find'].keyPath.find(100).done(function (result) {
					assert.equal('kokudori', result.name);
					assert.equal(20, result.age);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('with keyPath use index', function (done) {
				Gavia['store.find'].keyPath.find(100, {
					index: 'id'
				}).done(function (result) {
					assert.equal('kokudori', result.name);
					assert.equal(20, result.age);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('without keyPath', function (done) {
				Gavia['store.find'].withoutKeyPath.find(234).done(function (result) {
					assert.equal(123, result.id);
					assert.equal('hoge', result.hogehoge);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('with AutoIncrement', function (done) {
				Gavia['store.find'].withAutoIncrement.find(1).done(function (result) {
					assert.equal('piyo', result.piyopiyo);
					done();
				}).fail(function () {
					assert(false);
				});
			});
			it('not found', function (done) {
				Gavia['store.find'].keyPath.find(123).done(function (result) {
					assert.equal(undefined, result);
					done();
				}).fail(function (result) {
					assert(false);
				});
			});
		});
	});
}).call(this);