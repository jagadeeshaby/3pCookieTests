// window.addEventListener("message", (e) => {
//     console.log(e);
//     window.parent.postMessage("hey can you here me");
// });


let port2;

// Listen for the initial port transfer message
window.addEventListener("message", initPort);

const list = document.querySelector("ul");


// Setup the transferred port
function initPort(e) {
    debugger;
    port2 = e.ports[0];
}


fetch("/authorize", {
    credentials: "include"
}).then(response => {
    return response.json()
}).then(data => {
    port2?.postMessage(data.cookies);
})



// var ports;

// window.addEventListener("message", (data)=>{

//     if(data.origin !== "https://www.connect11.com:2003"){return false}; 
    
//     ports = data.ports[0];
//     ports?.postMessage({type: "handshake"});

//     fetch("/connect/auth/authorize", {credential: "include"}).then(data => data.json()).then(data => ports.postMessage({type:"token", response: data}))
// });




