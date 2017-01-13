var resultUrls = function() {
  var getParameterByName = function(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var results = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)").exec(url);
    return (!results || !results[2])
             ? ''
             : decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  return Array.from(document.getElementsByClassName('rc'))
    .map(div => div.getElementsByClassName('r')[0].getElementsByTagName('a')[0])
    .filter(a => a.host.toLowerCase().indexOf('github.com') >= 0 ||
                 a.host.toLowerCase().indexOf('github.io') >= 0 ||
                 getParameterByName("url", a.href).indexOf('github.com') >= 0 ||
                 getParameterByName("url", a.href).indexOf('github.io') >= 0)
    .map(a => a.host.toLowerCase().indexOf('github.com') >= 0 ||
                  a.host.toLowerCase().indexOf('github.io') >= 0
                ? a.href
                : getParameterByName("url", a.href));
};
