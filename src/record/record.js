var Record = function (store, db, prototype) {
	if (!(this instanceof Record))
		return new Record(store, db, prototype);
	
	Object.defineProperties(this, {
		store: {
			value: Object.create(null, {
				name: {
					value: store.name
				}
			})
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
