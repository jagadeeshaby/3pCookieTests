
function initSharedWorker() {

  if (!!window.SharedWorker) {
    const myWorker = new SharedWorker("sharedworker.js", 'test');

    myWorker.onerror = (e) => {
      console.log(e);
    }


    document.getElementById("response")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      var requestType = document.getElementById("type").value || "api";
      var request = document.getElementById("request").value;

      appendText("Worker: requesting of data of type " + requestType);
      myWorker.port.postMessage({ type: requestType, request: request });
    });


    function handleSuccess(response) {
      appendText("handleSuccess" + JSON.stringify(response));

    }

    function sendHeartbeat() {
      var text = "Window: Hey you there?";
      myWorker.port.postMessage({ type: "sync", message: text });
      appendText(text);
    }

    sendHeartbeat();

    var dateOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "America/Los_Angeles",
    };

    function appendText(text) {
      var container = document.createElement("div");
      container.innerText = `${new Intl.DateTimeFormat(undefined, dateOptions).format(new Date())} - ${text}`;
      document.getElementById('result1').prepend(container);
    }

    // setInterval(() => sendHeartbeat(), 3000);



    function senditToParent(event, data) {
      window.parent.postMessage({ type: "event", eventData: data }, "*");
    }



    myWorker.port.onmessage = function (e) {

      switch (e.data.type) {

        case 'response':
          appendText(JSON.stringify(e.data.response));
          break;

        case 'ack':
          appendText(e.data.message);
          break;


        case 'auth':
          appendText(e.data.message);
          break;


        case 'event':
          appendText(e.data.name);
          senditToParent(e.data.name, e.data.readnly)
          break;

      }

      console.log(e);
    };
  }

}


// initSharedWorker();
