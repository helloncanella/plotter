/*globals window*/

'use strict';

require(['jquery', 'plotter'], function($, Plotter) {

  var id;

  var
    xLimits = [-40, 40],
    yLimits = [-1000, 1000];

  var plotter = new Plotter(xLimits, yLimits);

  function insertPlotter() {
    plotter
      .insertSVGframe()
      .setAxes()
      .setListeners();
  }

  insertPlotter();

  $(window).resize(function() {
    clearTimeout(id);
    id = setTimeout(insertPlotter, 10);
  });

});
