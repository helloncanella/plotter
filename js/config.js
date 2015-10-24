/*global requirejs*/

requirejs.config({
  baseUrl:'js',
  paths:{
    jquery:'lib/jquery/dist/jquery.min.js',
    d3:'lib/d3/d3.min.js'
  }
});

require(['main']);
