Gavia.Record.fn.isExist = function (keyName) {
	var name = keyName || this.store.keyPath;
	return this.store.find(this[name])
		.then(function (record) {
			return typeof record !== 'undefined';
		});
};