Gavia.Store.fn.filter = function (predicate, option) {
	var self = this,
		results = [];
	if (typeof predicate !== 'function') {
		var value = predicate;
		return Store.fetch(this, 'only', value, function (cursor, count, option) {
			if (cursor || count > option.offset) {
				return function () {
					if (!cursor) {
						if (option.count)
							return 0;
						return undefined;
					}
					if (option.count)
						return 1;
					return self.create().update(cursor.value);
				};
			}
			if (option.limit ? (option.limit + option.offset) > count : true) {
				cursor.continue();
			}
		}, option);
	}
	return Store.fetch(this, 'filter', predicate, function (cursor, count, option) {
		if (!cursor) {
			return function () {
				if (option.count)
					return results.length;
				return results;
			};
		}
		if (count > option.offset && predicate(cursor.value) === true) {
			if (option.count)
				results.push(1);
			else
				results.push(self.create().update(cursor.value));
		}
		if (option.limit ? (option.limit + option.offset) > count : true) {
			cursor.continue();
		} else {
			return function () {
				if (option.count)
					return results.length;
				return results;
			};
		}
	}, option);
};