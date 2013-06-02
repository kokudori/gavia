(function(undefined) {
'use strict';
var indexedDB = this.indexedDB
							|| this.webkitIndexedDB
							|| this.mozIndexedDB
							|| this.msIndexedDB,
	IDBTransaction = this.IDBTransaction
							|| this.webkitIDBTransaction
							|| this.msIDBTransaction,
	IDBKeyRange = this.IDBKeyRange
							|| this.webkitIDBKeyRange
							|| this.msIDBKeyRange,
	IDBCursor = this.IDBCursor
							|| this.webkitIDBCursor
							|| this.msIDBCursor;


// TODO $(Gavia).on
// TODO $(Gavia['DBName']).on
// TODO $(Gavia['DBName']['StoreName']).on


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

Gavia.prototype.all = function () {
	return Object.keys(this).filter(function (name) {
		return name !== 'name' && name !== 'version';
	}).map(function (name) {
		return this[name];
	}.bind(this));
};
Gavia.prototype.delete = function () {
	var deferred = $.Deferred(),
		request = indexedDB.deleteDatabase(this.name);
	request.onsuccess = function () {
		deferred.resolve(this.name);
	}.bind(this);
	request.onerror = function () {
		deferred.reject(this.name);
	}.bind(this);
	delete Gavia[this.name];
	return deferred.promise();
};
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
	option = $.extend({
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

Gavia.Store.fn.all = function (option) {
	if (!option || option.count !== true) {
		return this.filter(function () {
			return true;
		}, option);
	}
	var deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	option = $.extend({
		index: null,
		offset: 0,
		limit: null
	}, option);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.name], 'readonly').objectStore(this.name);
		if (option.index)
			store = store.index(option.index);
		result = store.count();
		result.onsuccess = function (event) {
			var value = event.target.result,
				limit = option.limit || value;
			value = option.offset > value ? 0 : value - option.offset;
			value = limit >= value ? value : limit;
			deferred.resolve(value);
			db.close();
		}.bind(this);
		result.onerror = function (event) {
			var db = event.target.result;
			deferred.reject(key);
			db.close();
		};
		db.close();
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};
var compare = function (context, value, mode, option, ext) {
	var results = [];
	return Store.fetch(context, mode, value, function (cursor, count, option) {
		if (!cursor) {
			return function () {
				return results;
			};
		}
		if (count > option.offset) {
			results.push(context.create().update(cursor.value));
		}
		if (option.limit ? (option.limit + option.offset) > count : true) {
			cursor.continue();
		} else {
			return function () {
				return results;
			};
		}
	}, option, ext);
};

Gavia.Store.fn.upper = function (value, option) {
	return compare(this, value, 'lower', option);
};
Gavia.Store.fn.upperThan = function (value, option) {
	return compare(this, value, 'lowerThan', option);
};
Gavia.Store.fn.lower = function (value, option) {
	return compare(this, value, 'upper', option);
};
Gavia.Store.fn.lowerThan = function (value, option) {
	return compare(this, value, 'upperThan', option);
};
Gavia.Store.fn.bound = function (left, right, option) {
	return compare(this, left, 'bound', option, right);
};
Gavia.Store.fn.boundThan = function (left, right, option) {
	return compare(this, left, 'boundThan', option, right);
};
Gavia.Store.fn.clear = function () {
	var deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			transaction = db.transaction([this.name], 'readwrite'),
			request = transaction.objectStore(this.name).clear();
		request.onsuccess = function () {
			deferred.resolve();
			db.close();
		};
		request.onerror = function (event) {
			deferred.reject();
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};
Gavia.Store.fn.create = function (key) {
	var record = Record(this, this.db, this.fn);
	if (!this.keyPath || !key)
		return record;

	record[this.keyPath] = key;
	return record;
};
Gavia.Store.fn.delete = function (key) {
	return this.find(key).then(function (record) {
		if (!record)
			return $.Deferred().reject(key).promise();
		return record.delete(function () {
			return key;
		});
	});
};
Store.getKeyRange = function (mode, left, right) {
	switch (mode) {
		case 'upper':
			return IDBKeyRange.upperBound(left);
		case 'upperThan':
			return IDBKeyRange.upperBound(left, true);
		case 'lower':
			return IDBKeyRange.lowerBound(left);
		case 'lowerThan':
			return IDBKeyRange.lowerBound(left, true);
		case 'bound':
			return IDBKeyRange.bound(left, right);
		case 'boundThan':
			return IDBKeyRange.bound(left, right, true, true);
		case 'only':
			return IDBKeyRange.only(left);
		case 'filter':
			return null;
		default:
			throw 'no match';
	}
};

Store.fetch = function (context, mode, value, callback, option, ext) {
	var deferred = $.Deferred(),
		request = indexedDB.open(context.db.name, context.db.version);
	option = $.extend({
		direction: Gavia.Store.direction.next,
		index: null,
		offset: 0,
		limit: null
	}, option);
	request.onsuccess = function (event) {
		var request,
			count = 1,
			results = [],
			keyRange = Store.getKeyRange(mode, value, ext),
			db = event.target.result,
			store = db.transaction([context.name], 'readonly').objectStore(context.name);
		if (option.index)
			store = store.index(option.index);
		if (option.count && mode !== 'filter') {
			request = store.count(keyRange);
			request.onsuccess = function (event) {
				var value = event.target.result,
					limit = option.limit || value;
				value = option.offset > value ? 0 : value - option.offset;
				value = limit >= value ? value : limit;
				deferred.resolve(value);
				db.close();
			};
			request.onerror = function () {
				deferred.reject();
				db.close();
			};
			return;
		}
		request = store.openCursor(keyRange, option.direction);
		request.onsuccess = function (event) {
			var cursor = event.target.result,
				result = callback(cursor, count, option);
			if (typeof result === 'function') {
				deferred.resolve(result());
				db.close();
				return;
			}
			count += 1;
		};
		request.onerror = function () {
			deferred.reject();
			db.close();
		};
	};
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};
Gavia.Store.fn.filter = function (predicate, option) {
	var self = this,
		results = [];
	if (typeof predicate !== 'function') {
		var value = predicate;
		return Store.fetch(this, 'only', value, function (cursor, count, option) {
			if (cursor || count > option.offset) {
				return function () {
					if (!cursor) {
						if (option.count)
							return 0;
						return undefined;
					}
					if (option.count)
						return 1;
					return self.create().update(cursor.value);
				};
			}
			if (option.limit ? (option.limit + option.offset) > count : true) {
				cursor.continue();
			}
		}, option);
	}
	return Store.fetch(this, 'filter', predicate, function (cursor, count, option) {
		if (!cursor) {
			return function () {
				if (option.count)
					return results.length;
				return results;
			};
		}
		if (count > option.offset && predicate(cursor.value) === true) {
			if (option.count)
				results.push(1);
			else
				results.push(self.create().update(cursor.value));
		}
		if (option.limit ? (option.limit + option.offset) > count : true) {
			cursor.continue();
		} else {
			return function () {
				if (option.count)
					return results.length;
				return results;
			};
		}
	}, option);
};
Gavia.Store.fn.find = function (key, option) {
	var deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.name], 'readonly').objectStore(this.name);
		if (option && option.index)
			store = store.index(option.index);
		result = store.get(key);
		result.onsuccess = function (event) {
			var value = event.target.result;
			if (typeof value === 'undefined') {
				deferred.resolve(value);
				db.close();
				return;
			}
			deferred.resolve(this.create().update(value));
			db.close();
		}.bind(this);
		result.onerror = function (event) {
			var db = event.target.result;
			deferred.reject(key);
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject(key);
		db.close();
	};
	return deferred.promise();
};
var transaction = function (store) {
	return {
		add: function (value, key) {
			if (key)
				store.add(value, key).onerror = function () {
					console.log('errored');
				};
			store.add(value).onerror = function () {
				console.log('errored');
			};
		},
		put: function (value, key) {
			if (key)
				store.put(value, key);
			store.put(value);
		},
		remove: function (key) {
			store.delete(key);
		}
	};
};

Gavia.Store.fn.transaction = function () {
	var args = [].slice.apply(arguments),
		stores = [this].concat(args.splice(0, args.length - 1)),
		callback = args[args.length - 1],
		deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			names = stores.map(function (store) {
				return store.name;
			}),
			tx = db.transaction(names, 'readwrite'),
			abort = callback.apply(null, stores.map(function (store) {
				return transaction(tx.objectStore(store.name));
			}));
		tx.oncomplete = function () {
			deferred.resolve();
			db.close();
		};
		tx.onerror = function () {
			if (abort !== false)
				deferred.reject();
			else
				deferred.resolve();
			db.close();
		};
		if (abort === false)
			tx.abort();
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};
Gavia.Record.fn.delete = function (keyName) {
	var request,
		deferred = $.Deferred(),
		key = (function () {
			if (this.store.keyPath)
				return this[this.store.keyPath];
			if (typeof keyName === 'function')
				return keyName();
			if (keyName)
				return this[keyName];
		}).apply(this);
	if (!key) {
		deferred.reject('key does not setting.');
		return deferred.promise();
	}

	request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var db = event.target.result,
			store = db.transaction([this.store.name], 'readwrite').objectStore(this.store.name);
		store.delete(key);
		store.transaction.oncomplete = function () {
			deferred.resolve(key);
			db.close();
		};
		store.transaction.onerror = function (event) {
			deferred.reject(key);
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	};
	return deferred.promise();
};
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
var Record = function (store, db, prototype) {
	if (!(this instanceof Record))
		return new Record(store, db, prototype);
	
	Object.defineProperties(this, {
		store: {
			value: store
		},
		db: {
			value: db
		}
	});

	Object.keys(store).filter(function (option) {
		return option === 'keyPath' || option === 'autoIncrement';
	}).forEach(function (option) {
		Object.defineProperty(this.store, option, {
			value: store[option]
		});
	}.bind(this));

	$.extend(Object.getPrototypeOf(this), prototype);
};

Record.prototype = Gavia.Record.fn;

Gavia.Record.fn.save = function (id) {
	var deferred = $.Deferred(),
		request = indexedDB.open(this.db.name, this.db.version);
	request.onsuccess = function (event) {
		var result,
			db = event.target.result,
			store = db.transaction([this.store.name], 'readwrite').objectStore(this.store.name),
			data = Object.keys(this).reduce(function (result, name) {
				result[name] = this[name];
				return result;
			}.bind(this), {}),
			request = (function () {
				if (id)
					return store.put(data, id);
				else
					return store.put(data);
			})();
		request.onsuccess = function (event) {
			result = event.target.result;
		};
		store.transaction.oncomplete = function () {
			deferred.resolve(result);
			db.close();
		};
		store.transaction.onerror = function (event) {
			deferred.reject();
			db.close();
		};
	}.bind(this);
	request.onerror = function (event) {
		var db = event.target.result;
		deferred.reject();
		db.close();
	}.bind(this);
	return Object.defineProperty(this, 'promise', {
		writable: true,
		value: deferred.promise()
	});
};
Gavia.Record.fn.update = function (properties) {
	Object.keys(properties).forEach(function (property) {
		this[property] = properties[property];
	}.bind(this));
	return this;
};
window.Gavia = Gavia;
}).call(this);