chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentUrl = tabs[0].url;
    url = String(currentUrl);
    domain = url.split("/")[2].replace("www.", "");
    
    fetch('https://geo.ipify.org/api/v2/country?apiKey=at_ZQUEZ7621223qsepbwGM8iEJ9sKEZ&domain=' + domain)
    .then(response => response.json())
    .then(data => {
    document.getElementById("ipaddress").textContent = data.ip; 
    console.log(data);
  })
    document.getElementById("sitename").textContent = domain;    
});