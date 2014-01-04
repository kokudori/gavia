Gavia.Store.fn.find = function (key, option) {
	var Deferred = new Gavia.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.name], 'readonly').objectStore(this.name);
		if (option && option.index)
			store = store.index(option.index);
		result = store.get(key);
		result.onsuccess = function (event) {
			var value = event.target.result;
			if (typeof value === 'undefined') {
				Deferred.resolve(value);
				db.close();
				return;
			}
			Deferred.resolve(this.create().update(value));
			db.close();
		}.bind(this);
		result.onerror = function (event) {
			var db = event.target.result;
			Deferred.reject(key);
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		Deferred.reject(key);
		db.close();
	};
	return Deferred.promise();
};