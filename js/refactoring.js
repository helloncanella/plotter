/*globals define, window*/
/*jshint -W003*/

'use strict';

define(['d3', 'jquery'], function(d3, $) {

  var
    padding = 40,
    select = d3.select;

  function Plotter(xLimits, yLimits) {

    this.body = {
      width: $('body').width(),
      height: $('body').height()
    };

    this.xLimits = {
      data: xLimits,
      graphical: [0, this.body.width]
    };

    this.yLimits = {
      data: yLimits,
      graphical: [this.body, 0]
    };

  }

  Plotter.prototype.insertSVGframe = function() {
    $('svg').remove();
    var plotter = this;

    var
      svg = d3.select('body').append('svg').attr({
        'width': plotter.body.width,
        'height': plotter.body.height
      });

    this.frame = svg.append('g').attr({
      'transform': 'translate(' + padding / 2.5 + ',' + padding / 2.5 + ')',
      'width': '100%',
      'height': '100%',
      'class': 'frame'
    });

    return this;
  };

  Plotter.prototype.setAxes = function() {

    var axes = this.setLimits([this.xLimits, this.yLimits]);
    var svgArray = this.buildSVG(axes);
    this.setCenterPosition(svgArray);

    return this;
  };

  Plotter.prototype.setLimits = function(limits, translation) {
    var
      scales = [],
      svgAxes = [],
      axesLabel = ['X', 'Y'],
      axesOrientation = ['bottom', 'left'];

    limits.forEach(function(limit, i) {
      if (translation[i]) {
        var scaleFunction = scale(limit);
        translation[i].forEach(function(distance, j) {
          limit.data[j] += scaleFunction(distance);
        });
      }

      $('.' + axesLabel[i]).remove();

      scales[i] = scaleD3(limit);
      svgAxes[i] = axisD3(scales[i], axesOrientation[i]);
    });

    return svgAxes;
  };

  Plotter.prototype.buildSVG = function(axes) {
    var
      axesLabel = ['X', 'Y'],
      svgArray = [],
      frame = this.frame;

    axes.forEach(function(axis, i) {
      svgArray[i] =  frame.append('g').attr('class', 'axis ' + axesLabel[i]).call(axes[i]);
    });

    return svgArray;
  };

  Plotter.prototype.setCenterPosition = function (svgArray,center) {

    var translation;

    var axesLabel = ['X', 'Y'];

    if(!center){
      center = [this.body.width/2, this.body.height/2];
    }

    svgArray.forEach(function (svg, i) {
      if(axesLabel[i]==='X'){
        translation = [{x:0,y:center.x}];
      } else if (axesLabel[i]==='Y'){
        translation = [{x:center.y,y:0}];
      }
      svgArray.attr('transform','translate('+translation.x+','+translation.y+')');
    });
  };

  Plotter.prototype.setListeners = function() {

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
        if (cursorAxisDistance.x < 10 && mouseCloseTo.y === false) {
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
          } else {
            if (isMouseDown) {
              if (!start) {
                start = {
                  x: e.pageX,
                  y: e.pageY
                };
              } else {
                var
                  current = {
                    x: e.pageX,
                    y: e.pageY
                  },
                  displacement = {
                    x: current.x - start.x,
                    y: current.y - start.y
                  };
                plotter.translate(displacement);
                start = current;
              }
            }
          }
        }

      },
      mousedown: function() {
        isMouseDown = true;
      },
      mouseup: function() {
        isMouseDown = false;
        start = null;
      }
    });

  };

  //Auxiliary functions
  function scaleD3(dataLimits) {
    if (dataLimits.data[0] > 0 && dataLimits.data[1] < 0) {
      dataLimits = [dataLimits.data[0] * (-1), dataLimits.data[1] * (-1)];
    }
    return d3.scale.linear().domain([dataLimits.data[0], dataLimits.data[1]])
      .range([dataLimits.graphical[0], dataLimits.graphical[1]]);
  }

  function axisD3(scaleD3, orientation) {
    return d3.svg.axis().scale(scaleD3).orient(orientation);
  }

  function scale(dataLimits) {
    return function(distance) {
      return (dataLimits.data[1] - dataLimits.data[0]) / (dataLimits.graphical[1] - dataLimits.graphical[0]) * distance * 8;
    };
  }


  return Plotter;

});
