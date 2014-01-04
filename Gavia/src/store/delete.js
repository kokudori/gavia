Gavia.Store.fn.delete = function (key) {
	return this.find(key).then(function (record) {
		if (!record)
			return new Gavia.Deferred().reject(key).promise();
		return record.delete(function () {
			return key;
		});
	});
};