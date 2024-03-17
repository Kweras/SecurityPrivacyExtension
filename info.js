
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
fetch('https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_1HBup27FUofbCpgp4u63RV3nGTXNI&domainName='+tabs[0].url+'&outputFormat=JSON')

  .then(response => response.json())
  .then(data => {

    document.getElementById("owner").textContent = "Owner: " + data.WhoisRecord.registrant.organization;    

    document.getElementById("country").textContent = "Country: " + data.WhoisRecord.registrant.country; 
    
    var newDate = data.WhoisRecord.createdDate;
    var newerDate = new Date(newDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    document.getElementById("created").textContent = "Created: " + newerDate.getDate() + " " + monthNames[newerDate.getMonth()] + " " + newerDate.getFullYear();

  })
  .catch(error => {
    console.error('Error: ', error);
    document.getElementById("owner").textContent = "Error: " + error;    

    document.getElementById("country").textContent = ""; 
    
    document.getElementById("created").textContent = "";
  });
});