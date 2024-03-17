chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var url = tabs[0].url;
  if (url.indexOf("https://") !== 0) {
    document.getElementById("message").textContent = "This website is not using HTTPS!";
  } else {
    document.getElementById("message").textContent = "This website is using HTTPS.";
  }
});

var countCookies = function() {

    // get cookies
    get_cookies(function(cookielist) {
        // iterate through cookie list and build unique list by generating hash values for comparison
        var cookiemap = {};
        var cookies = [];
        var i;
        for (i = 0; i < cookielist.length; i++) {
            // use url (protocol, domain, path) and name for hash value
            var hash = [cookielist[i].secure, cookielist[i].domain, cookielist[i].path, cookielist[i].name].join("%");
            // add to list if cookie was not already added
            if (!cookiemap[hash]) {
                cookies.push(cookielist[i]);
                cookiemap[hash] = true;
            }
        }
        // display the count of cookies

        if (cookies.length > 0) {
            document.getElementById("cookies").textContent = cookies.length + " cookies detected!";
        } else {
            document.getElementById("cookies").textContent = "No cookie detected. Hooray!";
        }

    });
};


/**
 * get_cookies_byurl
 * - retrieve all cookies from store that match host (second level domain) and path specified by url
 * - returns cookies array and counter (i) increased by 1 to callback
 * @param {string} taburl
 * @param {Array} cookies
 * @param {function} callback
 * @param {Number} i
 */
var get_cookies_byurl = function(taburl, cookies, callback, i) {
	// split url by '/', e.g. http://example.com/path -> [ 'http:', '', 'example.com', 'path' ]
	url = taburl.split("/");
	// return if url does not contain a domain
	if (url.length<=2) {
		callback(cookies, i+1);
		return;
	}
	// split domain by '.', e.g. example.com -> [ 'example', 'com' ]
	var domain = url[2].split(".");
	// return if domain is only top level
	if (domain.length<2) {
		callback(cookies, i+1);
		return;
	}
	// extract second level domain, e.g. www.example.com -> 'example.com'
	var host = domain[domain.length-2] + "." + domain[domain.length-1];
	// query cookie store for all cookies which match the given host
	chrome.cookies.getAll({
		domain: host
	}, function(result) {
		// iterate through result
		var e; for (e in result) {
			// test if the cookie origin is part of the given domain
			var cookiehost = result[e].domain.split(".").join("\\.");
			if (domain.join(".").search(new RegExp(cookiehost, "i"))!=-1) {
				// test if the cookie path is part of the given url without query string
				var url_path = taburl.split("?")[0];
				if (url_path.search(new RegExp(":\/\/" + domain.join("\\.") + result[e].path + ((result[e].path.length==1)?".*$":"(\/.*)*$"), "i"))!=-1) {
					cookies.push(result[e]);
				}
			}
		}
		// return
		callback(cookies, i+1);
	});
};

/**
 * get_cookies
 * - retrieve list of urls that were requested during load of the current page
 * - query cookie store for all cookies by all urls associated with the current page
 * - returns unique list of cookies to callback
 * @param {function} callback
 */
var get_cookies = function(callback) {
	// query current tab
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		var tab = tabs[0];
		// query background page for list of urls for all tabs
		chrome.runtime.sendMessage({
			method: "sessionData"
		}, function(result) {
			// get list of urls by tab id
			var urls = [];
			var list = result.data[tab.id];
			if (list) {
				if (localStorage.pe_opt_clear_data_3rd !== "no") {
					// make array from hash map
					var e; for (e in list) {
						if (list.hasOwnProperty(e)) {
							urls.push(e);
						}
					}
				}
				else {
					urls = [ tab.url ];
				}
				// iterate through url array and query cookies by url
				var cookies = [];
				var next = function(cookies, i) {
					if (i<urls.length) {
						get_cookies_byurl(urls[i], cookies, next, i);
					}
					else {
						callback(cookies);
					}
				};
				next(cookies, 0);
			}
			else {
				callback([]);
			}
		});
	});
};

var load = function() {

  countCookies();

};

// receive messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// receive requested numbers of storage items by url and add to total count of all urls
	if (request.method == "countPageStorageResult") { 
		var storage = request.data;
		sessionStorage.statIndexedDBCount = parseInt(sessionStorage.statIndexedDBCount, 10)+storage.indexedDBCount;
		sessionStorage.statLocalStorageCount = parseInt(sessionStorage.statLocalStorageCount, 10)+storage.localStorageCount;
		sessionStorage.statSessionStorageCount = parseInt(sessionStorage.statSessionStorageCount, 10)+storage.sessionStorageCount;
	}
});

// load on popup show
document.addEventListener('DOMContentLoaded', load);




