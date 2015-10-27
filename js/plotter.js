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

  Plotter.prototype.setScale = function(axis, distance) {
    var scaled, xScaleFunction, yScaleFunction;

    if (axis === 'x') {
      $('.X').remove();

      if (distance) {
        xScaleFunction = scale(this.xLimits, [0, this.svgWidth]);
        scaled = xScaleFunction(distance); //XXX Kludge.
        this.xLimits[0] += scaled;
        this.xLimits[1] -= scaled;
      }

      var
        xScale = scaleD3(this.xLimits, [0, this.svgWidth]),
        xAxis = axisD3(xScale,'bottom');

      this.frame
        .append('g')
        .attr({
          class: 'axis X',
          transform: 'translate(0,' + (this.svgHeight / 2) + ')',
        })
        .call(xAxis);
    } else if (axis === 'y') {

      $('.Y').remove();

      if (distance) {
        yScaleFunction = scale(this.yLimits, [this.svgHeight, 0]);
        scaled = yScaleFunction(distance);
        this.yLimits[0] += scaled;
        this.yLimits[1] -= scaled;
      }

      var
        yScale = scaleD3(this.yLimits, [this.svgHeight, 0]),
        yAxis = axisD3(yScale,'left');

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

    //Auxiliary functions
    function scaleD3(dataLimits, graphicalLimits) {
      if(dataLimits[0]>0 && dataLimits[1]<0){
        dataLimits = [dataLimits[0]*(-1),dataLimits[1]*(-1)];
      }
      return d3.scale.linear().domain([dataLimits[0], dataLimits[1]]).range([graphicalLimits[0], graphicalLimits[1]]);
    }

    function axisD3(scaleD3, orientation) {
      return d3.svg.axis().scale(scaleD3).orient(orientation);
    }

    function scale(dataLimits, graphicalLimits) {
      return function(distance) {
        return (dataLimits[1] - dataLimits[0]) / (graphicalLimits[1] - graphicalLimits[0]) * distance * 8;
      };
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
        if (cursorAxisDistance.x < 10  && mouseCloseTo.y === false) {
          mouseCloseTo.x = true;
          $('svg').css('cursor', 'ew-resize');
          if (isMouseDown) {
            if (!start) {
              start = e.pageX;
            } else {
              distance = e.pageX - start;
              plotter.setScale('x', distance);
              start = e.pageX;
            }
          }
        } else if (cursorAxisDistance.y < 10 && mouseCloseTo.x === false) {
          mouseCloseTo.y = true;
          $('svg').css('cursor', 'ns-resize');
          if (isMouseDown) {
            if (!start) {
              start = e.pageY;
            } else {
              distance = e.pageY - start;
              plotter.setScale('y', distance);
              start = e.pageY;
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
