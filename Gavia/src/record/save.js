Gavia.Record.fn.save = function (id) {
	var deferred = new Gavia.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.store.name], 'readwrite').objectStore(this.store.name),
			data = Object.keys(this).reduce(function (result, name) {
				result[name] = this[name];
				return result;
			}.bind(this), {}),
			request = (function () {
				if (id)
					return store.put(data, id);
				else
					return store.put(data);
			})();
		request.onsuccess = function (event) {
			result = event.target.result;
		};
		store.transaction.oncomplete = function () {
			deferred.resolve(result);
			db.close();
		};
		store.transaction.onerror = function (event) {
			deferred.reject();
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	}.bind(this);
	return Object.defineProperty(this, 'promise', {
		writable: true,
		value: deferred.promise()
	});
};