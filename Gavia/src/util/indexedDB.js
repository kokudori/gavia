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