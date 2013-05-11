Gavia.Store.fn.all = function (option) {
	if (!option || option.count !== true) {
		return this.filter(function () {
			return true;
		}, option);
	}
	var deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	option = $.extend({
		index: null,
		offset: 0,
		limit: null
	}, option);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.name], 'readonly').objectStore(this.name);
		if (option.index)
			store = store.index(option.index);
		result = store.count();
		result.onsuccess = function (event) {
			var value = event.target.result,
				limit = option.limit || value;
			value = option.offset > value ? 0 : value - option.offset;
			value = limit >= value ? value : limit;
			deferred.resolve(value);
			db.close();
		}.bind(this);
		result.onerror = function (event) {
			var db = event.target.result;
			deferred.reject(key);
			db.close();
		};
		db.close();
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};