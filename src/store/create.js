Gavia.Store.fn.create = function (key) {
	var record = Record(this, this.db, this.fn);
	if (!this.keyPath || !key)
		return record;

	record[this.keyPath] = key;
	return record;
};