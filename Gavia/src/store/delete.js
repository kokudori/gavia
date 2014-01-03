Gavia.Store.fn.delete = function (key) {
	return this.find(key).then(function (record) {
		if (!record)
			return $.Deferred().reject(key).promise();
		return record.delete(function () {
			return key;
		});
	});
};