var resultUrls = function() {
  return Array.from(document.getElementsByClassName('rc')).map(function(div) {
    return div.getElementsByClassName('r')[0].getElementsByTagName('a')[0].href;
  })
};
