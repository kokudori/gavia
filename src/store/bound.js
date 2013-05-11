var compare = function (context, value, mode, option, ext) {
	var results = [];
	return Store.fetch(context, mode, value, function (cursor, count, option) {
		if (!cursor) {
			return function () {
				return results;
			};
		}
		if (count > option.offset) {
			results.push(context.create().update(cursor.value));
		}
		if (option.limit ? (option.limit + option.offset) > count : true) {
			cursor.continue();
		} else {
			return function () {
				return results;
			};
		}
	}, option, ext);
};

Gavia.Store.fn.upper = function (value, option) {
	return compare(this, value, 'lower', option);
};
Gavia.Store.fn.upperThan = function (value, option) {
	return compare(this, value, 'lowerThan', option);
};
Gavia.Store.fn.lower = function (value, option) {
	return compare(this, value, 'upper', option);
};
Gavia.Store.fn.lowerThan = function (value, option) {
	return compare(this, value, 'upperThan', option);
};
Gavia.Store.fn.bound = function (left, right, option) {
	return compare(this, left, 'bound', option, right);
};
Gavia.Store.fn.boundThan = function (left, right, option) {
	return compare(this, left, 'boundThan', option, right);
};