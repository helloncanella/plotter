/*globals window*/

'use strict';

require(['jquery', 'plotter'], function($, Plotter) {

  var
    xLimits = [-40, 40],
    yLimits = [-1000, 1000];

  var plotter = new Plotter(xLimits, yLimits);

  (function insertPlotter() {
    plotter
      .insertSVGframe()
      .setAxes()
      .setListeners();

    $(window).resize(function() {
      insertPlotter();
      console.log('aqui');
    });

  })();

  console.log(window);


});
