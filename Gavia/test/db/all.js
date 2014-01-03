(function () {
	'use strcit';

	describe('DB', function () {
		before(function () {
			Gavia('gavia.all', {
				hoge: {

				},
				piyo: {
					keyPath: 'id'
				},
				foo: {
					autoIncrement: true
				},
				bar: {
					keyPath: 'id',
					autoIncrement: true
				}
			});
		});
		after(function () {
			indexedDB.deleteDatabase('gavia.all');
		});

		describe('all', function () {
			it('BDObject should have be all method', function () {
				assert.equal('function', typeof Gavia['gavia.all'].all);
			});
			it('should get all StoreObject', function () {
				var stores = Gavia['gavia.all'].all();
				assert.equal(4, stores.length);
				var every = ['hoge', 'piyo', 'foo', 'bar'].every(function (name) {
					return stores.some(function (store) {
						return store.name === name;
					});
				});
				assert(every);
			});
		});
	});
}).apply(this);