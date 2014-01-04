Gavia.Record.fn.delete = function (keyName) {
	var request,
		deferred = new Gavia.Deferred(),
		key = (function () {
			if (this.store.keyPath)
				return this[this.store.keyPath];
			if (typeof keyName === 'function')
				return keyName();
			if (keyName)
				return this[keyName];
		}).apply(this);
	if (!key) {
		deferred.reject('key does not setting.');
		return deferred.promise();
	}

	request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			store = db.transaction([this.store.name], 'readwrite').objectStore(this.store.name);
		store.delete(key);
		store.transaction.oncomplete = function () {
			deferred.resolve(key);
			db.close();
		};
		store.transaction.onerror = function (event) {
			deferred.reject(key);
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};