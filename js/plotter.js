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

    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    this.xAxis = this.frame
      .append('g')
      .attr('height', '21px')
      .attr({
        class: 'axis X',
        transform: 'translate(0,' + (height / 2) + ')',
        height: '21px'
      })
      .call(xAxis);

    this.yAxis = this.frame
      .append('g')
      .attr('width', '21px')
      .attr({
        class: 'axis Y',
        transform: 'translate(' + (width / 2) + ',0)',
      })
      .call(yAxis);

    return this;
  };

  Plotter.prototype.setListeners = function(e) {


    var
      xSVGHeight = select('.X').node().getBBox().height,
      xTopDistance = $('.X').offset().top-xSVGHeight,
      ySVGWidth = select('.Y').node().getBBox().width,
      yLeftDistance = $('.Y ').offset().left + ySVGWidth,
      abs = Math.abs,
      mouseCloseTo = {
        x: false,
        y: false
      };

    $(window).on({
      mousemove: function(e) {
        var cursorAxisDistance = {
          x: abs(e.clientY - xTopDistance),
          y: abs(e.clientX - yLeftDistance)
        };
        if (cursorAxisDistance.x < 6) {
          mouseCloseTo.x = true;
          $('svg').css('cursor','ew-resize');
        } else if (cursorAxisDistance.y < 6) {
          mouseCloseTo.y = true;
          $('svg').css('cursor','ns-resize');
        } else{
          if(mouseCloseTo.x || mouseCloseTo.y){
            mouseCloseTo = {
              x: false,
              y: false
            };
            $('svg').css('cursor','default');
          }
        }

      },
      mousedown: function(e) {

      }
    });

  };


  return Plotter;

});
