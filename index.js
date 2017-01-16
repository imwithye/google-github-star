var httpGetAsync = function(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
};

var isGitHubUrl = function(url) {
  var parser = document.createElement('a');
  parser.href = url;
  return /^[a-zA-Z0-9]*\.github\.io$/g.test(parser.hostname) ||
         /^github\.com$/g.test(parser.hostname);
};

var extractUrl = function(urlObject) {
  var url = urlObject.url;
  if (isGitHubUrl(url)) {
    return { index : urlObject.index, url : url };
  }
  var parser = document.createElement('a');
  parser.href = url;
  var results = /[?&]url(=([^&#]*)|&|#|$)/.exec(parser.search);
  if (!results || !results[2]) {
    return { index : urlObject.index, url : null };
  }
  url = decodeURIComponent(results[2].replace(/\+/g, " "));
  if (!isGitHubUrl(url)) {
    return { index : urlObject.index, url : null };
  }
  return { index : urlObject.index, url : url };
};

var extractRepo = function(urlObject) {
  var url = urlObject.url;
  if (!url) {
    return { index : urlObject.index, user : null, repo : null };
  }

  var parser = document.createElement('a');
  parser.href = url;

  if (/^[a-zA-Z0-9]*\.github\.io$/g.test(parser.hostname)) {
    var user = parser.hostname.split('.')[0];
    var repo = parser.pathname.split('/')[1];
    if (!repo) {
      return { index : urlObject.index, user : null, repo : null };
    }
    return { index : urlObject.index, user : user, repo : repo };
  }
  if (/^github\.com$/g.test(parser.hostname)) {
    var user = parser.pathname.split('/')[1];
    var repo = parser.pathname.split('/')[2];
    if (!user || !repo) {
      return { index : urlObject.index, user : null, repo : null };
    }
    return { index : urlObject.index, user : user, repo : repo };
  }
  return { index : urlObject.index, user : null, repo : null };
};

var assembleAPI = function(urlObject) {
  if (urlObject.user && urlObject.repo) {
    return {
      index : urlObject.index,
      api :
        "https://api.github.com/repos/" + urlObject.user + "/" + urlObject.repo
    };
  }
  return { index : urlObject.index, api : null };
};

var resultUrls = function() {
  return Array.from(document.getElementsByClassName('rc'))
    .map((div, index) => {
      var h = div.getElementsByClassName('r')[0];
      var url = h.getElementsByTagName('a')[0].href;
      return { index : index, url : url };
    })
    .map(link => extractUrl(link))
    .map(link => extractRepo(link))
    .map(link => assembleAPI(link));
};

var loadStars = function() {
  var urls = resultUrls();
  urls.forEach(link => {
    if (!link.api) {
      return;
    }

    httpGetAsync(link.api, (responseText) => {
      var resp = JSON.parse(responseText);
      var stars = resp.stargazers_count;
      var forks = resp.forks_count;
      var div = document.createElement('div');
      div.innerHTML = "Star: " + stars + ", Fork: " + forks;
      document.getElementsByClassName('rc')[link.index].appendChild(div);
      console.log("ok");
    });
  });
};
