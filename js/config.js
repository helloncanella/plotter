/*global requirejs*/
'use strict';

requirejs.config({
  baseUrl:'js',
  paths:{
    jquery:'lib/jquery/dist/jquery.min',
    d3:'lib/d3/d3'
  }
});

require(['main']);
