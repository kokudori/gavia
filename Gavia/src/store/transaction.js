var transaction = function (store) {
	return {
		add: function (value, key) {
			if (key)
				store.add(value, key).onerror = function () {
					console.log('errored');
				};
			store.add(value).onerror = function () {
				console.log('errored');
			};
		},
		put: function (value, key) {
			if (key)
				store.put(value, key);
			store.put(value);
		},
		remove: function (key) {
			store.delete(key);
		}
	};
};

Gavia.Store.fn.transaction = function () {
	var args = [].slice.apply(arguments),
		stores = [this].concat(args.splice(0, args.length - 1)),
		callback = args[args.length - 1],
		deferred = new Gavia.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			names = stores.map(function (store) {
				return store.name;
			}),
			tx = db.transaction(names, 'readwrite'),
			abort = callback.apply(null, stores.map(function (store) {
				return transaction(tx.objectStore(store.name));
			}));
		tx.oncomplete = function () {
			deferred.resolve();
			db.close();
		};
		tx.onerror = function () {
			if (abort !== false)
				deferred.reject();
			else
				deferred.resolve();
			db.close();
		};
		if (abort === false)
			tx.abort();
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};