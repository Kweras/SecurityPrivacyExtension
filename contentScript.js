
function check(){
  if (location.protocol === 'https:') {
    document.getElementById("secured").textContent = "This website is HTTPS.";
  } else {
    document.getElementById("secured").textContent = "This website is not HTTPS.";
  }
};

window.onload = (event) => {
  check();
};

window.onload = check();

document.getElementById("button").onclick = (event) => {
  check();
};



