Gavia.Store.fn.clear = function () {
	var deferred = new Gavia.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			transaction = db.transaction([this.name], 'readwrite'),
			request = transaction.objectStore(this.name).clear();
		request.onsuccess = function () {
			deferred.resolve();
			db.close();
		};
		request.onerror = function (event) {
			deferred.reject();
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