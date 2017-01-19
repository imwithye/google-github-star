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

var resultUrls = function() {
  return Array.from(document.getElementsByClassName('rc'))
    .map((div, index) => {
      var h = div.getElementsByClassName('r')[0];
      var url = h.getElementsByTagName('a')[0].href;
      return { index : index, url : url };
    })
    .map(link => extractUrl(link))
    .map(link => extractRepo(link))
    .filter(link => link.user && link.repo);
};

var loadStars = function() {
  var urls = resultUrls();
  urls.forEach(link => {
    var div = document.createElement('div');
    document.getElementsByClassName('rc')[link.index].appendChild(div);

    var star = document.createElement('a');
    star.setAttribute('class', 'github-button');
    star.setAttribute('href',
                      'https://github.com/' + link.user + '/' + link.repo);
    star.setAttribute('data-count-href',
                      '/' + link.user + '/' + link.repo + '/stargazers');
    star.setAttribute('data-count-api', '/repos/' + link.user + '/' +
                                          link.repo + '#stargazers_count');
    star.setAttribute('data-count-aria-label', '# stargazers on GitHub');
    star.setAttribute('aria-label',
                      'Star ' + link.user + '/' + link.repo + ' on GitHub');
    star.innerHTML = 'Star';
    div.appendChild(star);

    var span = document.createElement('span');
    span.innerHTML = '&nbsp;&nbsp;'
    div.appendChild(span);

    var fork = document.createElement('a');
    fork.setAttribute('class', 'github-button');
    fork.setAttribute('href', 'https://github.com/' + link.user + '/' +
                                link.repo + '/fork');
    fork.setAttribute('data-count-href',
                      '/' + link.user + '/' + link.repo + '/network');
    fork.setAttribute('data-count-api',
                      '/repos/' + link.user + '/' + link.repo + '#forks_count');
    fork.setAttribute('data-count-aria-label', '# forks on GitHub');
    fork.setAttribute('aria-label',
                      'Fork ' + link.user + '/' + link.repo + ' on GitHub');
    fork.innerHTML = 'Fork';
    div.appendChild(fork);
  });
};

var init = function() {
  var script = document.createElement('script');
  script.src = 'https://buttons.github.io/buttons.js';
  script.onload = loadStars();
  document.head.appendChild(script);
};

init();
