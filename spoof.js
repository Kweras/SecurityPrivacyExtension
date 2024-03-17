var currentUrl;
let url;
var domain;
var xhr = new XMLHttpRequest();

xhr.open("GET", "domains.txt", true);

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    currentUrl = tabs[0].url;
    url = String(currentUrl);
    domain = url.split("/")[2].replace("www.", "");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var lines = xhr.responseText.split("\n"); 
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim(); 
            if (line == domain){
              document.getElementById("spoofingmessage").textContent = "Spoof found!";
              document.getElementById("spoofing").textContent = " Domain: "+ domain +" is on spoofing list";
            }
          }
        }
      };
  });

xhr.send();
