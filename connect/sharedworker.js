const allMessagePorts = [];

setInterval(() =>  {
  allMessagePorts.forEach(messagePort => messagePort.postMessage({type: "auth", message: "SharedWorker: refreshing Auth"}));
  fetchAuth().then((json) => {
    allMessagePorts.forEach(messagePort => messagePort.postMessage({type: "auth", message: `SharedWorker: refreshed Auth ${JSON.stringify(json)}`}));
  });
}, 3000);


onconnect = function (event) {
  var port = event.ports[0];

  allMessagePorts.push(port);

  port.postMessage({type: "event", name: "connecting", readnly: "SharedWorker: connecting!!"})


  port.onmessage = function (e) {

    switch(e.data.type){

      case 'sync':  
        port.postMessage({type: "ack", message: "SharedWorker: Yes!!"});
        break; 


      case 'event': 
      //fetchData(e.data.request).then(data =>  {
        //e.data.success(data);
        allMessagePorts.forEach(messagePort => messagePort.postMessage({type: "event", eventData: e.data.request}));
     // });
      break;

      case 'api': 
      fetchData(e.data.request).then(data =>  {
        //e.data.success(data);
        allMessagePorts.forEach(messagePort => messagePort.postMessage({type: "response", response: data}));
      });
      break;
  };
  };
} 




async function fetchAuth(){
var response  = await fetch("/authorize", {
    credentials: "include"
});

return response.json();
}


function fetchData(request){
  return Promise.resolve({ type: request});
};
