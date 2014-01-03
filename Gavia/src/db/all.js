Gavia.prototype.all = function () {
	return Object.keys(this).filter(function (name) {
		return name !== 'name' && name !== 'version';
	}).map(function (name) {
		return this[name];
	}.bind(this));
};