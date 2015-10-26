/*globals define, window*/
/*jshint -W098, -W003*/

'use strict';

define(['d3', 'jquery'], function(d3, $) {

  var
    padding = 40,
    select = d3.select;

  function Plotter(xLimits, yLimits) {
    this.xLimits = xLimits;
    this.yLimits = yLimits;

    console.log(this.xLimits, this.yLimits);
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

    this.svgWidth = $('svg').width();
    this.svgHeight = $('svg').height();

    this.setScale('x');
    this.setScale('y');

    return this;
  };

  Plotter.prototype.setScale = function(axis) {
    if (axis === 'x') {

      $('.X').remove();

      var
        xScale = d3.scale.linear().domain([this.xLimits[0], this.xLimits[1]]).range([0, this.svgWidth]),
        xAxis = d3.svg.axis().scale(xScale).orient('bottom');

      this.frame
        .append('g')
        .attr({
          class: 'axis X',
          transform: 'translate(0,' + (this.svgHeight / 2) + ')',
        })
        .call(xAxis);
    } else if (axis === 'y') {

      $('.Y').remove();

      var
        yScale = d3.scale.linear().domain([this.yLimits[0], this.yLimits[1]]).range([this.svgHeight, 0]),
        yAxis = d3.svg.axis().scale(yScale).orient('left');

      this.frame
        .append('g')
        .attr({
          class: 'axis Y',
          transform: 'translate(' + (this.svgWidth / 2) + ',0)',
        })
        .call(yAxis);

    } else {
      console.error('no apropriate axis entry passed in to the function reScale');
    }

    return this;
  };

  Plotter.prototype.setListeners = function(e) {

    var start, distance;

    var
      xTopDistance = $('.X').offset().top,
      ySVGWidth = select('.Y').node().getBBox().width,
      yLeftDistance = $('.Y ').offset().left + ySVGWidth,
      abs = Math.abs,
      plotter = this,
      isMouseDown = false,
      mouseCloseTo = {
        x: false,
        y: false
      };

    $(window).on({
      mousemove: function(e) {
        var
          mouseCloseAxis = mouseCloseTo.x || mouseCloseTo.y,
          cursorAxisDistance = {
            x: abs(e.pageY - xTopDistance),
            y: abs(e.pageX - yLeftDistance)
          };
        if (cursorAxisDistance.x < 6) {
          mouseCloseTo.x = true;
          $('svg').css('cursor', 'ew-resize');
          if (isMouseDown) {
            if (!start) {
              start = e.pageX;
            } else {
              distance = e.pageX - start;
              console.log(plotter.xLimits, plotter.yLimits);
              plotter.xLimits[0] -= distance / 2;
              plotter.xLimits[1] += distance / 2;
              plotter.setScale('x');
            }
          }
        } else if (cursorAxisDistance.y < 6) {
          mouseCloseTo.y = true;
          $('svg').css('cursor', 'ns-resize');
          if (isMouseDown) {
            if (!start) {
              start = e.pageY;
            } else {
              distance = e.pageY - start;
              plotter.yLimits[0] -= distance / 2;
              plotter.yLimits[1] += distance / 2;
              plotter.setScale('y');
            }
          }
        } else {
          if (mouseCloseAxis) {
            mouseCloseTo = {
              x: false,
              y: false
            };
            $('svg').css('cursor', 'default');
          }
        }

      },
      mousedown: function(e) {
        isMouseDown = true;
      },
      mouseup: function() {
        isMouseDown = false;
        start = null;
      }
    });

  };


  return Plotter;

});
