(function () {
	'use strcit';

	var db = new Gavia('gavia.gavia', {
		hoge: {

		},
		piyo: {
			keyPath: 'id'
		},
		fuga: {
			autoIncrement: true
		},
		bar: {
			keyPath: 'id',
			autoIncrement: true
		}
	});

	describe('Gavia', function () {
		describe('property', function () {
			after(function () {
				indexedDB.deleteDatabase('gavia.gavia');
			});

			it('Gavia.DBName should be have a DBObject', function () {
				assert.equal(db, Gavia['gavia.gavia']);
			});
			it('Gavia.DBName.StoreName should be have a StoreObject', function () {
				assert.equal(db.hoge, Gavia['gavia.gavia'].hoge);
				assert.equal(db.piyo, Gavia['gavia.gavia'].piyo);
				assert.equal(db.foo, Gavia['gavia.gavia'].foo);
				assert.equal(db.bar, Gavia['gavia.gavia'].bar);
			});
		});
	});
}).apply(this);