Store.getKeyRange = function (mode, left, right) {
	switch (mode) {
		case 'upper':
			return IDBKeyRange.upperBound(left);
		case 'upperThan':
			return IDBKeyRange.upperBound(left, true);
		case 'lower':
			return IDBKeyRange.lowerBound(left);
		case 'lowerThan':
			return IDBKeyRange.lowerBound(left, true);
		case 'bound':
			return IDBKeyRange.bound(left, right);
		case 'boundThan':
			return IDBKeyRange.bound(left, right, true, true);
		case 'only':
			return IDBKeyRange.only(left);
		case 'filter':
			return null;
		default:
			throw 'no match key range';
	}
};

Store.fetch = function (context, mode, value, callback, option, ext) {
	var deferred = new Gavia.Deferred(),
		request = indexedDB.open(context.db.name, context.db.version);
	option = extend({
		direction: Gavia.Store.direction.next,
		index: null,
		offset: 0,
		limit: null
	}, option);
	request.onsuccess = function (event) {
		var request,
			count = 1,
			results = [],
			keyRange = Store.getKeyRange(mode, value, ext),
			db = event.target.result,
			store = db.transaction([context.name], 'readonly').objectStore(context.name);
		if (option.index)
			store = store.index(option.index);
		if (option.count && mode !== 'filter') {
			request = store.count(keyRange);
			request.onsuccess = function (event) {
				var value = event.target.result,
					limit = option.limit || value;
				value = option.offset > value ? 0 : value - option.offset;
				value = limit >= value ? value : limit;
				deferred.resolve(value);
				db.close();
			};
			request.onerror = function () {
				deferred.reject();
				db.close();
			};
			return;
		}
		request = store.openCursor(keyRange, option.direction);
		request.onsuccess = function (event) {
			var cursor = event.target.result,
				result = callback(cursor, count, option);
			if (typeof result === 'function') {
				deferred.resolve(result());
				db.close();
				return;
			}
			count += 1;
		};
		request.onerror = function () {
			deferred.reject();
			db.close();
		};
	};
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};