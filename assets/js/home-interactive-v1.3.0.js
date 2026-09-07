/* Cache-busted loader for the homepage interaction layer. */
(function () {
  var s = document.createElement('script');
  s.src = 'home-interactive.js?v=1.3.0';
  s.defer = true;
  document.body.appendChild(s);
}());
