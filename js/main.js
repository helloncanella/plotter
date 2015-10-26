/*globals window*/

'use strict';

require(['jquery', 'plotter'], function($, Plotter) {

  var
    xLimits = [-1000, 1000],
    yLimits = [-15, 15];

  var plotter = new Plotter(xLimits, yLimits);

  (function insertPlotter() {
    plotter
      .insertSVGframe()
      .setAxes()
      .setListeners();

    $(window).resize(function() {
      insertPlotter();
    });

  })();

  console.log(window);


});
