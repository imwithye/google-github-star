var isGitHubUrl = function(url) {
  var parser = document.createElement('a');
  parser.href = url;
  return /^[a-zA-Z0-9]*\.github\.io$/g.test(parser.hostname) ||
         /^github\.com$/g.test(parser.hostname);
};

var extractUrl = function(url) {
  if (isGitHubUrl(url)) {
    return url;
  }
  var parser = document.createElement('a');
  parser.href = url;
  var results = /[?&]url(=([^&#]*)|&|#|$)/.exec(parser.search);
  if (!results || !results[2]) {
    return null;
  }
  url = decodeURIComponent(results[2].replace(/\+/g, " "));
  if (!isGitHubUrl(url)) {
    return null;
  }
  return url;
};

var extractRepo = function(url) {
  var parser = document.createElement('a');
  parser.href = url;

  if (/^[a-zA-Z0-9]*\.github\.io$/g.test(parser.hostname)) {
    var user = parser.hostname.split('.')[0];
    var repo = parser.pathname.split('/')[1];
    if (!repo) {
      return null;
    }
    return { user : user, repo : repo };
  }
  if (/^github\.com$/g.test(parser.hostname)) {
    var user = parser.pathname.split('/')[1];
    var repo = parser.pathname.split('/')[2];
    if (!user || !repo) {
      return null;
    }
    return { user : user, repo : repo };
  }
  return null;
};

var resultUrls = function() {
  return Array.from(document.getElementsByClassName('rc'))
    .map(div => div.getElementsByClassName('r')[0])
    .map(h => h.getElementsByTagName('a')[0].href)
    .filter(link => extractUrl(link))
    .map(link => extractUrl(link))
    .filter(link => extractRepo(link))
    .map(link => extractRepo(link));
};
