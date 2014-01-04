var Store = function (name, dbName, dbVersion, options) {
	if (!(this instanceof Store))
		return new Store(name, dbName, dbVersion, options);

	Object.keys(options).filter(function (option) {
		return option === 'keyPath' || option === 'autoIncrement';
	}).forEach(function (option) {
		Object.defineProperty(this, option, {
			enumerable: true,
			value: options[option]
		});
	}.bind(this));

	Object.defineProperties(this, {
		name: {
			enumerable: true,
			value: name
		},
		db: {
			value: Object.create(null, {
				name: {
					value: dbName
				},
				version: {
					value: dbVersion
				}
			})
		},
		fn: {
			value: {}
		}
	});
};

Store.prototype = Gavia.Store.fn;

Object.defineProperty(Gavia.Store, 'direction', {
	enumerable: true,
	value: Object.create(null, {
		next: {
			enumerable: true,
			value: 'next'
		},
		nextUnique: {
			enumerable: true,
			value: 'nextunique'
		},
		prev: {
			enumerable: true,
			value: 'prev'
		},
		prevUnique: {
			enumerable: true,
			value: 'prevunique'
		}
	})
});

var createIndex = function (store, option) {
	var keyPath = option.index.keyPath || option.keyPath,
		name = option.index.name || keyPath,
		options =  ['unique', 'multiEntry'].reduce(function (result, name) {
			if (typeof option.index[name] !== 'undefined')
				result[name] = option.index[name];
			return result;
		}, {});
	store.createIndex(name, keyPath, options);
};

var createObjectStore = function (db, name, option) {
	option = extend({
		keyPath: null,
		autoIncrement: false,
		index: null
	}, option);
	if (db.objectStoreNames.contains(name)) {
		db.deleteObjectStore(name);
	}
	var store = db.createObjectStore(name, {
		keyPath: option.keyPath,
		autoIncrement: option.autoIncrement
	});
	if (option.index) {
		createIndex(store, option);
	}
};

Store.create = function (name, version, stores) {
	var request = indexedDB.open(name, version);
	request.onupgradeneeded = function (event) {
		var db = event.target.result;
		Object.keys(stores).forEach(function (store) {
			createObjectStore(db, store, stores[store]);
		});
		db.close();
	};
};
