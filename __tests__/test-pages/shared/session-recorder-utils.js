function start_test(params) {
  let events = [];

  rrwebRecord({
    emit(event) {
      delete event.timestamp;
      // push event into the events array
      saveXHR(event);
      saveFetch(event);
    }
  });
  // this function will send events to the backend and reset the events array
  async function saveFetch(event) {
    event.data.text = window.btoa(event.data.text);
    const body = JSON.stringify(event);
    await fetch("http://localhost:8125/bogus_submit.html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });
  }
}
function saveXHR(events) {
  const body = JSON.stringify({ events });
  var xhr = new XMLHttpRequest();
  events = [];
  xhr.open("POST", "bogus_submit.html");
  xhr.send(body);
}
