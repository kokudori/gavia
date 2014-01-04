Gavia.Store.fn.clear = function () {
	var Deferred = new Gavia.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			transaction = db.transaction([this.name], 'readwrite'),
			request = transaction.objectStore(this.name).clear();
		request.onsuccess = function () {
			Deferred.resolve();
			db.close();
		};
		request.onerror = function (event) {
			Deferred.reject();
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