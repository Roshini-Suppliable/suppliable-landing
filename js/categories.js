/* =======================================================================
   Landing page "Shop by category" grid — populated from the live API.
   Falls back silently to the static HTML cards if the API is unreachable.
   Requires js/api.js to be loaded first.
   ======================================================================= */
(function () {
  'use strict';

  var grid = document.getElementById('catGridLanding');
  if (!grid || typeof SuppliableAPI === 'undefined') return;

  function cardHTML(c) {
    var sub = c.productCount
      ? c.productCount + ' product' + (c.productCount === 1 ? '' : 's')
      : 'Browse products';
    return (
      '<a href="/products/?category=' + encodeURIComponent(c.key) + '" class="cat-card">' +
        '<span class="cat-emoji">' + c.e + '</span>' +
        '<h3>' + c.name + '</h3>' +
        '<p>' + sub + '</p>' +
      '</a>'
    );
  }

  var ctaCard =
    '<a href="/products/" class="cat-card cat-cta">' +
      '<span class="cat-emoji">➕</span>' +
      '<h3>See all</h3>' +
      '<p>Browse the full catalogue</p>' +
    '</a>';

  SuppliableAPI.getHome().then(function (home) {
    var cats = home.categories.filter(function (c) {
      /* skip empty / test categories */
      return c.productCount > 0 && c.key !== 'test_cat';
    });
    if (!cats.length) return; /* keep static fallback */
    grid.innerHTML = cats.map(cardHTML).join('') + ctaCard;
    grid.removeAttribute('data-loading');
  }).catch(function () {
    /* keep static fallback cards in place */
    grid.removeAttribute('data-loading');
  });
})();
