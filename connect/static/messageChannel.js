

// window.addEventListener("message", (e) => {

//     console.log(window, e.source, window === e.source);
//     console.log(e);
// });

let cookieValue = "";

const popupMessageChannel = document.getElementById("popup-message-channel");
const popup = document.getElementById("popup");

let windowRef = null;

const loginURL = "https://jagadeey-sso.awsapps.com/start#/saml/default/Amazon%20Connect%20IAD/ins-6181f8b8df353fae";
// const loginURL = "https://jagadeey-sso.awsapps.com/start#/saml/default/Amazon%20Connect%20IAD/ins-6181f8b8df353fae";


popupMessageChannel.addEventListener("click", () => {
  let params = `scrollbars=no, resizable=no, status=no, location=no, toolbar=no, menubar=no,
    width=600, height=300, left=100, top=100`;
  windowRef = open(loginURL, new Date().getTime(), params);
  // windowRef.addEventListener("load", onLoad);

  onLoad();
});



popup.addEventListener("click", () => {
  let params = `scrollbars=no, resizable=no, status=no, location=no, toolbar=no, menubar=no,
    width=600, height=300, left=100, top=100`;
  windowRef = open(loginURL, new Date().getTime(), params);
});


var interval;

function onLoad() {



  interval = setInterval(() => {

    var channel = new MessageChannel();
    // Listen for messages on port1
    channel.port1.onmessage = onMessage;
    // Transfer port2 to the iframe
    windowRef.postMessage("Hello from the main page!", "*", [
      channel.port2,
    ]);
  }, 3000);

}


function onMessage(message) {

  if (message.data.type === "handshake") {
    clearInterval(interval);
  }

  if (message.data.type === "token") {
    windowRef.close();
    cookieValue = message.data.response;
    alert("logged in successfully");
  }


}



// function onLoad() {
//   var channel = new MessageChannel();
//   // Listen for messages on port1
//   channel.port1.onmessage = onMessage;

//   // Transfer port2 to the iframe
//   windowRef?.postMessage("Hello from the main page!", "*", [
//     channel.port2,
//   ]);
// }

// // Handle messages received on port1
// function onMessage(e) {
//   console.log(e.data.split("=")[1]);

//   cookieValue = e.data;
// }


document.getElementById("authorize").addEventListener("click", async () => {

  if (cookieValue) {
    alert(`recieved cokies from login popup ${JSON.stringify(cookieValue)}`)
  } else {

    var response = await fetch("/authorize", {
      credentials: "include"
    });

    var data = await response.json();

    if (data.cookies) {
      alert(`Recieved cookies from embedded login ${JSON.stringify(data)}`);
    } else {
      alert(`No cookies found, you need to login first`);

    }
  }
});