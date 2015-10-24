/*globals define*/
/*jshint -W098, -W003*/

'use strict';

define(['d3', 'jquery'], function(d3, $) {

  var padding = 40;

  function Plotter(xLimits, yLimits) {
    this.xLimits = xLimits;
    this.yLimits = yLimits;
  }

  Plotter.prototype.insertSVGframe = function() {
    $('svg').remove();

    var
      svg = d3.select('body').append('svg').attr({
        'width': $('body').width(),
        'height': $('body').height()
      });

    this.frame = svg.append('g').attr({
      'transform': 'translate(' + padding / 2.5 + ',' + padding / 2.5 + ')',
      'width': $('body').width(),
      'height': $('body').height(),
      'class': 'frame'
    });

    return this;
  };

  Plotter.prototype.setAxes = function() {

    var
      width = $('svg').width(),
      height = $('svg').height(),
      xScale = d3.scale.linear().domain([this.xLimits[0], this.xLimits[1]]).range([0, width]),
      yScale = d3.scale.linear().domain([this.yLimits[0], this.yLimits[1]]).range([height, 0]);

    console.log(width,height);

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    this.frame
      .append('g')
      .attr({
        class: 'axis',
        transform: 'translate(0,' + (height /2) + ')'
      })
      .call(xAxis);

    this.frame
      .append('g')
      .attr({
        class: 'axis',
        transform: 'translate(' + (width /2) + ',0)'
      })
      .call(yAxis);

    console.log(this.frame, this.xLimits, this.yLimits, width, height);
    return this;
  };


  return Plotter;

});
