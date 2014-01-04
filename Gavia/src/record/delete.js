Gavia.Record.fn.delete = function (keyName) {
	var request,
		Deferred = new Gavia.Deferred(),
		key = (function () {
			if (this.store.keyPath)
				return this[this.store.keyPath];
			if (typeof keyName === 'function')
				return keyName();
			if (keyName)
				return this[keyName];
		}).apply(this);
	if (!key) {
		Deferred.reject('key does not setting.');
		return Deferred.promise();
	}

	request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			store = db.transaction([this.store.name], 'readwrite').objectStore(this.store.name);
		store.delete(key);
		store.transaction.oncomplete = function () {
			Deferred.resolve(key);
			db.close();
		};
		store.transaction.onerror = function (event) {
			Deferred.reject(key);
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		Deferred.reject();
		db.close();
	};
	return Deferred.promise();
};