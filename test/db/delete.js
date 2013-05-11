(function () {
	'use strict';

	describe('DB', function () {
		describe('delete', function () {
			before(function () {
				Gavia('db.hoge', {
					store: {}
				});
				Gavia('db.piyo', {
					store: {}
				});
			});
			after(function () {
				indexedDB.deleteDatabase('db.hoge');
				indexedDB.deleteDatabase('db.piyo');
			});

			it('DBObject should be have a delete method', function () {
				assert.equal('function', typeof Gavia['db.hoge'].delete);
				assert.equal('function', typeof Gavia['db.piyo'].delete);
			});
			it('delete property by Gavia if delete db', function () {
				Gavia['db.hoge'].delete();
				assert.equal(false, 'db.hoge' in Gavia);
			});
			it('actually delete db', function (done) {
				Gavia['db.piyo'].delete().done(function () {
					assert(true);
					done();
				}).fail(function () {
					assert(false);
				});
			});
		});
	});
}).apply(this);