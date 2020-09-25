function randomSample(arr, n) {
  let arr_shuf = arr.sort(() => 0.5 - Math.random());
  return arr_shuf.slice(0, n);
}

var tabId;
window.onload = () => {
  var resetButton = document.getElementById('trash');
  resetButton.addEventListener('click', () => reset());
  if (localStorage.getItem('apiKey') === null) {
    var apiInput = document.createElement('input');
    apiInput.placeholder = 'Your Pinboard API token'
    var apiInputButton = document.createElement('button');
    apiInputButton.innerHTML = "Login";
    apiInputButton.addEventListener('click', () => {
      localStorage.setItem('apiKey', apiInput.value);
      chrome.tabs.reload(tabId);
    });
    var loginDiv = document.getElementById("login");
    loginDiv.appendChild(apiInput);
    loginDiv.appendChild(apiInputButton);
  } else {
    chrome.tabs.query({
        currentWindow: true,
        active: true
      },
      t => {
        chrome.runtime.sendMessage(t[0].id, () => {});
        tabId = t[0].id;
      });
  }
}

function reset() {
  localStorage.clear();
  chrome.tabs.reload(tabId);
}

chrome.runtime.onMessage.addListener(
  function (req, sender, sendResponse) {
    if(req.status != 'FETCHED' && tabId == req.tabId){
      var cont = document.getElementById('content');
      var statusMsg = document.createElement('p');
      statusMsg.id = 'status';
      if(req.status == 'FETCHING'){
        statusMsg.innerHTML = 'Fetching bookmarks...'
      } else {
        statusMsg.innerHTML = 'Something went wrong :(';
      }
      cont.appendChild(statusMsg);
    }
    if (localStorage.getItem('apiKey') != null && tabId == req.tabId) {
      var links = req.links;
      links = randomSample(links, 10);
      var cont = document.getElementById('content');
      cont.innerHTML = '';
      for (var c in links) {
        var linkDiv = document.createElement('div');
        var desc = document.createElement('a');
        var br = document.createElement('br');
        desc.className = 'link-desc';
        desc.innerHTML = links[c].description;
        linkDiv.appendChild(desc);
        linkDiv.appendChild(br);
        var linkElement = document.createElement('a');
        linkElement.className = "pin-link";
        if (links[c].href.length > 50) {
          linkElement.innerHTML = links[c].href.slice(0, 40) + '...';
        } else {
          linkElement.innerHTML = links[c].href;
        }
        linkElement.href = links[c].href;
        desc.href = links[c].href;
        desc.target = '_blank';
        linkElement.target = '_blank';
        linkDiv.appendChild(linkElement);
        // cont.appendChild(br);
        cont.appendChild(linkDiv);
      }
    }
    sendResponse({});
    return true;
  }
);