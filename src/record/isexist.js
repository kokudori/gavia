Gavia.Record.fn.isExist = function (keyName) {
	var name = keyName || this.store.keyPath;
	if (typeof keyName === 'function') {
		return this.store
			.filter(keyName, { count: true })
			.then(function (count) {
				return count > 0;
			});
	}
	return this.store.find(this[name])
		.then(function (record) {
			return typeof record !== 'undefined';
		});
};