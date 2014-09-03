
var dbName = "todos";
var version = 3;

var IndexedDbConn = (function(){

	function IndexedDbConn(dbName, version){
		this.dbName = dbName;
		this.version = version;
		this.db;
		var that = this;

		var request = indexedDB.open(this.dbName, this.version);

		request.onerror = function(e){
			console.log("Database error code");
		};

		request.onsuccess = function(e){
			that.db = request.result;
			console.log('DB init Done');

			//callback(that.db);
		};
	};
	

	IndexedDbConn.prototype.getConnection = function(){
		return this.db;
	};


	IndexedDbConn.prototype.getObjectStore = function(storeName, option){

		var tx = this.db.transaction([storeName], option);

		tx.oncomplete = function(event) {
			console.log("All done!");
		};

		tx.onerror = function(event){
			alert("transaction error");
		};

		var memberObjStore = tx.objectStore(storeName);

		return memberObjStore;

	};

	return IndexedDbConn;

})();


angular.module('util.database', []).
	value('db', {
		conn : null
	}).
	factory('connFactory', ['db' , function(db){
		return {
			getConn : function(){
				return db.conn.getConnection();
			},
			getObjectStore : function(storeName, option){
				return db.conn.getObjectStore(storeName, option);
			}
		}
	}]).
	run(function(db){
		db.conn = new IndexedDbConn(dbName, version);
	});
