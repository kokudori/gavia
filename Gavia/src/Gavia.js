

// catch the infomation about target notify
// TODO Gavia.on
// TODO Gavia['DBName'].on
// TODO Gavia['DBName']['StoreName'].on


var Gavia = function (name, version, stores) {
	if (!(this instanceof Gavia))
		return new Gavia(name, version, stores);
	if (!name)
		throw 'require database name';
	if (typeof stores === 'undefined') {
		stores = version;
		version = 1;
	}

	Object.defineProperties(this, {
		name: {
			enumerable: true,
			value: name
		},
		version: {
			enumerable: true,
			value: version
		}
	});

	Store.create(name, version, stores);
	Object.defineProperties(this, Object.keys(stores).reduce(function (result, store) {
		result[store] = {
			enumerable: true,
			value: Store(store, name, version, stores[store])
		};
		return result;
	}, {}));
	Object.defineProperty(Gavia, name, {
		enumerable: true,
		configurable: true,
		value: this
	});
};

Object.defineProperties(Gavia, {
	fn: {
		value: {}
	},
	Store: {
		value: Object.create(null, {
			fn: {
				value: {}
			}
		})
	},
	Record: {
		value: Object.create(null, {
			fn: {
				value: {}
			}
		})
	}
});
