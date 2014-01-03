Gavia.Record.fn.update = function (properties) {
	Object.keys(properties).forEach(function (property) {
		this[property] = properties[property];
	}.bind(this));
	return this;
};