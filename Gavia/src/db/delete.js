Gavia.prototype.delete = function () {
	var deferred = new Gavia.Deferred(),
		request = indexedDB.deleteDatabase(this.name);
	request.onsuccess = function () {
		deferred.resolve(this.name);
	}.bind(this);
	request.onerror = function () {
		deferred.reject(this.name);
	}.bind(this);
	delete Gavia[this.name];
	return deferred.promise();
};