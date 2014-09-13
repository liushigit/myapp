"use strict";
requirejs(['./common'], function (config) {

  requirejs(['jquery', 'rainbow'], 
  function ($, rb) {
    $(document).ready(function() {
    	Rainbow.color();
    });
  })
});
