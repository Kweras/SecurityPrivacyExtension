chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// return if out of scope
	if (request.scope != "<all_urls>") {
		if (request.scope != window.location.href) return;
	}
    	// clear storage elements
	if (request.method == "clearPageStorage") {
		// query database names
		indexedDB.webkitGetDatabaseNames().onsuccess = function(e) {
			// make storage elements accessible
			var _indexedDB = e.target.result;
			var _sessionStorage = sessionStorage;
			var _localStorage = localStorage;
			// clear storage elements
			var i; for (i=0; i<_indexedDB.length; i++) {
				indexedDB.deleteDatabase(_indexedDB[i]);
			}
			_sessionStorage.clear();
			_localStorage.clear();
		};
	}
    	// count storage items
	if (request.method == "countPageStorage") {
		// query database names
		indexedDB.webkitGetDatabaseNames().onsuccess = function(e) {
			// make storage elements accessible
			var _indexedDB = e.target.result;
			var _sessionStorage = sessionStorage;
			var _localStorage = localStorage;
			// count storage items
			var indexedDBCount = _indexedDB.length;
			var sessionStorageCount = _sessionStorage.length;
			var localStorageCount = _localStorage.length;
			// return
			var response = {
				method: "countPageStorageResult",
				data: {
					indexedDBCount: indexedDBCount,
					sessionStorageCount: sessionStorageCount,
					localStorageCount: localStorageCount
				}
			};
			chrome.runtime.sendMessage(response);
		};
	}
});