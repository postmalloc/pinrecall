var _url = "https://api.pinboard.in/v1/posts/all?format=json&auth_token=";
const options = {
  method: 'GET',
  crossDomain: true,
};

function send(msg) {
  chrome.runtime.sendMessage(msg, function (response) {});
}

function fetchAndSend(msg) {
  let url = _url + localStorage.getItem('apiKey');
  fetch(url, options).then(response => response.json())
    .then(data => {
      send({
        links: data,
        tabId: msg
      });
      localStorage.setItem('pinData', JSON.stringify(data));
    })
    .catch((error) => console.log(error))
}

chrome.runtime.onStartup.addListener(function () {
  console.log("STRART");
  localStorage.removeItem('pinData');
  fetchAndSend();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (localStorage.getItem('pinData') === null) {
    fetchAndSend(msg);
  } else {
    send({
      links: JSON.parse(localStorage.getItem('pinData')),
      tabId: msg
    });
  }
  sendResponse({});
  return true;
});