var extend = function (source, target) {
	var prop = {};
	Object.keys(target || {}).forEach(function (key) {
		prop[key] = {
			value: target[key]
		};
	});
	return Object.create(source, prop);
};